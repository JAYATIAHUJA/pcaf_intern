import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconChevronDown, IconUser, IconSettings, IconLogout, IconMenu2, IconKey } from '@tabler/icons-react';
import { PAGE_TITLES, ROUTES } from '../constants/routes';
import { apiJson, apiRequest } from '../lib/api';
import toast from 'react-hot-toast';

interface CurrentUserResponse {
  user: { name: string; email: string };
  role: string;
}

export default function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[location.pathname] ?? 'PCAF Platform';
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [role, setRole] = useState<string>('Viewer');
  const profileRef = useRef<HTMLDivElement>(null);

  // Change Password states
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate(ROUTES.LOGIN);
      return;
    }

    // Check sessionStorage cache first
    const cachedUser = sessionStorage.getItem('auth_user');
    const cachedRole = sessionStorage.getItem('auth_role');
    if (cachedUser && cachedRole) {
      setUser(JSON.parse(cachedUser));
      setRole(cachedRole);
      return;
    }

    apiJson<CurrentUserResponse>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(data => {
        setUser(data.user);
        setRole(data.role);
        sessionStorage.setItem('auth_user', JSON.stringify(data.user));
        sessionStorage.setItem('auth_role', data.role);
        if ((data as any).permissions) {
          sessionStorage.setItem('auth_permissions', JSON.stringify((data as any).permissions));
        }
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.clear();
        navigate(ROUTES.LOGIN);
      });
  }, [navigate]);

  function handleLogout() {
    setProfileOpen(false);
    const refreshToken = localStorage.getItem('refresh_token');
    apiRequest('/auth/logout', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    }).catch(err => console.error(err));
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.clear(); // Wipe client-side cache
    navigate(ROUTES.LOGIN);
  }

  function clearChangePasswordFields() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    apiJson('/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    })
      .then(() => {
        toast.success('Password changed successfully! Sessions updated.');
        setChangePasswordOpen(false);
        clearChangePasswordFields();
        // Since password changed, sessions were revoked. Force log out & re-login.
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        navigate(ROUTES.LOGIN);
      })
      .catch(err => {
        toast.error(err.message || 'Failed to change password');
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  const initials = user
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'DA';

  return (
    <header className="topbar">
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onToggleSidebar} className="btn-icon" style={{ border: 'none', background: 'none' }}>
          <IconMenu2 size={18} style={{ color: '#64748b' }} />
        </button>
        <h1 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{title}</h1>
      </div>

      {/* Right profile menu */}
      <div style={{ position: 'relative' }} ref={profileRef}>
        <button
          onClick={() => setProfileOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
        >
          <div className="avatar avatar-md" style={{ background: '#7c3aed' }}>{initials}</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', lineHeight: 1.25 }}>{user ? user.name : 'Loading...'}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{role}</div>
          </div>
          <IconChevronDown size={14} style={{ color: '#94a3b8', transition: 'transform 0.15s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>

        {profileOpen && (
          <div className="profile-dropdown">
            <div className="profile-dropdown-header">
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{user ? user.name : 'Loading...'}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{user ? user.email : ''}</div>
            </div>
            <div>
              <button className="profile-dropdown-item" onClick={() => { setProfileOpen(false); setChangePasswordOpen(true); }}>
                <IconKey size={15} style={{ color: '#94a3b8' }} /> Change Password
              </button>
              <button className="profile-dropdown-item" onClick={() => { setProfileOpen(false); navigate(ROUTES.SETTINGS); }}>
                <IconSettings size={15} style={{ color: '#94a3b8' }} /> Settings
              </button>
            </div>
            <div className="profile-dropdown-divider">
              <button className="profile-dropdown-item profile-dropdown-item-danger" onClick={handleLogout}>
                <IconLogout size={15} /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {changePasswordOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Change Password</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Update your account password securely</p>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="field-label" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#475569', marginBottom: 4 }}>Current Password<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="field-input" placeholder="••••••••" style={{ width: '100%' }} />
              </div>
              <div>
                <label className="field-label" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#475569', marginBottom: 4 }}>New Password<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="field-input" placeholder="••••••••" style={{ width: '100%' }} />
              </div>
              <div>
                <label className="field-label" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#475569', marginBottom: 4 }}>Confirm New Password<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="field-input" placeholder="••••••••" style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button className="btn" style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }} onClick={() => { setChangePasswordOpen(false); clearChangePasswordFields(); }}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleChangePassword} disabled={submitting} style={{ borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>
                  {submitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
