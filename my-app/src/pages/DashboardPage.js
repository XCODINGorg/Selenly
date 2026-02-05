import { useEffect, useState } from 'react';
import '../App.css';
import {
  createJournal,
  createMood,
  deleteJournal,
  deleteMood,
  listJournals,
  listMoods,
  updateJournal,
  updateMood
} from '../api';

const emptyMood = { mood: '', energy: '', note: '' };
const emptyJournal = { title: '', body: '', gratitude: '' };

export default function DashboardPage() {
  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);
  const [moodForm, setMoodForm] = useState(emptyMood);
  const [journalForm, setJournalForm] = useState(emptyJournal);
  const [editingMoodId, setEditingMoodId] = useState(null);
  const [editingJournalId, setEditingJournalId] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const loadAll = async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const [moodData, journalData] = await Promise.all([listMoods(), listJournals()]);
      setMoods(moodData);
      setJournals(journalData);
      setStatus((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      setStatus((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleMoodChange = (event) => {
    const { name, value } = event.target;
    setMoodForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleJournalChange = (event) => {
    const { name, value } = event.target;
    setJournalForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitMood = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      if (editingMoodId) {
        const updated = await updateMood(editingMoodId, moodForm);
        setMoods((prev) => prev.map((item) => (item.id === editingMoodId ? updated : item)));
        setStatus({ loading: false, error: '', success: 'Mood updated.' });
      } else {
        const created = await createMood(moodForm);
        setMoods((prev) => [created, ...prev]);
        setStatus({ loading: false, error: '', success: 'Mood logged.' });
      }
      setMoodForm(emptyMood);
      setEditingMoodId(null);
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  const submitJournal = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      if (editingJournalId) {
        const updated = await updateJournal(editingJournalId, journalForm);
        setJournals((prev) => prev.map((item) => (item.id === editingJournalId ? updated : item)));
        setStatus({ loading: false, error: '', success: 'Journal updated.' });
      } else {
        const created = await createJournal(journalForm);
        setJournals((prev) => [created, ...prev]);
        setStatus({ loading: false, error: '', success: 'Journal saved.' });
      }
      setJournalForm(emptyJournal);
      setEditingJournalId(null);
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  const handleMoodEdit = (entry) => {
    setMoodForm({ mood: entry.mood, energy: entry.energy || '', note: entry.note || '' });
    setEditingMoodId(entry.id);
  };

  const handleJournalEdit = (entry) => {
    setJournalForm({
      title: entry.title || '',
      body: entry.body,
      gratitude: entry.gratitude || ''
    });
    setEditingJournalId(entry.id);
  };

  const handleMoodDelete = async (id) => {
    setStatus({ loading: true, error: '', success: '' });
    try {
      await deleteMood(id);
      setMoods((prev) => prev.filter((item) => item.id !== id));
      setStatus({ loading: false, error: '', success: 'Mood removed.' });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  const handleJournalDelete = async (id) => {
    setStatus({ loading: true, error: '', success: '' });
    try {
      await deleteJournal(id);
      setJournals((prev) => prev.filter((item) => item.id !== id));
      setStatus({ loading: false, error: '', success: 'Journal removed.' });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  const resetMood = () => {
    setMoodForm(emptyMood);
    setEditingMoodId(null);
  };

  const resetJournal = () => {
    setJournalForm(emptyJournal);
    setEditingJournalId(null);
  };

  return (
    <section className="page-content">
      <div className="page-hero">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Your wellness overview at a glance.</h1>
          <p>Track trends, celebrate progress, and keep your goals in focus.</p>
        </div>
        <div className="notice-card">
          <h3>Wellness Score</h3>
          <p>Steady progress this week. You are showing up for yourself.</p>
          <div className="progress">
            <span>Score</span>
            <strong>78</strong>
          </div>
        </div>
      </div>

      <section className="section tone">
        <div className="section-header">
          <h2>Mood Tracking</h2>
          <p>Log your mood, energy, and notes to spot patterns.</p>
        </div>
        <div className="split">
          <form className="panel form" onSubmit={submitMood}>
            <label className="input">
              Mood
              <input
                type="text"
                name="mood"
                placeholder="Calm, anxious, hopeful..."
                value={moodForm.mood}
                onChange={handleMoodChange}
                required
              />
            </label>
            <label className="input">
              Energy
              <input
                type="text"
                name="energy"
                placeholder="Low, steady, high"
                value={moodForm.energy}
                onChange={handleMoodChange}
              />
            </label>
            <label className="input">
              Note
              <textarea
                name="note"
                placeholder="What influenced your mood today?"
                rows="3"
                value={moodForm.note}
                onChange={handleMoodChange}
              />
            </label>
            {status.error ? <div className="form-message error">{status.error}</div> : null}
            {status.success ? <div className="form-message success">{status.success}</div> : null}
            <div className="action-row">
              <button className="button primary" type="submit" disabled={status.loading}>
                {editingMoodId ? 'Update mood' : 'Log mood'}
              </button>
              {editingMoodId ? (
                <button className="button ghost" type="button" onClick={resetMood}>Cancel</button>
              ) : null}
            </div>
          </form>
          <div className="panel">
            <div className="section-subhead">
              <h3>Recent moods</h3>
              <span className="hint">{status.loading ? 'Refreshing...' : `${moods.length} entries`}</span>
            </div>
            <div className="stack">
              {moods.map((entry) => (
                <article className="card compact" key={entry.id}>
                  <div className="card-head">
                    <div>
                      <h4>{entry.mood}</h4>
                      <p className="muted">Energy: {entry.energy || '—'}</p>
                    </div>
                  </div>
                  {entry.note ? <p>{entry.note}</p> : <p className="muted">No note added.</p>}
                  <div className="card-actions">
                    <button className="link" type="button" onClick={() => handleMoodEdit(entry)}>Edit</button>
                    <button className="link" type="button" onClick={() => handleMoodDelete(entry.id)}>Delete</button>
                  </div>
                </article>
              ))}
              {!moods.length && !status.loading ? (
                <p className="muted">No mood entries yet.</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Journaling</h2>
          <p>Capture reflections, gratitude, and your next steps.</p>
        </div>
        <div className="split">
          <form className="panel form" onSubmit={submitJournal}>
            <label className="input">
              Title
              <input
                type="text"
                name="title"
                placeholder="Optional title"
                value={journalForm.title}
                onChange={handleJournalChange}
              />
            </label>
            <label className="input">
              Journal entry
              <textarea
                name="body"
                placeholder="Write your thoughts"
                rows="4"
                value={journalForm.body}
                onChange={handleJournalChange}
                required
              />
            </label>
            <label className="input">
              Gratitude note
              <textarea
                name="gratitude"
                placeholder="Something you appreciate today"
                rows="2"
                value={journalForm.gratitude}
                onChange={handleJournalChange}
              />
            </label>
            {status.error ? <div className="form-message error">{status.error}</div> : null}
            {status.success ? <div className="form-message success">{status.success}</div> : null}
            <div className="action-row">
              <button className="button primary" type="submit" disabled={status.loading}>
                {editingJournalId ? 'Update journal' : 'Save journal'}
              </button>
              {editingJournalId ? (
                <button className="button ghost" type="button" onClick={resetJournal}>Cancel</button>
              ) : null}
            </div>
          </form>
          <div className="panel">
            <div className="section-subhead">
              <h3>Recent entries</h3>
              <span className="hint">{status.loading ? 'Refreshing...' : `${journals.length} entries`}</span>
            </div>
            <div className="stack">
              {journals.map((entry) => (
                <article className="card compact" key={entry.id}>
                  <div className="card-head">
                    <div>
                      <h4>{entry.title || 'Untitled entry'}</h4>
                      <p className="muted">Gratitude: {entry.gratitude || '—'}</p>
                    </div>
                  </div>
                  <p>{entry.body}</p>
                  <div className="card-actions">
                    <button className="link" type="button" onClick={() => handleJournalEdit(entry)}>Edit</button>
                    <button className="link" type="button" onClick={() => handleJournalDelete(entry.id)}>Delete</button>
                  </div>
                </article>
              ))}
              {!journals.length && !status.loading ? (
                <p className="muted">No journal entries yet.</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
