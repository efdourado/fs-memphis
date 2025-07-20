import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

import AuthForm from './components/AuthForm';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again');
    } finally {
      setLoading(false);
  } };

  const title = `<h2>Create<br />new account</h2>`;

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content-wrapper">
          <div className="auth-social-section">
            <h2>Sign up to a new music experience</h2>
            <p className="auth-subtitle">
              Music, reimagined — Memphis is a web application designed to provide a seamless, modern music listening experience. Users can build and manage personal playlists,
              and align new perspectives through sound.
            </p>
            <div className="social-login-container">
              <a href="/api/auth/spotify" className="cta-button primary-cta create-btn">
                <FontAwesomeIcon icon={faSpotify} style={{marginRight:"16px"}} />
                Continue with Spotify
              </a>
            </div>
            <div className="auth-subtitle">
              By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
            </div>
          </div>

          <div className="auth-separator">OR</div>

          <AuthForm title={title} error={error} onSubmit={handleSubmit}>
            <div className="auth-form__group">
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder=" " spellCheck="false" />
              <label htmlFor="name">Name</label>
            </div>
            
            <div className="auth-form__group">
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder=" " spellCheck="false" />
              <label htmlFor="email">Email</label>
            </div>
            
            <div className="auth-form__group">
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" placeholder=" " />
              <label htmlFor="password">Password</label>
            </div>
            
            <div className="auth-form__group">
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" placeholder=" " />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            
            <button type="submit" disabled={loading} className="cta-button secondary-cta auth-button">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <p className="auth-subtitle">
              Already a member? <Link to="/login">Sign In</Link>
            </p>
          </AuthForm>
        </div>
      </div>
    </div>
); };

export default RegisterPage;