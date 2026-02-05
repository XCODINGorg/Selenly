import { Link } from 'react-router-dom';
import '../App.css';

const coreFeatures = [
  {
    title: 'User Profiles',
    body: 'Anonymous or public profiles with mood status, goals, and privacy controls for posts and activity.'
  },
  {
    title: 'Community Support',
    body: 'Topic-based forums, peer support circles, and moderated conversations that keep the space safe.'
  },
  {
    title: 'Mental Health Tools',
    body: 'Daily mood tracking, journaling, gratitude notes, and self-assessment quizzes.'
  },
  {
    title: 'Resources & Learning',
    body: 'Professional articles, guided meditation, breathing exercises, and wellness media.'
  },
  {
    title: 'Professional Support',
    body: 'Therapist directory, appointment booking, and private chat or video sessions.'
  }
];

const safetyFeatures = [
  {
    title: 'Crisis Support',
    body: 'Emergency helpline integration, distress detection, and a quick Get Help Now flow.'
  },
  {
    title: 'Privacy & Security',
    body: 'End-to-end encrypted chats, anonymous posting, and clear data consent controls.'
  }
];

const engagementFeatures = [
  {
    title: 'Gamification',
    body: 'Wellness streaks, badges, positive activity rewards, and daily challenges.'
  },
  {
    title: 'Smart Notifications',
    body: 'Gentle reminders, mood check-ins, and motivational prompts tailored to goals.'
  }
];

const adminFeatures = [
  {
    title: 'Admin Dashboard',
    body: 'User moderation, flagging and reporting, and community health analytics.'
  }
];

const futureFeatures = [
  'AI emotional support companion',
  'Personalized wellness recommendations',
  'Multilingual support',
  'Dark mode and accessibility tools'
];

export default function HomePage() {
  return (
    <>
      <header className="hero" id="home">
        <div className="hero-content">
          <span className="eyebrow">Mental health community platform</span>
          <h1>
            Build steady days with a community that listens, tools that guide,
            and care that meets you where you are.
          </h1>
          <p>
            Selenly brings together anonymous support, evidence-informed resources,
            and professional care pathways so every member can feel safe, seen,
            and empowered.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/signup">Start Your Journey</Link>
            <Link className="button ghost" to="/community">Explore the Community</Link>
          </div>
          <div className="hero-stats">
            <div>
              <h3>24/7</h3>
              <p>Moderated support spaces</p>
            </div>
            <div>
              <h3>6+</h3>
              <p>Guided wellness pathways</p>
            </div>
            <div>
              <h3>1:1</h3>
              <p>Professional care access</p>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <div className="pulse" />
          <div className="hero-card-header">
            <span>Today&apos;s Check-in</span>
            <strong>Calm, hopeful</strong>
          </div>
          <div className="hero-card-body">
            <p>Reminder: You are not alone. Let&apos;s set a gentle goal.</p>
            <div className="chip-row">
              <span className="chip">5-min breathing</span>
              <span className="chip">Gratitude note</span>
              <span className="chip">Reach out</span>
            </div>
          </div>
          <button className="button tiny">Log Mood</button>
        </div>
      </header>

      <section className="section" id="core">
        <div className="section-header">
          <h2>Core Features</h2>
          <p>Designed for safety, belonging, and steady progress.</p>
        </div>
        <div className="card-grid">
          {coreFeatures.map((feature) => (
            <article className="card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section tone" id="daily">
        <div className="section-header">
          <h2>Daily Care Toolkit</h2>
          <p>Small rituals that help you notice patterns and celebrate progress.</p>
        </div>
        <div className="split">
          <div className="panel">
            <h3>Mood Tracking</h3>
            <p>Track emotions, energy, and triggers with a timeline you control.</p>
            <ul className="list">
              <li>Color-coded moods and gentle prompts</li>
              <li>Trends and reflective insights</li>
              <li>Private or shared views</li>
            </ul>
          </div>
          <div className="panel">
            <h3>Journaling & Gratitude</h3>
            <p>Guided entries, voice notes, and gratitude reminders to shift focus.</p>
            <ul className="list">
              <li>Prompt library curated by clinicians</li>
              <li>Tagged entries for quick recall</li>
              <li>Gentle nudges at preferred times</li>
            </ul>
          </div>
          <div className="panel">
            <h3>Self-Assessments</h3>
            <p>Quick check-ins for stress, anxiety, and burnout levels.</p>
            <ul className="list">
              <li>Short validated quizzes</li>
              <li>Actionable next-step guidance</li>
              <li>Share results with professionals</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="support">
        <div className="section-header">
          <h2>Resources & Professional Support</h2>
          <p>Human-first guidance with options for every comfort level.</p>
        </div>
        <div className="support-grid">
          <div className="support-card">
            <h3>Learning Hub</h3>
            <p>Articles, videos, and audio sessions built by mental health professionals.</p>
            <Link className="button ghost" to="/resources">Browse Resources</Link>
          </div>
          <div className="support-card highlight">
            <h3>Therapist Directory</h3>
            <p>Search by specialty, availability, and insurance compatibility.</p>
            <Link className="button primary" to="/directory">Book a Session</Link>
          </div>
          <div className="support-card">
            <h3>Peer Support Circles</h3>
            <p>Small-group sessions facilitated by trained moderators.</p>
            <Link className="button ghost" to="/community">Find a Circle</Link>
          </div>
        </div>
      </section>

      <section className="section tone" id="safety">
        <div className="section-header">
          <h2>Safety & Well-Being</h2>
          <p>We keep the space secure, consent-based, and supportive.</p>
        </div>
        <div className="card-grid">
          {safetyFeatures.map((feature) => (
            <article className="card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
        <div className="cta-row">
          <div>
            <h3>Need help right now?</h3>
            <p>Access crisis resources and connect with trained responders.</p>
          </div>
          <button className="button alert">Get Help Now</button>
        </div>
      </section>

      <section className="section" id="engagement">
        <div className="section-header">
          <h2>Engagement & Motivation</h2>
          <p>Positive reinforcement that makes growth feel achievable.</p>
        </div>
        <div className="card-grid">
          {engagementFeatures.map((feature) => (
            <article className="card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section tone" id="admin">
        <div className="section-header">
          <h2>Admin & Moderation</h2>
          <p>Healthy communities need proactive, transparent governance.</p>
        </div>
        <div className="card-grid">
          {adminFeatures.map((feature) => (
            <article className="card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="future">
        <div className="section-header">
          <h2>Future Vision</h2>
          <p>We are building for the next generation of care.</p>
        </div>
        <div className="pill-row">
          {futureFeatures.map((feature) => (
            <span className="pill" key={feature}>{feature}</span>
          ))}
        </div>
      </section>
    </>
  );
}
