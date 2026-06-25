import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconLeaf, IconLock, IconMail } from '@tabler/icons-react';
import { ROUTES } from '../../constants/routes';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('analyst@bankorg.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate(ROUTES.DASHBOARD); }, 800);
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)' }}>
      <div style={{ width: '100%', maxWidth: 384 }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 8px 24px rgba(14,165,233,0.4)' }}>
            <IconLeaf size={28} style={{ color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.025em' }}>PCAF Platform</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6, textAlign: 'center' }}>Partnership for Carbon Accounting Financials</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 25px 50px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 32px', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Sign in to your account</h2>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Report and track financed emissions</p>
          </div>
          <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="field-label">Work Email<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <IconMail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="you@institution.com" className="field-input" style={{ paddingLeft: 36 }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label className="field-label" style={{ margin: 0 }}>Password<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
                <span style={{ fontSize: 12, color: '#0284c7', fontWeight: 500, cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <IconLock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="••••••••" className="field-input" style={{ paddingLeft: 36 }} />
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: loading ? 0.75 : 1 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 24 }}>PCAF Standard v2.1 · TCFD aligned · ISO 14064-3</p>
      </div>
    </div>
  );
}
