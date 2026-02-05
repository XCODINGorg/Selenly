import '../App.css';

const directoryList = [
  {
    title: 'Trauma-Informed Therapists',
    body: 'Search by specialty, location, and availability.'
  },
  {
    title: 'Counselor Match',
    body: 'Quick intake form to match with aligned providers.'
  },
  {
    title: 'Insurance Filters',
    body: 'Find care that fits your coverage and budget.'
  }
];

export default function DirectoryPage() {
  return (
    <section className="page-content">
      <div className="page-hero">
        <div>
          <span className="eyebrow">Therapist Directory</span>
          <h1>Find professional care that fits your needs.</h1>
          <p>Search by specialty, availability, language, and insurance.</p>
          <div className="hero-actions">
            <button className="button primary">Search Providers</button>
            <button className="button ghost">Check Availability</button>
          </div>
        </div>
        <div className="notice-card">
          <h3>Upcoming Availability</h3>
          <p>Book a 15-minute consultation with a matched counselor.</p>
          <button className="button ghost">View Slots</button>
        </div>
      </div>
      <div className="card-grid">
        {directoryList.map((item) => (
          <article className="card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
