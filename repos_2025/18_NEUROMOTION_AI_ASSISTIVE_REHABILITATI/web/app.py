import os
import sys
import subprocess
from functools import wraps
from flask import Response

from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
import pandas as pd

# Load our new MJPEG Generators directly into the same process
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import compare_and_fuse
import refermaker

from models import db, User, Exercise, ExerciseProgress


# --- App Initialization ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'kaizen-super-secret-key-123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rehab.db'
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db.init_app(app)
login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# --- Web Endpoints ---

@app.route("/")
def index():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    return redirect(url_for('login'))


@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated: 
        return redirect(url_for('home'))
        
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            login_user(user)
            if not user.name:
                return redirect(url_for('onboarding'))
            return redirect(url_for('home'))
        else:
            flash('Invalid email or password.')
            
    return render_template("login.html")


@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated: 
        return redirect(url_for('home'))
        
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered.')
            return redirect(url_for('register'))
        
        new_user = User(email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        
        login_user(new_user)
        return redirect(url_for('onboarding'))
        
    return render_template("register.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route("/onboarding", methods=['GET', 'POST'])
@login_required
def onboarding():
    if request.method == 'POST':
        name = request.form.get('name')
        if name: 
            current_user.name = name
        
        # Handle optional medical report upload
        if 'report' in request.files:
            file = request.files['report']
            if file.filename != '':
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                current_user.medical_report_path = filepath
        
        db.session.commit()
        return redirect(url_for('home'))
        
    return render_template("onboarding.html")


@app.route("/home")
@login_required
def home():
    if not current_user.name: 
        return redirect(url_for('onboarding'))
        
    exercises = Exercise.query.all()
    all_prog = ExerciseProgress.query.filter_by(user_id=current_user.id).all()
    
    overall_similarity = sum(p.average_similarity for p in all_prog) / len(all_prog) if all_prog else 0
    recent_progress = sorted(all_prog, key=lambda x: x.date_completed, reverse=True)[:5]
    
    return render_template(
        "home.html", 
        exercises=exercises, 
        user=current_user, 
        recent_progress=recent_progress, 
        overall_similarity=overall_similarity
    )


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            flash("You do not have permission to access that page.")
            return redirect(url_for('home'))
        return f(*args, **kwargs)
    return decorated_function


@app.route("/admin", methods=['GET', 'POST'])
@login_required
@admin_required
def admin():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        duration = int(request.form.get('duration_seconds', 60))
        reps = int(request.form.get('reps', 10))
        
        # New mode: Instead of uploading, they provide a simple basename for the video.
        video_filename = secure_filename(request.form.get('video_base', 'my_perfect_posture')) + ".mp4"
        thumbnail_filename = "shoulder.jpg"
            
        level = int(request.form.get('level', 1))

        new_ex = Exercise(
            title=title,
            description=description,
            duration_seconds=duration,
            reps=reps,
            thumbnail_filename=thumbnail_filename,
            video_filename=video_filename,
            level=level                          # ← only new line
        )
        db.session.add(new_ex)
        db.session.commit()
        
        flash(f'Exercise {title} bound to {video_filename} successfully')
        return redirect(url_for('admin'))
        
    exercises = Exercise.query.all()
    return render_template('admin.html', exercises=exercises)


@app.route("/record_exercise", methods=['POST'])
@login_required
@admin_required
def record_exercise():
    base_name = request.form.get('video_base')
    if not base_name: 
        return jsonify({"error": "No base name"}), 400
        
    base_name = secure_filename(base_name)
    save_path = os.path.join(app.root_path, 'static', 'videos', base_name)
    
    # Launch refermaker.py in a background process
    try:
        subprocess.Popen(["python", "../refermaker.py", "--name", save_path])
        return jsonify({"status": "Recording script launched. Check desktop window."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/daily_routine")
@login_required
def daily_routine():
    first_ex = Exercise.query.order_by(Exercise.id).first()
    if not first_ex:
        flash("No exercises available.")
        return redirect(url_for('home'))
    return redirect(url_for('routine_exercise', exercise_id=first_ex.id))


@app.route("/routine_exercise/<int:exercise_id>")
@login_required
def routine_exercise(exercise_id):
    exercise = Exercise.query.get_or_404(exercise_id)
    next_ex = Exercise.query.filter(Exercise.id > exercise.id).order_by(Exercise.id).first()
    next_id = next_ex.id if next_ex else None
    
    return render_template("physiotherapy.html", exercise=exercise, is_routine=True, next_id=next_id)

@app.route("/api/finish_recording", methods=["POST"])
@login_required
@admin_required
def api_finish_recording():
    import time
    refermaker.RECORD_STATE["is_recording"] = False
    refermaker.RECORD_STATE["running"] = False
    
    # Wait for generator to finish saving (checks every 100ms, max 5 seconds)
    for _ in range(50):
        time.sleep(0.1)
        if not os.path.exists(refermaker.RECORD_STATE.get("_saving", "")):
            break
    
    time.sleep(0.8)  # small buffer for disk flush
    return jsonify({"success": True})
@app.route("/complete_exercise/<int:exercise_id>", methods=['POST'])
@login_required
def complete_exercise(exercise_id):
    data = request.json
    avg_similarity = data.get('average_similarity', 0.0)
    easiness = data.get('easiness_rating', 3)
    
    progress = ExerciseProgress(
        user_id=current_user.id, 
        exercise_id=exercise_id, 
        average_similarity=avg_similarity, 
        easiness_rating=easiness
    )
    db.session.add(progress)
    db.session.commit()
    
    return jsonify({"status": "success"})


@app.route("/profile", methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'POST':
        if 'report' in request.files:
            file = request.files['report']
            if file.filename != '':
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                current_user.medical_report_path = filepath
                db.session.commit()
                flash('Medical report updated successfully.')
                
        return redirect(url_for('profile'))
        
    return render_template("profile.html", user=current_user)


@app.route("/exercise/<int:exercise_id>")
@login_required
def exercise(exercise_id):
    exercise = Exercise.query.get_or_404(exercise_id)
    return render_template("physiotherapy.html", exercise=exercise)


@app.route("/stream_exercise/<int:exercise_id>")
@login_required
def stream_exercise(exercise_id):
    exercise = Exercise.query.get_or_404(exercise_id)
    video_path = os.path.join(app.root_path, 'static', 'videos', exercise.video_filename)
    csv_path = video_path.rsplit('.', 1)[0] + "_data.csv"

    # Reset global state for fresh session
    compare_and_fuse.LATEST_SCORE["running"] = True
    compare_and_fuse.LATEST_SCORE["score"] = 0.0
    compare_and_fuse.LATEST_SCORE["msg"] = "Initializing..."

    if os.path.exists(csv_path):
        ref_df = pd.read_csv(csv_path)
    else:
        ref_df = compare_and_fuse.extract_reference_from_video(video_path)

    return Response(
        compare_and_fuse.generate_live_physio_frames(ref_df, video_path, port="/dev/ttyACM0"),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@app.route("/admin/delete_exercise/<int:exercise_id>", methods=["POST"])
@login_required
@admin_required
def delete_exercise(exercise_id):
    exercise = Exercise.query.get_or_404(exercise_id)

    # Delete video and CSV files from disk
    video_path = os.path.join(app.root_path, 'static', 'videos', exercise.video_filename)
    csv_path   = video_path.rsplit('.', 1)[0] + "_data.csv"

    for fpath in [video_path, csv_path]:
        if os.path.exists(fpath):
            os.remove(fpath)
            print(f"[admin] Deleted: {fpath}")

    # Delete linked progress records first (foreign key constraint)
    ExerciseProgress.query.filter_by(exercise_id=exercise_id).delete()

    db.session.delete(exercise)
    db.session.commit()

    flash(f'Exercise "{exercise.title}" and its files have been deleted.')
    return redirect(url_for('admin'))

@app.route("/api/get_score")
@login_required
def api_get_score():
    # Properly return the actual imported dictionary
    return jsonify(compare_and_fuse.LATEST_SCORE)


@app.route("/api/calibrate_offset", methods=["POST"])
@login_required
def api_calibrate_offset():
    # Trigger the 'c' key behavior in the generator
    compare_and_fuse.LATEST_SCORE["trigger_calib"] = True
    return jsonify({"success": True, "message": "Calibration triggered"})


@app.route("/api/reset_offset", methods=["POST"])
@login_required
def api_reset_offset():
    # Trigger the 'r' key behavior in the generator
    compare_and_fuse.LATEST_SCORE["trigger_reset"] = True
    return jsonify({"success": True, "message": "Calibration reset"})


@app.route("/record_feed/<basename>")
@login_required
@admin_required
def record_feed(basename):
    basename = secure_filename(basename)
    save_path = os.path.join(app.root_path, 'static', 'videos', basename)
    
    # Start the Recorder Generator
    return Response(
        refermaker.generate_record_frames(save_path, port="/dev/ttyACM0"),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )


@app.route("/api/set_record_state", methods=["POST"])
@login_required
@admin_required
def api_set_record_state():
    data = request.json
    status = data.get("is_recording", False)
    refermaker.RECORD_STATE["is_recording"] = status
    return jsonify({"success": True})


@app.route("/api/stop_record_stream", methods=["POST"])
@login_required
@admin_required
def api_stop_record_stream():
    refermaker.RECORD_STATE["running"] = False
    return jsonify({"success": True})


@app.route("/api/stop_play_stream", methods=["POST"])
@login_required
def api_stop_play_stream():
    compare_and_fuse.LATEST_SCORE["running"] = False
    return jsonify({"success": True})


def initialize_database():
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(email='admin@kaizen.com').first():
            admin = User(email='admin@kaizen.com', name='Admin', is_admin=True)
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()

        if not Exercise.query.first():
            test_ex = Exercise(
                title="Shoulder Flexion", 
                description="Lift the arm straight in front to restore mobility.",
                thumbnail_filename="shoulder.jpg",
                video_filename="reference.mp4",
                duration_seconds=60,
                reps=10
            )
            test_ex2 = Exercise(
                title="Elbow Extension", 
                description="Slowly straighten your arm completely.",
                thumbnail_filename="elbow.jpg",
                video_filename="reference2.mp4",
                duration_seconds=45,
                reps=12
            )
            db.session.add(test_ex)
            db.session.add(test_ex2)
            db.session.commit()


if __name__ == "__main__":
    initialize_database()
    app.run(debug=True, port=8080)