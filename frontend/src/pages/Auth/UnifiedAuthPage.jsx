import React, { useState, useEffect, useCallback } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../../components/ui/ErrorMessage";

const UnifiedAuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "register" ? "register" : "login";

  const setMode = useCallback(
    (next) => {
      if (next === "register") {
        setSearchParams({ mode: "register" }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    },
    [setSearchParams]
  );

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const { login, register, isAuthenticated } = useAuth();

  const urlError = new URLSearchParams(location.search).get("error");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const dest = mode === "register" ? "/" : from;
    navigate(dest, { replace: true });
  }, [isAuthenticated, from, mode, navigate]);

  useEffect(() => {
    setError("");
  }, [mode]);

  useEffect(() => {
    if (urlError === "auth_failed") {
      setError("Spotify sign-in did not complete. Try again or use email.");
    }
  }, [urlError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginEmail, loginPassword, { remember: rememberMe });
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(regName, regEmail, regPassword);
    } catch (err) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  const trackClass = `auth-sliding-track auth-sliding-track--${mode}`;

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content-wrapper">
          <section className="auth-social-section" aria-label="Welcome">
            <div className="auth-sliding-viewport auth-sliding-viewport--promo">
              <div className={trackClass}>
                <div className="auth-slide" inert={mode !== "login" ? true : undefined}>
                  <h2>Hi again! Welcome back to your space</h2>
                  <p className="auth-subtitle">
                    Music, reimagined — Memphis is a web application designed to
                    provide a seamless, modern music listening experience. Build
                    playlists and explore sound in a fresh way.
                  </p>
                </div>
                <div className="auth-slide" inert={mode !== "register" ? true : undefined}>
                  <h2>Sign up for a new music experience</h2>
                  <p className="auth-subtitle">
                    Music, reimagined — Memphis is a web application designed to
                    provide a seamless, modern music listening experience. Build
                    playlists and align new perspectives through sound.
                  </p>
                  <p className="auth-legal">
                    By signing up, you agree to our <a href="#">Terms</a> and{" "}
                    <a href="#">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="social-login-container">
              <a href="/api/auth/spotify" className="cta-button primary-cta create-btn">
                <FontAwesomeIcon icon={faSpotify} className="auth-spotify-icon" />
                Continue with Spotify
              </a>
            </div>
          </section>

          <div className="auth-separator" aria-hidden="true">
            OR
          </div>

          <div className="auth-forms-column">
            <div className="auth-forms-column__errors">
              <ErrorMessage message={error} />
            </div>
            <div className="auth-sliding-viewport auth-sliding-viewport--forms">
              <div className={trackClass}>
                <div className="auth-slide" inert={mode !== "login" ? true : undefined}>
                  <form onSubmit={handleLogin} className="auth-form" noValidate>
                    <h2 className="auth-form__title">
                      Sign in
                      <span className="auth-form__title-line">to your account</span>
                    </h2>
                    <div className="auth-form__group">
                      <input
                        type="email"
                        id="auth-login-email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        autoComplete="email"
                        placeholder=" "
                        spellCheck="false"
                      />
                      <label htmlFor="auth-login-email">Email</label>
                    </div>
                    <div className="auth-form__group">
                      <input
                        type="password"
                        id="auth-login-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        placeholder=" "
                      />
                      <label htmlFor="auth-login-password">Password</label>
                    </div>
                    <div className="auth-form__options">
                      <div className="auth-form__checkbox-group">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMe">Remember me</label>
                      </div>
                      <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                    <button
                      type="submit"
                      disabled={loading && mode === "login"}
                      className="cta-button secondary-cta auth-button"
                    >
                      {loading && mode === "login" ? "Signing in…" : "Sign in"}
                    </button>
                    <p className="auth-switch">
                      Not a member yet?{" "}
                      <button
                        type="button"
                        className="auth-switch__btn"
                        onClick={() => setMode("register")}
                      >
                        Sign up
                      </button>
                    </p>
                  </form>
                </div>
                <div className="auth-slide" inert={mode !== "register" ? true : undefined}>
                  <form onSubmit={handleRegister} className="auth-form" noValidate>
                    <h2 className="auth-form__title">
                      Create
                      <span className="auth-form__title-line">your account</span>
                    </h2>
                    <div className="auth-form__group">
                      <input
                        type="text"
                        id="auth-reg-name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        autoComplete="name"
                        placeholder=" "
                        spellCheck="false"
                      />
                      <label htmlFor="auth-reg-name">Name</label>
                    </div>
                    <div className="auth-form__group">
                      <input
                        type="email"
                        id="auth-reg-email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        autoComplete="email"
                        placeholder=" "
                        spellCheck="false"
                      />
                      <label htmlFor="auth-reg-email">Email</label>
                    </div>
                    <div className="auth-form__group">
                      <input
                        type="password"
                        id="auth-reg-password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        placeholder=" "
                      />
                      <label htmlFor="auth-reg-password">Password</label>
                    </div>
                    <div className="auth-form__group">
                      <input
                        type="password"
                        id="auth-reg-confirm"
                        value={regConfirm}
                        onChange={(e) => setRegConfirm(e.target.value)}
                        required
                        autoComplete="new-password"
                        placeholder=" "
                      />
                      <label htmlFor="auth-reg-confirm">Confirm password</label>
                    </div>
                    <button
                      type="submit"
                      disabled={loading && mode === "register"}
                      className="cta-button secondary-cta auth-button"
                    >
                      {loading && mode === "register" ? "Creating account…" : "Sign up"}
                    </button>
                    <p className="auth-switch">
                      Already a member?{" "}
                      <button
                        type="button"
                        className="auth-switch__btn"
                        onClick={() => setMode("login")}
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function AuthLoginRedirect() {
  const { search, state } = useLocation();
  return <Navigate to={`/auth${search}`} replace state={state} />;
}

export function AuthRegisterRedirect() {
  return <Navigate to="/auth?mode=register" replace />;
}

export default UnifiedAuthPage;
