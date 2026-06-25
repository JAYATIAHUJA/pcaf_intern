import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconChevronDown, IconUser, IconSettings, IconLogout, IconMenu2 } from '@tabler/icons-react';
import { PAGE_TITLES, ROUTES } from '../constants/routes';

export default function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[location.pathname] ?? 'PCAF Platform';
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <header className="topbar">
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onToggleSidebar} className="btn-icon" style={{ border: 'none', background: 'none' }}>
          <IconMenu2 size={18} style={{ color: '#64748b' }} />
        </button>
        <h1 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{title}</h1>
      </div>

      {/* Right — profile only */}
      <div style={{ position: 'relative' }} ref={profileRef}>
        <button
          onClick={() => setProfileOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
        >
          <div className="avatar avatar-md" style={{ background: '#7c3aed' }}>DA</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', lineHeight: 1.25 }}>Demo Account</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Administrator</div>
          </div>
          <IconChevronDown size={14} style={{ color: '#94a3b8', transition: 'transform 0.15s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>

        {profileOpen && (
          <div className="profile-dropdown">
            <div className="profile-dropdown-header">
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Demo Account</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>demo@pcaf.org</div>
            </div>
            <div>
              <button className="profile-dropdown-item" onClick={() => setProfileOpen(false)}>
                <IconUser size={15} style={{ color: '#94a3b8' }} /> Profile
              </button>
              <button className="profile-dropdown-item" onClick={() => { setProfileOpen(false); navigate(ROUTES.SETTINGS); }}>
                <IconSettings size={15} style={{ color: '#94a3b8' }} /> Settings
              </button>
            </div>
            <div className="profile-dropdown-divider">
              <button className="profile-dropdown-item profile-dropdown-item-danger" onClick={() => { setProfileOpen(false); navigate(ROUTES.LOGIN); }}>
                <IconLogout size={15} /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
