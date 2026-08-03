import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/slices/authSlice.js';
import { updateProfile, uploadAvatar, uploadBanner } from '../services/authService.js';
import { getMediaUrl } from '../config/media.js';

export default function Settings() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [description, setDescription] = useState(user?.description || '');
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar ? getMediaUrl(user.avatar) : null);
    const [bannerPreview, setBannerPreview] = useState(user?.banner ? getMediaUrl(user.banner) : null);
    const fileInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [isSubmittingAvatar, setIsSubmittingAvatar] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');
    const [profileError, setProfileError] = useState('');
    const [avatarMessage, setAvatarMessage] = useState('');
    const [avatarError, setAvatarError] = useState('');
    const [isSubmittingBanner, setIsSubmittingBanner] = useState(false);
    const [bannerMessage, setBannerMessage] = useState('');
    const [bannerError, setBannerError] = useState('');
    const [isSubmittingDescription, setIsSubmittingDescription] = useState(false);
    const [descriptionMessage, setDescriptionMessage] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    useEffect(() => {
        // Cleanup object URL on unmount or when avatarPreview/bannerPreview changes
        return () => {
            if (avatarPreview && avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
            if (bannerPreview && bannerPreview.startsWith('blob:')) {
                URL.revokeObjectURL(bannerPreview);
            }
        };
    }, [avatarPreview, bannerPreview]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingProfile(true);
        setProfileMessage('');
        setProfileError('');
        try {
            const payload = { currentPassword };
            if (username && username !== user.username) payload.username = username;
            if (email && email !== user.email) payload.email = email;
            if (password) payload.password = password;

            if (!currentPassword) {
                setProfileError('Current password is required to make changes.');
                setIsSubmittingProfile(false);
                return;
            }

            const response = await updateProfile(payload);
            dispatch(updateUser(response.user));
            setProfileMessage('Profile updated successfully.');
            setPassword(''); // Clear password fields
            setCurrentPassword('');
        } catch (error) {
            setProfileError(error.response?.data?.message || 'Error updating profile.');
        } finally {
            setIsSubmittingProfile(false);
        }
    };

    const handleDescriptionSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingDescription(true);
        setDescriptionMessage('');
        setDescriptionError('');
        try {
            const response = await updateProfile({ description });
            dispatch(updateUser(response.user));
            setDescriptionMessage('About Me updated successfully.');
        } catch (error) {
            setDescriptionError(error.response?.data?.message || 'Error updating description.');
        } finally {
            setIsSubmittingDescription(false);
        }
    };

    const handleAvatarClick = () => {
        if (!isSubmittingAvatar) {
            fileInputRef.current.click();
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Cleanup previous blob URL if exists
            if (avatarPreview && avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
            
            // Preview using createObjectURL
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);

            // Upload immediately
            setIsSubmittingAvatar(true);
            setAvatarMessage('');
            setAvatarError('');
            try {
                const formData = new FormData();
                formData.append('avatar', file);

                const response = await uploadAvatar(formData);
                dispatch(updateUser(response.user));
                setAvatarMessage('Avatar updated successfully.');
            } catch (error) {
                setAvatarError(error.response?.data?.message || 'Error uploading avatar.');
            } finally {
                setIsSubmittingAvatar(false);
                // Reset input value so same file can be selected again if needed
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const handleBannerClick = () => {
        if (!isSubmittingBanner) {
            bannerInputRef.current.click();
        }
    };

    const handleBannerChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Cleanup previous blob URL if exists
            if (bannerPreview && bannerPreview.startsWith('blob:')) {
                URL.revokeObjectURL(bannerPreview);
            }
            
            // Preview using createObjectURL
            const objectUrl = URL.createObjectURL(file);
            setBannerPreview(objectUrl);

            // Upload immediately
            setIsSubmittingBanner(true);
            setBannerMessage('');
            setBannerError('');
            try {
                const formData = new FormData();
                formData.append('banner', file);

                const response = await uploadBanner(formData);
                dispatch(updateUser(response.user));
                setBannerMessage('Banner updated successfully.');
            } catch (error) {
                setBannerError(error.response?.data?.message || 'Error uploading banner.');
            } finally {
                setIsSubmittingBanner(false);
                // Reset input value so same file can be selected again if needed
                if (bannerInputRef.current) bannerInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="settings-page" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '32px' }}>Settings</h1>

            <section className="settings-section" style={{ background: 'var(--et-bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '32px', border: '1px solid var(--et-border)' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Avatar</h2>
                {avatarMessage && <div className="form-success" style={{ color: 'green', marginBottom: '16px' }}>{avatarMessage}</div>}
                {avatarError && <div className="form-error">{avatarError}</div>}
                
                <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '24px', cursor: isSubmittingAvatar ? 'not-allowed' : 'pointer' }} 
                    onClick={handleAvatarClick} 
                    title="Click to change avatar"
                >
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#64748b', flexShrink: 0, position: 'relative' }}>
                        {isSubmittingAvatar && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--et-navy)' }}>...</span>
                            </div>
                        )}
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                            user?.username?.[0]?.toUpperCase() || 'U'
                        )}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, color: 'var(--et-navy)', marginBottom: '4px' }}>Click to change avatar</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>JPEG, PNG, WEBP (Max 2MB)</div>
                    </div>
                    <input 
                        type="file" 
                        accept="image/jpeg, image/png, image/webp" 
                        onChange={handleAvatarChange} 
                        ref={fileInputRef}
                        style={{ display: 'none' }} 
                    />
                </div>
            </section>

            <section className="settings-section" style={{ background: 'var(--et-bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '32px', border: '1px solid var(--et-border)' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Profile Banner</h2>
                {bannerMessage && <div className="form-success" style={{ color: 'green', marginBottom: '16px' }}>{bannerMessage}</div>}
                {bannerError && <div className="form-error">{bannerError}</div>}
                
                <div 
                    style={{ 
                        height: '140px', 
                        borderRadius: 'var(--radius-md)', 
                        background: bannerPreview ? `url(${bannerPreview}) center/cover no-repeat` : 'linear-gradient(135deg, var(--et-primary) 0%, var(--et-accent) 100%)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: isSubmittingBanner ? 'not-allowed' : 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '2px dashed var(--et-border)',
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                    }} 
                    onClick={handleBannerClick} 
                    title="Click to change banner"
                >
                    {isSubmittingBanner && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--et-navy)', textShadow: 'none' }}>Uploading...</span>
                        </div>
                    )}
                    {!bannerPreview && !isSubmittingBanner && <span>Click to upload banner image</span>}
                    {bannerPreview && !isSubmittingBanner && <div style={{ background: 'rgba(0,0,0,0.4)', padding: '8px 16px', borderRadius: 'var(--radius-sm)' }}>Click to change banner</div>}
                    
                    <input 
                        type="file" 
                        accept="image/jpeg, image/png, image/webp" 
                        onChange={handleBannerChange} 
                        ref={bannerInputRef}
                        style={{ display: 'none' }} 
                    />
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>JPEG, PNG, WEBP (Max 2MB). Recommended size: 1200x300px.</div>
            </section>

            <section className="settings-section" style={{ background: 'var(--et-bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '32px', border: '1px solid var(--et-border)' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>About Me</h2>
                {descriptionMessage && <div className="form-success" style={{ color: 'green', marginBottom: '16px' }}>{descriptionMessage}</div>}
                {descriptionError && <div className="form-error">{descriptionError}</div>}
                <form onSubmit={handleDescriptionSubmit}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label>Short Bio / Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell the community a bit about yourself..."
                            rows={4}
                            maxLength={500}
                            style={{ 
                                padding: '12px', 
                                borderRadius: 'var(--radius-md)', 
                                border: '1px solid var(--et-border)',
                                background: 'var(--et-bg)',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                            }}
                        />
                        <div style={{ fontSize: '12px', color: 'var(--et-text-muted)', textAlign: 'right' }}>
                            {description.length}/500
                        </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <button type="submit" className="btn btn-primary" disabled={isSubmittingDescription}>
                            {isSubmittingDescription ? 'Saving...' : 'Save Bio'}
                        </button>
                    </div>
                </form>
            </section>

            <section className="settings-section" style={{ background: 'var(--et-bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--et-border)' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Profile Information</h2>
                {profileMessage && <div className="form-success" style={{ color: 'green', marginBottom: '16px' }}>{profileMessage}</div>}
                {profileError && <div className="form-error">{profileError}</div>}
                <form onSubmit={handleProfileSubmit}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label>Current Password *</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Required to save changes"
                            required
                            style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--et-border)', background: 'var(--et-bg)' }}
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                        <label>New Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={user?.username || 'Enter new username'}
                            style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--et-border)', background: 'var(--et-bg)' }}
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                        <label>New Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={user?.email || 'Enter new email'}
                            style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--et-border)', background: 'var(--et-bg)' }}
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                        <label>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Leave blank to keep current (min 6 chars)"
                        />
                    </div>
                    <div style={{ marginTop: '24px' }}>
                        <button type="submit" className="btn btn-primary" disabled={isSubmittingProfile}>
                            {isSubmittingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
