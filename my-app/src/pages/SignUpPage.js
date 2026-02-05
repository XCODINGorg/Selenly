import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { signup } from '../api';

export default function SignUpPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    visibility: 'Anonymous by default'
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      await signup({ email: form.email, password: form.password });
      setStatus({ loading: false, error: '', success: 'Account created! You can log in now.' });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  return (
    <section className="page-content auth">
      <div className="auth-card">
        <span className="eyebrow">Get started</span>
        <h1>Create your account.</h1>
        <p>Set up your profile and choose how you want to show up.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label className="input">
            Full name
            <input
              type="text"
              name="fullName"
              placeholder="Your name"
              value={form.fullName}
              onChange={handleChange}
            />
          </label>
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
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <label className="input">
            Preferred visibility
            <select name="visibility" value={form.visibility} onChange={handleChange}>
              <option>Anonymous by default</option>
              <option>Public profile</option>
            </select>
          </label>
          {status.error ? <div className="form-message error">{status.error}</div> : null}
          {status.success ? <div className="form-message success">{status.success}</div> : null}
          <button className="button primary full" type="submit" disabled={status.loading}>
            {status.loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="footnote">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
      <div className="auth-aside">
        <h2>Build your wellness plan.</h2>
        <p>Personalized goals, mood tracking, and gentle daily reminders.</p>
        <div className="tag-row">
          <span className="tag">Mood tracking</span>
          <span className="tag">Guided journaling</span>
          <span className="tag">Professional support</span>
        </div>
      </div>
    </section>
  );
}
