import React, { useState } from 'react';
import { User, Mail, Lock, Linkedin, Github, UserPlus, ArrowLeft, GraduationCap, School, FlaskConical, Globe } from 'lucide-react';
import './Auth.css';

type Role = 'student' | 'teacher' | 'alumnus' | 'outsider';

export const SignupPage: React.FC = () => {
    const [role, setRole] = useState<Role>('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        linkedin: '',
        github: '',
        // Student/Alumni specific
        studentId: '',
        dept: '',
        branch: '',
        semester: '',
        clubs: '',
        gradYear: '',
        // Teacher specific
        teacherId: '',
        specialization: '',
        qualification: '',
        papers: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Signing up as', role, formData);
        // Logic to process LinkedIn/Github and redirect
    };

    return (
        <div className="auth-container bento-container">
            <div className="auth-card signup-card bento-box animate-fade-up">
                <div className="auth-header">
                    <h1 className="text-gradient">Create Account</h1>
                    <p className="subtitle">Join the CUSAT Knowledge Network</p>
                </div>

                <div className="role-selector">
                    <p className="section-label">I am a...</p>
                    <div className="role-chips">
                        {(['student', 'teacher', 'alumnus', 'outsider'] as Role[]).map((r) => (
                            <button 
                                key={r}
                                type="button"
                                className={`role-chip ${role === r ? 'active' : ''}`}
                                onClick={() => setRole(r)}
                            >
                                {r === 'student' && <GraduationCap size={16} />}
                                {r === 'teacher' && <School size={16} />}
                                {r === 'alumnus' && <School size={16} />}
                                {r === 'outsider' && <Globe size={16} />}
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <form className="auth-form multi-col-form" onSubmit={handleSignup}>
                    {/* Common Fields */}
                    <div className="input-group full-width">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input name="name" type="text" placeholder="John Doe" onChange={handleInputChange} required />
                        </div>
                    </div>

                    {role !== 'outsider' && (
                        <>
                            <div className="input-group">
                                <label>Email Address</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input name="email" type="email" placeholder="name@email.com" onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input name="password" type="password" placeholder="••••••••" onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>LinkedIn Profile URL</label>
                                <div className="input-wrapper">
                                    <Linkedin size={18} className="input-icon" />
                                    <input name="linkedin" type="url" placeholder="linkedin.com/in/..." onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>GitHub Profile URL</label>
                                <div className="input-wrapper">
                                    <Github size={18} className="input-icon" />
                                    <input name="github" type="url" placeholder="github.com/..." onChange={handleInputChange} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Student & Alumnus Specific */}
                    {(role === 'student' || role === 'alumnus') && (
                        <>
                            <div className="input-group">
                                <label>Student ID</label>
                                <div className="input-wrapper">
                                    <GraduationCap size={18} className="input-icon" />
                                    <input name="studentId" type="text" placeholder="ID Number" onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Department</label>
                                <div className="input-wrapper">
                                    <School size={18} className="input-icon" />
                                    <input name="dept" type="text" placeholder="e.g. SOE" onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Branch</label>
                                <div className="input-wrapper">
                                    <FlaskConical size={18} className="input-icon" />
                                    <input name="branch" type="text" placeholder="e.g. CSE" onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Current Semester</label>
                                <div className="input-wrapper">
                                    <span className="input-icon-text">S</span>
                                    <select name="semester" onChange={handleInputChange} required>
                                        <option value="">Select...</option>
                                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                    </select>
                                </div>
                            </div>
                            {role === 'alumnus' && (
                                <div className="input-group full-width">
                                    <label>Year of Graduation</label>
                                    <div className="input-wrapper">
                                        <Calendar size={18} className="input-icon" />
                                        <input name="gradYear" type="number" placeholder="202X" onChange={handleInputChange} required />
                                    </div>
                                </div>
                            )}
                            <div className="input-group full-width">
                                <label>Clubs (Comma separated)</label>
                                <div className="input-wrapper">
                                    <UserPlus size={18} className="input-icon" />
                                    <input name="clubs" type="text" placeholder="Dhishna, NSS, Nature Club..." onChange={handleInputChange} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Teacher Specific */}
                    {role === 'teacher' && (
                        <>
                            <div className="input-group">
                                <label>Teacher ID</label>
                                <div className="input-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input name="teacherId" type="text" placeholder="EMP CODE" onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Department</label>
                                <div className="input-wrapper">
                                    <School size={18} className="input-icon" />
                                    <input name="dept" type="text" placeholder="Department Name" onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="input-group full-width">
                                <label>Specialisation</label>
                                <div className="input-wrapper">
                                    <FlaskConical size={18} className="input-icon" />
                                    <input name="specialization" type="text" placeholder="e.g. Machine Learning, Structural Eng..." onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="input-group full-width">
                                <label>Research Papers (Links/Titles)</label>
                                <div className="input-wrapper">
                                    <textarea name="papers" placeholder="List your key publications..." onChange={handleInputChange}></textarea>
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary auth-submit full-width">
                        Create Account <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <a href="/login" className="auth-link"><ArrowLeft size={14} /> Back to Sign In</a></p>
                </div>
            </div>
        </div>
    );
};
