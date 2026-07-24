import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconLeaf, IconLock, IconMail, IconKey } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { ROUTES } from '../../constants/routes';
import { apiJson } from '../../lib/api';

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: { name: string };
}

interface ForgotResponse {
  success: boolean;
  message: string;
  token?: string;
}

interface ResetResponse {
  success: boolean;
}

type AuthMode = 'login' | 'forgot' | 'reset';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('password');
  
  // Forgot / Reset states
  const [mode, setMode] = useState<AuthMode>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [mockToken, setMockToken] = useState('');
  
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    if (!email) {
      toast.error('Email is required');
      return;
    }
    setLoading(true);
    apiJson<LoginResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(data => {
        sessionStorage.clear(); // Wipe cached profile details on new login
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate(ROUTES.DASHBOARD);
      })
      .catch(err => {
        toast.error(err.message || 'Connection error. Is the server running?');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleForgotPassword() {
    if (!resetEmail) {
      toast.error('Email is required');
      return;
    }
    setLoading(true);
    apiJson<ForgotResponse>('/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail })
    })
      .then(data => {
        toast.success(data.message || 'Reset token generated');
        if (data.token) {
          setMockToken(data.token);
          setResetToken(data.token); // autofill for ease of testing
        }
        setMode('reset');
      })
      .catch(err => {
        toast.error(err.message || 'Failed to request reset token');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleResetPassword() {
    if (!resetToken || !newPassword) {
      toast.error('Reset token and new password are required');
      return;
    }
    setLoading(true);
    apiJson<ResetResponse>('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail, token: resetToken, password: newPassword })
    })
      .then(() => {
        toast.success('Password reset successfully! Please sign in.');
        setPassword('');
        setEmail(resetEmail); // pre-populate email on login page
        setMode('login');
      })
      .catch(err => {
        toast.error(err.message || 'Failed to reset password');
      })
      .finally(() => {
        setLoading(false);
      });
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
          
          {mode === 'login' && (
            <>
              <div style={{ padding: '20px 32px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Sign in to your account</h2>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Report and track financed emissions</p>
              </div>
              <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="field-label">Work Email<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <IconMail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="you@institution.com" className="field-input" style={{ paddingLeft: 36 }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label className="field-label" style={{ margin: 0 }}>Password<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
                    <span 
                      onClick={() => { setResetEmail(email); setMode('forgot'); }} 
                      style={{ fontSize: 12, color: '#0284c7', fontWeight: 500, cursor: 'pointer' }}
                    >
                      Forgot password?
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <IconLock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Password" className="field-input" style={{ paddingLeft: 36 }} />
                  </div>
                </div>
                <button onClick={handleLogin} disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: loading ? 0.75 : 1 }}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <div style={{ padding: '20px 32px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Forgot Password</h2>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Request a token to reset your password</p>
              </div>
              <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="field-label">Work Email<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <IconMail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleForgotPassword()} placeholder="you@institution.com" className="field-input" style={{ paddingLeft: 36 }} />
                  </div>
                </div>
                <button onClick={handleForgotPassword} disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: loading ? 0.75 : 1 }}>
                  {loading ? 'Sending Request...' : 'Send Reset Code'}
                </button>
                <button 
                  onClick={() => setMode('login')} 
                  style={{ width: '100%', border: 'none', background: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer', textAlign: 'center', textDecoration: 'underline' }}
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}

          {mode === 'reset' && (
            <>
              <div style={{ padding: '20px 32px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Reset Password</h2>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Enter the verification code and your new password</p>
              </div>
              <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {mockToken && (
                  <div style={{ padding: 12, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, fontSize: 12, color: '#0369a1' }}>
                    <strong>Wireframe Test Code:</strong> {mockToken} (Autofilled below)
                  </div>
                )}
                
                <div>
                  <label className="field-label">Reset Token<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <IconKey size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" value={resetToken} onChange={e => setResetToken(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleResetPassword()} placeholder="6-Digit Reset Code" className="field-input" style={{ paddingLeft: 36 }} />
                  </div>
                </div>
                
                <div>
                  <label className="field-label">New Password<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <IconLock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleResetPassword()} placeholder="At least 6 characters" className="field-input" style={{ paddingLeft: 36 }} />
                  </div>
                </div>
                
                <button onClick={handleResetPassword} disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: loading ? 0.75 : 1 }}>
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
                <button 
                  onClick={() => setMode('login')} 
                  style={{ width: '100%', border: 'none', background: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer', textAlign: 'center', textDecoration: 'underline' }}
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}

        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 24 }}>PCAF Standard v2.1 - TCFD aligned - ISO 14064-3</p>
      </div>
    </div>
  );
}
