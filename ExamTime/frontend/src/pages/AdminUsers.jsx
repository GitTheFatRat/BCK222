import { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../services/adminService.js';
import { getMediaUrl } from '../config/media.js';
import { useSelector } from 'react-redux';

export default function AdminUsers() {
    const currentUser = useSelector((state) => state.auth.user);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Lỗi khi tải danh sách người dùng.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        setFormError('');
        if (mode === 'edit' && user) {
            setSelectedUserId(user._id);
            setFormData({
                username: user.username,
                email: user.email,
                password: '', // Do not populate password
                role: user.role
            });
        } else {
            setSelectedUserId(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'student'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError('');

        try {
            if (modalMode === 'add') {
                await createUser(formData);
            } else {
                await updateUser(selectedUserId, formData);
            }
            await fetchUsers();
            handleCloseModal();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Có lỗi xảy ra.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (id === currentUser._id) {
            alert('Bạn không thể xóa chính mình.');
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác.')) {
            try {
                await deleteUser(id);
                setUsers(users.filter(u => u._id !== id));
            } catch (err) {
                alert(err.response?.data?.message || 'Lỗi khi xóa người dùng.');
            }
        }
    };

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2>User Management</h2>
                    <p className="admin-dashboard-subtitle">Manage all user accounts in the system</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--et-border)',
                            background: 'var(--et-bg)',
                            outline: 'none',
                            width: '260px'
                        }}
                    />
                    <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                        + Add New User
                    </button>
                </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            {isLoading ? (
                <p className="loading-state">Đang tải danh sách người dùng...</p>
            ) : (
                <div style={{ background: 'var(--et-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--et-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'var(--et-bg)', color: 'var(--et-text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                            <tr>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--et-border-light)' }}>User</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--et-border-light)' }}>Email</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--et-border-light)' }}>Role</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--et-border-light)' }}>Joined Date</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--et-border-light)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--et-text-muted)' }}>
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(u => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid var(--et-border-light)', transition: 'background-color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--et-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--et-primary-light)', color: 'var(--et-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', overflow: 'hidden' }}>
                                            {u.avatar ? <img src={getMediaUrl(u.avatar)} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.username[0].toUpperCase()}
                                        </div>
                                        <span style={{ fontWeight: 600, color: 'var(--et-text)' }}>{u.username}</span>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--et-text-muted)' }}>{u.email}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ 
                                            padding: '4px 12px', 
                                            borderRadius: '20px', 
                                            fontSize: '12px', 
                                            fontWeight: 700, 
                                            textTransform: 'uppercase',
                                            background: u.role === 'admin' ? 'var(--et-primary-light)' : (u.role === 'teacher' ? 'var(--et-warning-light)' : 'var(--et-bg)'),
                                            color: u.role === 'admin' ? 'var(--et-primary-dark)' : (u.role === 'teacher' ? 'var(--et-warning)' : 'var(--et-text-muted)'),
                                            border: (u.role === 'admin' || u.role === 'teacher') ? 'none' : '1px solid var(--et-border)'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--et-text-muted)', fontSize: '14px' }}>
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <button 
                                            onClick={() => handleOpenModal('edit', u)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--et-primary)', cursor: 'pointer', fontWeight: 600, marginRight: '16px' }}
                                        >
                                            Edit
                                        </button>
                                        {u._id !== currentUser?._id && (
                                            <button 
                                                onClick={() => handleDeleteUser(u._id)}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--et-danger)', cursor: 'pointer', fontWeight: 600 }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'var(--et-bg-card)', width: '100%', maxWidth: '400px', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-xl)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px' }}>
                            {modalMode === 'add' ? 'Add New User' : 'Edit User'}
                        </h3>
                        {formError && <p className="form-error" style={{ marginBottom: '16px' }}>{formError}</p>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Username</label>
                                <input 
                                    type="text" 
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--et-border)', background: 'var(--et-bg)', outline: 'none' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--et-border)', background: 'var(--et-bg)', outline: 'none' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
                                    Password {modalMode === 'edit' && <span style={{ fontWeight: 400, color: 'var(--et-text-muted)' }}>(Leave blank to keep current)</span>}
                                </label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={modalMode === 'add'}
                                    minLength="6"
                                    style={{ width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--et-border)', background: 'var(--et-bg)', outline: 'none' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Role</label>
                                <select 
                                    name="role" 
                                    value={formData.role} 
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--et-border)', background: 'var(--et-bg)', outline: 'none', cursor: 'pointer' }}
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={handleCloseModal} className="btn" style={{ background: 'transparent', color: 'var(--et-text-muted)' }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
