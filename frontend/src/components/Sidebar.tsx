import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  IconLayoutDashboard, IconCapture, IconBuilding, IconCar,
  IconHome2, IconBriefcase, IconSettings, IconUsers, IconShield,
  IconChevronDown, IconChevronRight, IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand, IconLeaf, IconHistory
} from '@tabler/icons-react';
import { ROUTES } from '../constants/routes';
import { apiJson } from '../lib/api';

interface NavItem {
  label: string; path?: string; icon: React.ReactNode;
  children?: { label: string; path: string; icon: React.ReactNode }[];
}

const NAV: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <IconLayoutDashboard size={18} /> },
  {
    label: 'Capture Data', icon: <IconCapture size={18} />,
    children: [
      { label: 'Business Loan', path: ROUTES.DATA_CAPTURE_BUSINESS_LOANS, icon: <IconBriefcase size={15} /> },
      { label: 'Motor Vehicle', path: ROUTES.DATA_CAPTURE_MOTOR_VEHICLE, icon: <IconCar size={15} /> },
      { label: 'Commercial Real Estate', path: ROUTES.DATA_CAPTURE_COMMERCIAL_RE, icon: <IconBuilding size={15} /> },
      { label: 'Mortgage Loans', path: ROUTES.DATA_CAPTURE_MORTGAGE, icon: <IconHome2 size={15} /> },
    ],
  },
  { label: 'Loan Configuration', path: ROUTES.LOAN_CONFIGURATION, icon: <IconBriefcase size={18} /> },
  { label: 'User Management', path: ROUTES.USER_MANAGEMENT, icon: <IconUsers size={18} /> },
  { label: 'Role Management', path: ROUTES.ROLE_MANAGEMENT, icon: <IconShield size={18} /> },
  { label: 'Audit Trail', path: ROUTES.AUDIT_TRAIL, icon: <IconHistory size={18} /> },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: <IconSettings size={18} /> },
];

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>(['Capture Data']);
  const [userRole, setUserRole] = useState<string>('Viewer');
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  
  const toggleGroup = (label: string) => setOpenGroups(g => g.includes(label) ? g.filter(l => l !== label) : [...g, label]);
  const isChildActive = (children: { path: string }[]) => children.some(c => location.pathname === c.path);
  const W = collapsed ? 64 : 232;

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    // Check sessionStorage cache first
    const cachedRole = sessionStorage.getItem('auth_role');
    const cachedPerms = sessionStorage.getItem('auth_permissions');
    if (cachedRole) {
      setUserRole(cachedRole);
      if (cachedPerms) {
        setPermissions(JSON.parse(cachedPerms));
      }
      return;
    }
    
    apiJson<{ role: string; permissions?: Record<string, string[]> }>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(data => {
        setUserRole(data.role);
        sessionStorage.setItem('auth_role', data.role);
        if (data.permissions) {
          setPermissions(data.permissions);
          sessionStorage.setItem('auth_permissions', JSON.stringify(data.permissions));
        }
      })
      .catch(err => {
        console.error('Sidebar auth fetch failed', err);
      });
  }, [location.pathname]);

  // Sidebar authorization filter
  const isAuthorized = (label: string) => {
    if (!permissions || Object.keys(permissions).length === 0) {
      if (label === 'User Management') return userRole === 'Super Admin' || userRole === 'Risk Officer';
      if (label === 'Role Management') return userRole === 'Super Admin';
      if (label === 'Settings') return userRole === 'Super Admin' || userRole === 'Risk Officer';
      if (label === 'Audit Trail') return userRole === 'Super Admin' || userRole === 'Risk Officer' || userRole === 'Auditor';
      return true;
    }

    if (label === 'Dashboard') return permissions['Dashboard']?.includes('view');
    if (label === 'Capture Data') return permissions['Data Capture']?.includes('view');
    if (label === 'Loan Configuration') return permissions['Loan Configuration']?.includes('view');
    if (label === 'User Management') return permissions['User Management']?.includes('view');
    if (label === 'Role Management') return permissions['Role Management']?.includes('view');
    if (label === 'Settings') return permissions['Settings']?.includes('view');
    if (label === 'Audit Trail') return permissions['Audit Trail']?.includes('view');

    return true;
  };

  const visibleNav = NAV.filter(item => isAuthorized(item.label));

  return (
    <aside style={{ width: W, minWidth: W, background: '#0f172a', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, zIndex: 50, transition: 'width 0.2s ease', overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '16px 0' : '16px', justifyContent: collapsed ? 'center' : 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: 60 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconLeaf size={16} style={{ color: '#fff' }} />
        </div>
        {!collapsed && (
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.25 }}>PCAF Platform</div>
            <div style={{ color: '#64748b', fontSize: 10, letterSpacing: '0.025em' }}>Carbon Accounting</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {visibleNav.map(item => {
          const groupOpen = openGroups.includes(item.label);
          const childActive = item.children ? isChildActive(item.children) : false;

          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={`nav-item${childActive ? ' nav-item-active' : ''}`}
                  style={{ justifyContent: collapsed ? 'center' : 'space-between', width: collapsed ? 48 : 'calc(100% - 16px)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && <span style={{ color: '#475569' }}>{groupOpen ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}</span>}
                </button>
                {groupOpen && !collapsed && (
                  <div style={{ marginTop: 2, marginBottom: 4, marginLeft: 8, paddingLeft: 12, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                    {item.children.map(child => (
                      <NavLink key={child.path} to={child.path} style={{ textDecoration: 'none', display: 'block' }}>
                        {({ isActive }) => (
                          <div className={`nav-sub-item${isActive ? ' nav-sub-item-active' : ''}`}>
                            {child.icon}<span>{child.label}</span>
                          </div>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink key={item.path} to={item.path!} style={{ textDecoration: 'none', display: 'block' }}>
              {({ isActive }) => (
                <div className={`nav-item${isActive ? ' nav-item-active' : ''}`} style={{ justifyContent: collapsed ? 'center' : 'flex-start', width: collapsed ? 48 : 'calc(100% - 16px)' }}>
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderTop: '1px solid rgba(255,255,255,0.05)', color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.15s', fontSize: 12, fontWeight: 500 }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#cbd5e1'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748b'; }}
      >
        {collapsed ? <IconLayoutSidebarLeftExpand size={18} /> : <><IconLayoutSidebarLeftCollapse size={18} /><span>Collapse</span></>}
      </button>
    </aside>
  );
}
