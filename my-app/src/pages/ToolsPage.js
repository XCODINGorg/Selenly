import '../App.css';

export default function ToolsPage() {
  return (
    <section className="page-content">
      <div className="page-hero">
        <div>
          <span className="eyebrow">Tools</span>
          <h1>Daily rituals that make wellness feel doable.</h1>
          <p>Track, reflect, and celebrate with guided tools built for clarity.</p>
          <div className="hero-actions">
            <button className="button primary">Start a Check-in</button>
            <button className="button ghost">View Journal</button>
          </div>
        </div>
        <div className="notice-card">
          <h3>Today&apos;s Mood</h3>
          <p>Energy: steady. Feeling: hopeful. Goal: take a short walk.</p>
          <div className="progress">
            <span>Weekly streak</span>
            <strong>5 days</strong>
          </div>
        </div>
      </div>
      <div className="split">
        <div className="panel">
          <h3>Mood Tracking</h3>
          <p>Visualize emotions, triggers, and recovery moments.</p>
        </div>
        <div className="panel">
          <h3>Guided Journaling</h3>
          <p>Prompts that invite reflection without pressure.</p>
        </div>
        <div className="panel">
          <h3>Self-Assessments</h3>
          <p>Short quizzes to check in on anxiety, stress, or burnout.</p>
        </div>
      </div>
    </section>
  );
}
