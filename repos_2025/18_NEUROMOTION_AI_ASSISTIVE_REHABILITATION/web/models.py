# User and Exercise models for the Kaizen app
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(150), nullable=True)
    medical_report_path = db.Column(db.String(500), nullable=True)
    is_admin = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    thumbnail_filename = db.Column(db.String(150), nullable=False)
    video_filename = db.Column(db.String(150), nullable=False)
    duration_seconds = db.Column(db.Integer, default=60)
    reps = db.Column(db.Integer, default=10)
    # Difficulty level: 1=Beginner, 2=Easy, 3=Moderate, 4=Advanced
    level = db.Column(db.Integer, default=1, nullable=False)


class ExerciseProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'), nullable=False)
    date_completed = db.Column(db.DateTime, default=db.func.current_timestamp())
    average_similarity = db.Column(db.Float, nullable=False)
    easiness_rating = db.Column(db.Integer, nullable=False)  # 1-5 scale