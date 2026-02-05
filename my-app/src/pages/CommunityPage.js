import { useEffect, useState } from 'react';
import '../App.css';
import { createPost, createReport, deletePost, listPosts, updatePost } from '../api';

const communitySpaces = [
  {
    title: 'Stress & Burnout',
    body: 'Peer check-ins for busy schedules, with short guided resets.'
  },
  {
    title: 'Anxiety Support',
    body: 'Grounding exercises, calming audio, and compassionate discussion threads.'
  },
  {
    title: 'Depression Care',
    body: 'Low-pressure connection and practical daily step planning.'
  },
  {
    title: 'Self-Growth',
    body: 'Goal-setting circles and accountability partners.'
  }
];

const emptyPost = { title: '', body: '', category: '' };

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyPost);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const [reportingId, setReportingId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const fetchPosts = async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const data = await listPosts();
      setPosts(data);
      setStatus((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      setStatus((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      if (editingId) {
        const updated = await updatePost(editingId, form);
        setPosts((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        setStatus({ loading: false, error: '', success: 'Post updated.' });
      } else {
        const created = await createPost(form);
        setPosts((prev) => [created, ...prev]);
        setStatus({ loading: false, error: '', success: 'Post published.' });
      }
      setForm(emptyPost);
      setEditingId(null);
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  const handleEdit = (post) => {
    setForm({ title: post.title, body: post.body, category: post.category || '' });
    setEditingId(post.id);
  };

  const handleDelete = async (postId) => {
    setStatus({ loading: true, error: '', success: '' });
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setStatus({ loading: false, error: '', success: 'Post removed.' });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  const handleCancel = () => {
    setForm(emptyPost);
    setEditingId(null);
  };

  const openReport = (postId) => {
    setReportingId(postId);
    setReportReason('');
    setReportDetails('');
  };

  const submitReport = async (event) => {
    event.preventDefault();
    if (!reportingId) return;

    setStatus({ loading: true, error: '', success: '' });
    try {
      await createReport({ post_id: reportingId, reason: reportReason, details: reportDetails });
      setStatus({ loading: false, error: '', success: 'Report submitted.' });
      setReportingId(null);
      setReportReason('');
      setReportDetails('');
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  return (
    <section className="page-content">
      <div className="page-hero">
        <div>
          <span className="eyebrow">Community</span>
          <h1>Support spaces built for connection and safety.</h1>
          <p>
            Join moderated forums, peer circles, and topic-based rooms designed
            for comfort and care.
          </p>
          <div className="hero-actions">
            <button className="button primary">Join a Circle</button>
            <button className="button ghost">Browse Forums</button>
          </div>
        </div>
        <div className="notice-card">
          <h3>Active Moderation</h3>
          <p>Trained guides keep the conversation safe and supportive 24/7.</p>
          <div className="tag-row">
            <span className="tag">Live support</span>
            <span className="tag">Topic experts</span>
            <span className="tag">Anonymous options</span>
          </div>
        </div>
      </div>

      <div className="card-grid">
        {communitySpaces.map((space) => (
          <article className="card" key={space.title}>
            <h3>{space.title}</h3>
            <p>{space.body}</p>
          </article>
        ))}
      </div>

      <section className="section tone">
        <div className="section-header">
          <h2>Community Posts</h2>
          <p>Share updates or ask for support in a safe space.</p>
        </div>
        <div className="split">
          <form className="panel form" onSubmit={handleSubmit}>
            <label className="input">
              Title
              <input
                type="text"
                name="title"
                placeholder="What would you like to share?"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>
            <label className="input">
              Category
              <input
                type="text"
                name="category"
                placeholder="Stress, anxiety, growth..."
                value={form.category}
                onChange={handleChange}
              />
            </label>
            <label className="input">
              Message
              <textarea
                name="body"
                placeholder="Write your post"
                rows="4"
                value={form.body}
                onChange={handleChange}
                required
              />
            </label>
            {status.error ? <div className="form-message error">{status.error}</div> : null}
            {status.success ? <div className="form-message success">{status.success}</div> : null}
            <div className="action-row">
              <button className="button primary" type="submit" disabled={status.loading}>
                {editingId ? 'Update post' : 'Publish post'}
              </button>
              {editingId ? (
                <button className="button ghost" type="button" onClick={handleCancel}>Cancel</button>
              ) : null}
            </div>
          </form>

          <div className="panel">
            <div className="section-subhead">
              <h3>Latest posts</h3>
              <span className="hint">{status.loading ? 'Refreshing...' : `${posts.length} posts`}</span>
            </div>
            <div className="stack">
              {posts.map((post) => (
                <article className="card compact" key={post.id}>
                  <div className="card-head">
                    <div>
                      <h4>{post.title}</h4>
                      <p className="muted">{post.category || 'General'}</p>
                    </div>
                  </div>
                  <p>{post.body}</p>
                  <div className="card-actions">
                    <button className="link" type="button" onClick={() => handleEdit(post)}>Edit</button>
                    <button className="link" type="button" onClick={() => handleDelete(post.id)}>Delete</button>
                    <button className="link" type="button" onClick={() => openReport(post.id)}>Report</button>
                  </div>
                  {reportingId === post.id ? (
                    <form className="report-form" onSubmit={submitReport}>
                      <label className="input">
                        Reason
                        <input
                          type="text"
                          value={reportReason}
                          onChange={(event) => setReportReason(event.target.value)}
                          placeholder="Harassment, crisis, misinformation..."
                          required
                        />
                      </label>
                      <label className="input">
                        Details
                        <textarea
                          rows="3"
                          value={reportDetails}
                          onChange={(event) => setReportDetails(event.target.value)}
                          placeholder="Add context"
                        />
                      </label>
                      <div className="action-row">
                        <button className="button primary" type="submit">Submit report</button>
                        <button className="button ghost" type="button" onClick={() => setReportingId(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : null}
                </article>
              ))}
              {!posts.length && !status.loading ? (
                <p className="muted">No posts yet. Be the first to share.</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
