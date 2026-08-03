import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProfile } from '../services/userService.js';
import { getMediaUrl } from '../config/media.js';

export default function UserProfile() {
    const { userId } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            try {
                setIsLoading(true);
                const data = await getPublicProfile(userId);
                setProfileData(data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to load user profile');
            } finally {
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, [userId]);

    if (isLoading) {
        return <div className="loading-state" style={{ padding: '40px' }}>Loading profile...</div>;
    }

    if (error || !profileData) {
        return (
            <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
                <h2 style={{ color: 'var(--et-danger)' }}>Oops!</h2>
                <p>{error || 'User not found'}</p>
                <Link to="/leaderboard" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Leaderboard</Link>
            </div>
        );
    }

    const { user, stats, recentActivities } = profileData;

    return (
        <div className="dashboard-container" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
            
            <Link to="/leaderboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--et-text-muted)', textDecoration: 'none', fontWeight: 600 }}>
                <span>&larr;</span> Back to Leaderboard
            </Link>

            {/* Profile Header Card */}
            <div style={{ background: 'var(--et-bg-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--et-border)', position: 'relative', marginBottom: '32px' }}>
                
                {/* Banner */}
                <div style={{ 
                    height: '160px', 
                    background: user.banner ? `url(${getMediaUrl(user.banner)}) center/cover no-repeat` : 'linear-gradient(135deg, var(--et-primary) 0%, var(--et-accent) 100%)', 
                    position: 'relative' 
                }}>
                    {!user.banner && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>}
                </div>

                {/* Info Section */}
                <div style={{ padding: '0 32px 32px', position: 'relative' }}>
                    
                    {/* Avatar (Overlapping) */}
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--et-bg-card)', background: '#fff', position: 'absolute', top: '-60px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 'bold', color: 'var(--et-primary)' }}>
                        {user.avatar ? (
                            <img src={getMediaUrl(user.avatar)} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            user.username[0].toUpperCase()
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', minHeight: '60px' }}>
                        {/* Optional action buttons could go here */}
                    </div>

                    <div>
                        <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', color: 'var(--et-navy)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {user.username}
                            {user.role === 'admin' && <span style={{ fontSize: '12px', background: 'var(--et-danger)', color: 'white', padding: '4px 8px', borderRadius: 'var(--radius-full)', fontWeight: 'bold', textTransform: 'uppercase' }}>Admin</span>}
                            {user.role === 'teacher' && <span style={{ fontSize: '12px', background: '#eab308', color: 'white', padding: '4px 8px', borderRadius: 'var(--radius-full)', fontWeight: 'bold', textTransform: 'uppercase' }}>Teacher</span>}
                        </h1>
                        <p style={{ color: 'var(--et-text-muted)', fontSize: '14px', margin: 0, marginBottom: '24px' }}>
                            Joined on {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>

                        <div style={{ background: 'var(--et-bg)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--et-border-light)' }}>
                            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--et-text-muted)', margin: '0 0 12px 0', fontWeight: 700 }}>About Me</h3>
                            <p style={{ margin: 0, color: 'var(--et-text)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                {user.description || 'This user prefers to keep an air of mystery about them.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: 'var(--et-navy)' }}>Performance Stats</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: 'var(--et-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--et-border)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--et-primary)', fontFamily: 'Outfit, sans-serif' }}>{stats.examsTaken}</div>
                    <div style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--et-text-muted)', fontWeight: 600, marginTop: '4px' }}>Exams Completed</div>
                </div>
                <div style={{ background: 'var(--et-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--et-border)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b', fontFamily: 'Outfit, sans-serif' }}>{stats.avgOverall || 'N/A'}</div>
                    <div style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--et-text-muted)', fontWeight: 600, marginTop: '4px' }}>Avg Overall Band</div>
                </div>
                <div style={{ background: 'var(--et-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--et-border)', textAlign: 'center', boxShadow: 'var(--shadow-sm)', gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-around' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--et-navy)', fontFamily: 'Outfit, sans-serif' }}>{stats.avgListening || '-'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--et-text-muted)' }}>Listening</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--et-navy)', fontFamily: 'Outfit, sans-serif' }}>{stats.avgReading || '-'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--et-text-muted)' }}>Reading</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--et-navy)', fontFamily: 'Outfit, sans-serif' }}>{stats.avgWriting || '-'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--et-text-muted)' }}>Writing</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--et-navy)', fontFamily: 'Outfit, sans-serif' }}>{stats.avgSpeaking || '-'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--et-text-muted)' }}>Speaking</div>
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: 'var(--et-navy)' }}>Recent Activities</h2>
            {recentActivities.length === 0 ? (
                <div style={{ background: 'var(--et-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--et-border)', textAlign: 'center', color: 'var(--et-text-muted)' }}>
                    No recent activities.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentActivities.map((act) => (
                        <div key={act.sessionId} style={{ background: 'var(--et-bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--et-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--et-navy)' }}>{act.examTitle}</h4>
                                <div style={{ fontSize: '13px', color: 'var(--et-text-muted)' }}>
                                    Completed a {act.skill === 'overall' ? 'Full Exam' : act.skill.charAt(0).toUpperCase() + act.skill.slice(1) + ' test'}
                                </div>
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--et-text-muted)' }}>
                                {new Date(act.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
