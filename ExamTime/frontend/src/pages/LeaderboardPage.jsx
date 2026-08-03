import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../services/resultService.js';
import { getMediaUrl } from '../config/media.js';

export default function LeaderboardPage() {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const data = await getLeaderboard();
                setLeaderboard(data);
            } catch (err) {
                console.error('Failed to fetch leaderboard', err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLeaderboard();
    }, []);

    if (isLoading) {
        return <div className="loading-state" style={{ padding: '20px' }}>Loading leaderboard...</div>;
    }

    if (leaderboard.length === 0) {
        return (
            <div style={{ background: 'var(--et-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--et-border)', textAlign: 'center', color: 'var(--et-text-muted)' }}>
                Chưa có dữ liệu bảng xếp hạng.
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h2 style={{ fontSize: '28px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🏆</span> Student Leaderboard
            </h2>
            <div style={{ background: 'var(--et-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--et-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ padding: '0' }}>
                    {leaderboard.map((user, index) => (
                        <div 
                            key={user.userId} 
                            onClick={() => navigate(`/profile/${user.userId}`)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '16px 24px', 
                                borderBottom: '1px solid var(--et-border-light)',
                                background: index < 3 ? 'var(--et-primary-light)' : 'transparent',
                                opacity: index < 3 ? 1 : 0.9,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.background = 'var(--et-bg-hover)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.background = index < 3 ? 'var(--et-primary-light)' : 'transparent' }}
                        >
                            <div style={{ 
                                width: '32px', 
                                fontWeight: 800, 
                                fontSize: index < 3 ? '18px' : '16px',
                                color: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : 'var(--et-text-muted)'
                            }}>
                                #{index + 1}
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--et-bg)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', overflow: 'hidden', marginRight: '16px', color: 'var(--et-primary-dark)', boxShadow: 'var(--shadow-sm)' }}>
                                {user.avatar ? <img src={getMediaUrl(user.avatar)} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.username[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, color: index < 3 ? 'var(--et-primary-dark)' : 'var(--et-text)', fontSize: '16px' }}>{user.username}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, fontSize: '20px', color: 'var(--et-primary)', fontFamily: 'Outfit, sans-serif' }}>{user.examCount}</div>
                                <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--et-text-muted)', fontWeight: 600 }}>Exams Completed</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
