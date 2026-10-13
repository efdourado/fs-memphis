import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePageTitle } from '../hooks';

export default function SignInPage() {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/saved';
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [state, setState] = useState({ busy: false, error: '' });
  const isLogin = mode === 'login';
  usePageTitle(isLogin ? 'Log in' : 'Sign up');

  if (isAuthenticated && !state.busy) return <Navigate to={from} replace />;

  const update = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setState({ busy: true, error: '' });
    try {
      if (isLogin) await login(form.email, form.password, { remember: true });
      else await register(form.name, form.email, form.password);
      navigate(from, { replace: true });
    } catch (error) {
      setState({ busy: false, error: error?.message || error?.errors?.[0]?.msg || 'That didn’t work. Check your email and password.' });
    }
  };

  return (
    <div className="p-page p-page--form">
      <header className="p-stack">
        <h1 className="p-lg">{isLogin ? 'Welcome back.' : 'Keep what you find.'}</h1>
        <p className="p-muted">{isLogin ? 'Your shelf is where you left it.' : 'Save songs and follow the people who made them.'}</p>
      </header>
      <form className="p-form" onSubmit={submit}>
        {!isLogin && <label>Name<input id="auth-name" className="p-input" autoComplete="name" required value={form.name} onChange={update('name')} /></label>}
        <label>Email<input id="auth-email" className="p-input" type="email" autoComplete="email" required value={form.email} onChange={update('email')} /></label>
        <label>Password<input id="auth-password" className="p-input" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} required minLength={isLogin ? undefined : 6} value={form.password} onChange={update('password')} /></label>
        {state.error && <p className="p-error" role="alert">{state.error}</p>}
        <button type="submit" className="p-btn p-btn--fill p-btn--block" disabled={state.busy}>
          {state.busy ? 'One moment…' : isLogin ? 'Log in' : 'Sign up'}
        </button>
      </form>
      <p className="p-small">
        {isLogin ? 'New here?' : 'Already have an account?'}{' '}
        <button type="button" className="p-text-btn" onClick={() => { setMode(isLogin ? 'signup' : 'login'); setState({ busy: false, error: '' }); }}>
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  );
}
