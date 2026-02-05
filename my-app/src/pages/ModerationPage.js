import { useEffect, useState } from 'react';
import '../App.css';
import { listReports, updateReportStatus } from '../api';

const statusOptions = ['open', 'reviewing', 'resolved'];

export default function ModerationPage() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const loadReports = async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const data = await listReports();
      setReports(data);
      setStatus((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      setStatus((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleStatus = async (reportId, newStatus) => {
    setStatus({ loading: true, error: '', success: '' });
    try {
      const updated = await updateReportStatus(reportId, newStatus);
      setReports((prev) => prev.map((item) => (item.id === reportId ? updated : item)));
      setStatus({ loading: false, error: '', success: 'Report updated.' });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  return (
    <section className="page-content">
      <div className="page-hero">
        <div>
          <span className="eyebrow">Moderation</span>
          <h1>Review reports and keep the community safe.</h1>
          <p>Admin-only space for handling reported content.</p>
        </div>
        <div className="notice-card">
          <h3>Report queue</h3>
          <p>{reports.length} open items</p>
        </div>
      </div>

      <section className="section tone">
        <div className="section-header">
          <h2>Reported posts</h2>
          <p>Update statuses as you review.</p>
        </div>
        {status.error ? <div className="form-message error">{status.error}</div> : null}
        {status.success ? <div className="form-message success">{status.success}</div> : null}
        <div className="stack">
          {reports.map((report) => (
            <article className="card compact" key={report.id}>
              <div className="card-head">
                <div>
                  <h4>Report #{report.id}</h4>
                  <p className="muted">Reason: {report.reason}</p>
                </div>
                <span className="badge">{report.status}</span>
              </div>
              <p>{report.details || 'No additional details.'}</p>
              <div className="card-actions">
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    className="link"
                    type="button"
                    onClick={() => handleStatus(report.id, option)}
                    disabled={status.loading}
                  >
                    Mark {option}
                  </button>
                ))}
              </div>
            </article>
          ))}
          {!reports.length && !status.loading ? <p className="muted">No reports yet.</p> : null}
        </div>
      </section>
    </section>
  );
}
