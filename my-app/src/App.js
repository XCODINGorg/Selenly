import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Outlet } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import ToolsPage from './pages/ToolsPage';
import ResourcesPage from './pages/ResourcesPage';
import DirectoryPage from './pages/DirectoryPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ModerationPage from './pages/ModerationPage';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Community', to: '/community' },
  { label: 'Tools', to: '/tools' },
  { label: 'Resources', to: '/resources' },
  { label: 'Directory', to: '/directory' },
  { label: 'Moderation', to: '/moderation' }
];

const authLinks = [
  { label: 'Log in', to: '/login' },
  { label: 'Sign up', to: '/signup' }
];

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="page">
      <div className="ambient-glow" aria-hidden="true" />

      <nav className="topbar">
        <NavLink className="brand" to="/" onClick={closeMenu}>Selenly</NavLink>
        <div className="navlinks">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={link.to === '/'}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="nav-actions">
          {authLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink className="button primary" to="/signup" onClick={closeMenu}>Join Free</NavLink>
        </div>
        <button
          className="mobile-toggle"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={link.to === '/'}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="mobile-actions">
          {authLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink className="button primary" to="/signup" onClick={closeMenu}>Join Free</NavLink>
        </div>
      </div>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div>
          <strong>Selenly</strong>
          <p>Gentle support. Real community. Professional care.</p>
        </div>
        <div className="footer-actions">
          <NavLink className="button ghost" to="/resources">Safety policy</NavLink>
          <NavLink className="button primary" to="/signup">Create your account</NavLink>
        </div>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <section className="page-content">
      <div className="page-hero">
        <div>
          <span className="eyebrow">Page not found</span>
          <h1>We could not find that page.</h1>
          <p>Try heading back home or exploring the community.</p>
          <div className="hero-actions">
            <NavLink className="button primary" to="/">Go Home</NavLink>
            <NavLink className="button ghost" to="/community">Community</NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="directory" element={<DirectoryPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="moderation" element={<ModerationPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
