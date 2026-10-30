import React, { useState } from 'react';
import { User, Mail, Github, Linkedin, Edit2, LogOut, Briefcase, GraduationCap, Award, BookOpen, Globe, Settings } from 'lucide-react';
import './Profile.css';

export const ProfilePage: React.FC = () => {
    // Simulated logged in user data
    const [user, setUser] = useState({
        name: 'Rahul S. Nair',
        role: 'student',
        email: 'rahul.nair.cs26@cusat.ac.in',
        github: 'https://github.com/rahulnair',
        linkedin: 'https://linkedin.com/in/rahulnair',
        details: {
            studentId: '20220101',
            dept: 'SOE',
            branch: 'CSE',
            semester: '6',
            clubs: ['Dhishna', 'NSS', 'Nexus AI'],
            knowledgePoints: 154,
            projects: ['CUSAT Nexus AI', 'Smart Grid Optimizer']
        }
    });

    return (
        <div className="profile-container bento-container">
            <div className="profile-grid bento-grid">
                
                {/* 1. Profile Header (Main Bento Box) */}
                <div className="bento-box col-span-8 row-span-2 profile-main">
                    <div className="profile-header-content">
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar">
                                <User size={64} />
                            </div>
                            <div className="role-badge">{user.role.toUpperCase()}</div>
                        </div>
                        <div className="profile-info">
                            <h1>{user.name}</h1>
                            <p className="profile-id"><span className="text-muted">ID:</span> {user.details.studentId}</p>
                            <div className="profile-actions">
                                <button className="btn btn-primary btn-sm"><Edit2 size={14} /> Edit Profile</button>
                                <button className="btn btn-ghost btn-sm text-accent"><LogOut size={14} /> Logout</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Knowledge Contribution Stats */}
                <div className="bento-box col-span-4 row-span-1 stats-box">
                    <div className="stat-header">
                        <BookOpen size={20} className="text-primary" />
                        <span>Knowledge Impact</span>
                    </div>
                    <div className="stat-value text-gradient">{user.details.knowledgePoints}</div>
                    <p className="stat-label">Contributions Indexed</p>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width: '75%'}}></div></div>
                </div>

                {/* 3. Social Integration Links */}
                <div className="bento-box col-span-4 row-span-1 social-box">
                    <div className="stat-header">
                        <Globe size={20} className="text-secondary" />
                        <span>Connected Accounts</span>
                    </div>
                    <div className="social-links">
                        <a href={user.github} target="_blank" rel="noreferrer" className="social-pill github">
                            <Github size={16} /> GitHub
                        </a>
                        <a href={user.linkedin} target="_blank" rel="noreferrer" className="social-pill linkedin">
                            <Linkedin size={16} /> LinkedIn
                        </a>
                    </div>
                </div>

                {/* 4. Academic / Professional Details */}
                <div className="bento-box col-span-4 row-span-2 academic-box">
                    <div className="box-header">
                        <GraduationCap size={20} />
                        <h3>Academic Data</h3>
                    </div>
                    <div className="details-list">
                        <div className="detail-item">
                            <span className="label">Department</span>
                            <span className="value">{user.details.dept}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Branch</span>
                            <span className="value">{user.details.branch}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Semester</span>
                            <span className="value">S{user.details.semester}</span>
                        </div>
                    </div>
                </div>

                {/* 5. Projects & Contributions */}
                <div className="bento-box col-span-8 row-span-2 projects-box">
                    <div className="box-header">
                        <Briefcase size={20} />
                        <h3>Syncronized Projects</h3>
                    </div>
                    <div className="projects-grid">
                        {user.details.projects.map((proj, idx) => (
                            <div key={idx} className="project-card">
                                <div className="project-icon"><Award size={18} /></div>
                                <div className="project-info">
                                    <h4>{proj}</h4>
                                    <span className="badge-sync">Indexed</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="sync-section">
                        <p className="text-muted">Updated via GitHub sync 2 hours ago</p>
                        <button className="btn-sync">Sync New Data</button>
                    </div>
                </div>

                {/* 6. Clubs & Community */}
                <div className="bento-box col-span-12 row-span-1 clubs-box">
                    <div className="box-header">
                        <UserPlus size={20} />
                        <h3>Verified Organizations</h3>
                    </div>
                    <div className="clubs-flex">
                        {user.details.clubs.map((club, idx) => (
                            <span key={idx} className="club-chip">{club}</span>
                        ))}
                        <button className="add-club-btn">+ Join New</button>
                    </div>
                </div>

            </div>
        </div>
    );
};
