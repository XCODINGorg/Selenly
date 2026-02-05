import '../App.css';

const resources = [
  {
    title: 'Clinician Articles',
    body: 'Evidence-informed reading on anxiety, sleep, and emotional regulation.'
  },
  {
    title: 'Meditation Studio',
    body: 'Guided sessions for focus, rest, and confidence.'
  },
  {
    title: 'Breathing Lab',
    body: 'Interactive breathing timers with soundscapes.'
  },
  {
    title: 'Video Library',
    body: 'Short lessons from therapists and community leaders.'
  }
];

export default function ResourcesPage() {
  return (
    <section className="page-content">
      <div className="page-hero">
        <div>
          <span className="eyebrow">Resources</span>
          <h1>Learning that meets you in the moment.</h1>
          <p>Professional articles, audio, and video content built for clarity.</p>
        </div>
        <div className="notice-card">
          <h3>Featured Series</h3>
          <p>Breathing techniques for steady focus and calmer days.</p>
          <button className="button ghost">Play Session</button>
        </div>
      </div>
      <div className="card-grid">
        {resources.map((item) => (
          <article className="card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
