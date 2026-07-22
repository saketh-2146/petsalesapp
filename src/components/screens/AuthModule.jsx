import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Sparkles, ArrowRight, Mail, Lock, User, Globe, ShieldAlert, Phone } from 'lucide-react';
import { authService } from '../../services/authService';

export default function AuthModule() {
  const { 
    activeScreen, 
    setActiveScreen, 
    currentUser,
    setCurrentUser, 
  } = useContext(AppContext);

  // Firebase Auth Service
  // Note: authService is imported at the top of the file
  
  // Splash logic
  useEffect(() => {
    if (activeScreen === 'Splash') {
      const timer = setTimeout(() => {
        if (currentUser) {
          setActiveScreen('HomeDashboard');
        } else {
          setActiveScreen('Onboarding1');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, currentUser, setActiveScreen]);

  // Screen-specific state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Buyer'); // Buyer, Seller, Admin
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    
    // Custom Backend login
    const { data, error } = await authService.login(loginEmail, loginPassword);
    
    if (error) {
      alert(`Login failed: ${error}`);
      return;
    }

    if (data?.token) {
      localStorage.setItem('token', data.token);
    }

    // Fetch user profile from custom backend
    const { data: profile } = await authService.getUserProfile('me');

    const loggedInUser = {
      id: profile?.id || data?.user?.id || 'temp-id',
      name: profile?.full_name || loginEmail.split('@')[0],
      email: profile?.email || loginEmail,
      role: profile?.role || 'Buyer',
      avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
    };
    
    setCurrentUser(loggedInUser);
    setActiveScreen('HomeDashboard');
  };

  const handleGoogleLogin = async () => {
    alert('Google Login is not currently configured for the custom backend.');
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName || !regEmail || !regPhone || !regPassword) {
      setRegError('Please fill in all required fields.');
      return;
    }

    if (!validateEmail(regEmail)) {
      setRegError('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 8) {
      setRegError('Password must be at least 8 characters long.');
      return;
    }

    setIsRegistering(true);

    // Register user profile in database
    const { data, error } = await authService.signUp(regEmail, regPassword, regName, regPhone, regRole);

    setIsRegistering(false);

    if (error) {
      if (error.toLowerCase().includes('already registered') || error.toLowerCase().includes('already exists')) {
        setRegError('An account with this email already exists.');
      } else {
        setRegError(`Registration failed: ${error}`);
      }
      return;
    }

    setRegSuccess('Congratulations you have registered to pet sales app!');

    setTimeout(() => {
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      
      const loggedInUser = {
        id: data?.user?.id || 'temp-id',
        name: regName,
        email: regEmail,
        role: regRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
      };

      setCurrentUser(loggedInUser);
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegSuccess(''); // Clear success message on navigation
      setActiveScreen('HomeDashboard');
    }, 2000);
  };

  // Screen 1: Splash Screen
  const renderScreen = () => {
    if (activeScreen === 'Splash') {
      return (
      <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '30px' }} className="animate-fade-in">
        <div className="animate-float" style={{ background: 'white', padding: '24px', borderRadius: '30px', boxShadow: 'var(--shadow-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          <Sparkles size={48} style={{ color: 'var(--primary)' }} />
        </div>
        <h1 style={{ color: 'white', fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '8px' }}>Paws & Claws</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: '40px', fontWeight: '500' }}>Your Premium Pet Companion</p>
        <div style={{ width: '120px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: '60%',
            background: 'white',
            borderRadius: '2px',
            animation: 'pulseLoading 1.5s ease-in-out infinite'
          }}></div>
        </div>
      </div>
    );
  }

  // Screen 2: Onboarding 1
  if (activeScreen === 'Onboarding1') {
    return (
      <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="animate-fade-in">
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => setActiveScreen('Login')} style={{ background: 'none', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>Skip</button>
        </div>
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop" alt="Adopt" style={{ width: '220px', height: '220px', objectFit: 'cover', borderRadius: '50%', border: '6px solid var(--primary-light)', margin: '0 auto 30px', display: 'block' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Adopt Pets Easily</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>Browse thousands of friendly pets in your local area and find your perfect family addition today.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '20px', height: '8px', background: 'var(--primary)', borderRadius: '4px' }}></span>
            <span style={{ width: '8px', height: '8px', background: 'var(--border)', borderRadius: '50%' }}></span>
            <span style={{ width: '8px', height: '8px', background: 'var(--border)', borderRadius: '50%' }}></span>
          </div>
          <button onClick={() => setActiveScreen('Onboarding2')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', borderRadius: 'var(--radius-md)' }}>
            <span>Next</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Screen 3: Onboarding 2
  if (activeScreen === 'Onboarding2') {
    return (
      <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="animate-fade-in">
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => setActiveScreen('Login')} style={{ background: 'none', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>Skip</button>
        </div>
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <img src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=400&auto=format&fit=crop" alt="Buy Sell" style={{ width: '220px', height: '220px', objectFit: 'cover', borderRadius: '50%', border: '6px solid var(--primary-light)', margin: '0 auto 30px', display: 'block' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Buy & Sell Safely</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>Direct messaging with verified owners, escrow transaction security, and health records validation.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--border)', borderRadius: '50%' }}></span>
            <span style={{ width: '20px', height: '8px', background: 'var(--primary)', borderRadius: '4px' }}></span>
            <span style={{ width: '8px', height: '8px', background: 'var(--border)', borderRadius: '50%' }}></span>
          </div>
          <button onClick={() => setActiveScreen('Onboarding3')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', borderRadius: 'var(--radius-md)' }}>
            <span>Next</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Screen 4: Onboarding 3
  if (activeScreen === 'Onboarding3') {
    return (
      <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="animate-fade-in">
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => setActiveScreen('Login')} style={{ background: 'none', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>Skip</button>
        </div>
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400&auto=format&fit=crop" alt="AI Match" style={{ width: '220px', height: '220px', objectFit: 'cover', borderRadius: '50%', border: '6px solid var(--primary-light)', margin: '0 auto 30px', display: 'block' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>AI Match Engine</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>Answer our simple housing quiz to get instant personalized matching index, diet recommendation, and health monitoring logs.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--border)', borderRadius: '50%' }}></span>
            <span style={{ width: '8px', height: '8px', background: 'var(--border)', borderRadius: '50%' }}></span>
            <span style={{ width: '20px', height: '8px', background: 'var(--primary)', borderRadius: '4px' }}></span>
          </div>
          <button onClick={() => setActiveScreen('Login')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', borderRadius: 'var(--radius-md)' }}>
            <span>Get Started</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Screen 5: Login Screen
  if (activeScreen === 'Login') {
    return (
      <div className="auth-page-wrapper animate-fade-in">
        <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '6px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Login to access your premium pet database</p>
        </div>

        {/* Standard Email Login */}
        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required 
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="Password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required 
              />
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <button 
                type="button" 
                onClick={() => setActiveScreen('ForgotPassword')} 
                style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '500' }}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="btn-primary" style={{ height: '48px' }}>Login</button>
            
            <div style={{ position: 'relative', textAlign: 'center', margin: '12px 0' }}>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-app)', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR</span>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="btn-secondary" 
              style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Globe size={18} />
              <span>Continue with Google</span>
            </button>
          </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <button onClick={() => setActiveScreen('Register')} style={{ background: 'none', color: 'var(--primary)', fontWeight: '700' }}>Register</button>
        </div>
      </div>
      </div>
    );
  }

  // Screen 6: Registration
  if (activeScreen === 'Register') {
    return (
      <div className="auth-page-wrapper animate-fade-in">
        <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '6px' }}>Join Paws & Claws</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Set up your seller or adopter profile</p>
        </div>

        {regError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'red', fontSize: '0.85rem', marginBottom: '16px', justifyContent: 'center', background: 'rgba(255,0,0,0.1)', padding: '12px', borderRadius: '8px' }}>
            <ShieldAlert size={16} />
            <span>{regError}</span>
          </div>
        )}
        
        {regSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'green', fontSize: '0.85rem', marginBottom: '16px', justifyContent: 'center', background: 'rgba(0,255,0,0.1)', padding: '12px', borderRadius: '8px' }}>
            <Sparkles size={16} />
            <span>{regSuccess}</span>
          </div>
        )}

        <form onSubmit={handleRegistrationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              style={{ paddingLeft: '44px' }}
              required 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              style={{ paddingLeft: '44px' }}
              required 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Phone size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="tel" 
              placeholder="Mobile Number" 
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              style={{ paddingLeft: '44px' }}
              required 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              style={{ paddingLeft: '44px' }}
              required 
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '4px 0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Choose Account Role:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {['Buyer', 'Seller', 'Admin'].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRegRole(role)}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: '1.5px solid',
                    borderColor: regRole === role ? 'var(--primary)' : 'var(--border)',
                    background: regRole === role ? 'var(--primary-light)' : 'var(--bg-card)',
                    color: regRole === role ? 'var(--primary)' : 'var(--text-muted)'
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isRegistering} 
            className="btn-primary" 
            style={{ height: '48px', marginTop: '10px', opacity: isRegistering ? 0.7 : 1 }}
          >
            {isRegistering ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <button onClick={() => setActiveScreen('Login')} style={{ background: 'none', color: 'var(--primary)', fontWeight: '700' }}>Login</button>
        </div>
      </div>
      </div>
    );
  }

  // Screen 7: Forgot Password
  if (activeScreen === 'ForgotPassword') {
    return (
      <div className="auth-page-wrapper animate-fade-in">
        <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '6px' }}>Forgot Password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Provide your register email to receive a password reset link.</p>
        </div>

        {forgotSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Reset Link Sent!</p>
            <p style={{ fontSize: '0.78rem', opacity: 0.9 }}>Check your email inbox for instructions to reset your password.</p>
            <button 
              onClick={() => { setForgotSuccess(false); setActiveScreen('Login'); }} 
              className="btn-primary" 
              style={{ marginTop: '16px', background: 'var(--accent)', fontSize: '0.8rem' }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={async (e) => { 
            e.preventDefault(); 
            const { error } = await authService.resetPassword(forgotEmail);
            if (error) {
              alert(`Error: ${error}`);
            } else {
              setForgotSuccess(true);
            }
          }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ height: '48px' }}>Send Reset Link</button>
            <button 
              type="button" 
              onClick={() => setActiveScreen('Login')} 
              style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: '600' }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
      </div>
    );
  }

    return null;
  };

  return (
    <>
      {renderScreen()}
    </>
  );
}
