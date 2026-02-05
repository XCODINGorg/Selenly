import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { login, storeTokens } from '../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '' });

    try {
      const data = await login(form);
      storeTokens(data.access_token, data.refresh_token);
      navigate('/dashboard');
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  return (
    <section className="page-content auth">
      <div className="auth-card">
        <span className="eyebrow">Welcome back</span>
        <h1>Log in to your space.</h1>
        <p>Access your community, tools, and support.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label className="input">
            Email address
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label className="input">
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <div className="form-row">
            <label className="checkbox">
              <input type="checkbox" />
              Remember me
            </label>
            <button className="link" type="button">Forgot password?</button>
          </div>
          {status.error ? <div className="form-message error">{status.error}</div> : null}
          <button className="button primary full" type="submit" disabled={status.loading}>
            {status.loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="footnote">New here? <Link to="/signup">Create an account</Link></p>
      </div>
      <div className="auth-aside">
        <h2>Safe, supportive, and private.</h2>
        <p>Anonymous posting options and consent-driven privacy controls.</p>
        <div className="tag-row">
          <span className="tag">Encrypted chats</span>
          <span className="tag">Moderated spaces</span>
          <span className="tag">Community guidelines</span>
        </div>
      </div>
    </section>
  );
}
