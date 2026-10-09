import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePageTitle } from '../hooks';

export default function SignInPage() {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || location.state?.from || '/you';
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [state, setState] = useState({ busy: false, error: '' });
  usePageTitle(mode === 'signin' ? 'Sign in' : 'Create account');

  if (isAuthenticated && !state.busy) return <Navigate to={from} replace />;

  const update = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setState({ busy: true, error: '' });
    try {
      if (mode === 'signin') await login(form.email, form.password, { remember: true });
      else await register(form.name, form.email, form.password);
      navigate(from, { replace: true });
    } catch (error) {
      setState({ busy: false, error: error?.message || error?.errors?.[0]?.msg || 'Could not sign in. Check your details.' });
    }
  };

  const isSignIn = mode === 'signin';

  return (
    <div className="m-page m-page--form">
      <h1 className="m-title">{isSignIn ? 'Welcome back' : 'Create your account'}</h1>
      <p className="m-muted">
        {isSignIn ? 'Pick up where you left off.' : 'Save songs, follow collaborators and keep your questions. Memphis asks for nothing else.'}
      </p>
      <form className="m-form" onSubmit={submit}>
        {!isSignIn && (
          <label>
            Name
            <input type="text" autoComplete="name" required value={form.name} onChange={update('name')} />
          </label>
        )}
        <label>
          Email
          <input type="email" autoComplete="email" required value={form.email} onChange={update('email')} />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            required
            minLength={isSignIn ? undefined : 6}
            value={form.password}
            onChange={update('password')}
          />
        </label>
        {state.error && <p className="m-error" role="alert">{state.error}</p>}
        <button type="submit" className="m-button m-button--primary m-button--block" disabled={state.busy}>
          {state.busy ? 'One moment…' : isSignIn ? 'Sign in' : 'Create account'}
        </button>
      </form>
      <p className="m-switch">
        {isSignIn ? 'New to Memphis?' : 'Already have an account?'}{' '}
        <button type="button" className="m-text-button" onClick={() => { setMode(isSignIn ? 'register' : 'signin'); setState({ busy: false, error: '' }); }}>
          {isSignIn ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}
