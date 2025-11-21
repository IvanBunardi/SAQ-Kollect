'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Submission {
  url: string;
  caption: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

interface Deliverable {
  type: string;
  title: string;
  required: number;
  submitted: number;
  submissions: Submission[];
}

interface Work {
  _id: string;
  title: string;
  description: string;
  brand: {
    _id: string;
    username: string;
    fullname: string;
    profilePhoto?: string;
    companyName?: string;
  };
  campaign: {
    _id: string;
    title: string;
    description: string;
  };
  status: string;
  progress: number;
  budget: number;
  earnings: number;
  deadline: string;
  deliverables: Deliverable[];
  engagementTarget: number;
  actualEngagement: number;
  kol: {
    _id: string;
    username: string;
    fullname: string;
    profilePhoto?: string;
  };
}

interface UserRole {
  isKol: boolean;
  isBrand: boolean;
}

export default function WorkDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workId = params.workId as string;

  const [work, setWork] = useState<Work | null>(null);
  const [userRole, setUserRole] = useState<UserRole>({ isKol: false, isBrand: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Submit modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedDeliverableIdx, setSelectedDeliverableIdx] = useState<number | null>(null);
  const [submitForm, setSubmitForm] = useState({ url: '', caption: '' });
  const [submitting, setSubmitting] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ action: 'approve', feedback: '', delivIdx: 0, submIdx: 0 });
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchWorkDetail();
  }, [workId]);

  const fetchWorkDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/work/${workId}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        setWork(data.work);
        
        // Determine user role
        const userId = localStorage.getItem('userId'); // Assume you store this after login
        if (data.work.kol._id === userId) {
          setUserRole({ isKol: true, isBrand: false });
        } else if (data.work.brand._id === userId) {
          setUserRole({ isKol: false, isBrand: true });
        }
      } else {
        setError(data.message || 'Failed to load work');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading work');
      console.error('Error fetching work:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClick = (idx: number) => {
    setSelectedDeliverableIdx(idx);
    setSubmitForm({ url: '', caption: '' });
    setShowSubmitModal(true);
  };

  const handleSubmitDeliverable = async () => {
    if (selectedDeliverableIdx === null || !submitForm.url.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/work/${workId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          deliverableIndex: selectedDeliverableIdx,
          url: submitForm.url,
          caption: submitForm.caption
        })
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Deliverable submitted successfully!');
        setShowSubmitModal(false);
        fetchWorkDetail(); // Refresh
      } else {
        alert('❌ ' + (data.message || 'Failed to submit'));
      }
    } catch (err: any) {
      alert('❌ Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmission = async () => {
    setReviewing(true);
    try {
      const res = await fetch(`/api/work/${workId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          deliverableIndex: reviewData.delivIdx,
          submissionIndex: reviewData.submIdx,
          action: reviewData.action,
          feedback: reviewData.feedback
        })
      });

      const data = await res.json();

      if (data.success) {
        alert(`✅ Submission ${reviewData.action}ed!`);
        setShowReviewModal(false);
        fetchWorkDetail();
      } else {
        alert('❌ ' + (data.message || 'Failed to review'));
      }
    } catch (err: any) {
      alert('❌ Error: ' + err.message);
    } finally {
      setReviewing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDeliverableLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'ig_story': 'IG Stories',
      'ig_reel': 'IG Reels',
      'ig_post': 'IG Posts',
      'tiktok': 'TikTok',
      'youtube': 'YouTube',
      'twitter': 'Twitter'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': '#ffcc80',
      'approved': '#90ee90',
      'rejected': '#ff6b6b'
    };
    return colors[status] || '#e0e0e0';
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>Loading...</div>;
  }

  if (error || !work) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#d32f2f' }}>Error: {error}</div>;
  }

  return (
    <>
      <style jsx global>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        body { margin: 0; padding: 0; overflow-x: hidden; }
      `}</style>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => router.back()}>
            ← Back
          </button>
          <h1 style={styles.title}>{work.title}</h1>
        </div>

        <div style={styles.mainContent}>
          {/* Work Info */}
          <div style={styles.infoCard}>
            <div style={styles.infoPair}>
              <span style={styles.label}>Brand:</span>
              <span style={styles.value}>{work.brand.companyName || work.brand.fullname}</span>
            </div>
            <div style={styles.infoPair}>
              <span style={styles.label}>Status:</span>
              <span style={{...styles.value, color: '#4371f0', fontWeight: '600'}}>
                {work.status.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <div style={styles.infoPair}>
              <span style={styles.label}>Budget:</span>
              <span style={styles.value}>${work.budget}</span>
            </div>
            <div style={styles.infoPair}>
              <span style={styles.label}>Deadline:</span>
              <span style={styles.value}>{formatDate(work.deadline)}</span>
            </div>
            <div style={styles.infoPair}>
              <span style={styles.label}>Progress:</span>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${work.progress}%`}}></div>
              </div>
              <span style={styles.value}>{work.progress}%</span>
            </div>
          </div>

          {/* Deliverables Section */}
          <div style={styles.deliverables}>
            <h2 style={styles.sectionTitle}>📦 Deliverables ({work.progress}% Complete)</h2>
            
            {work.deliverables.map((deliverable, idx) => (
              <div key={idx} style={styles.deliverableCard}>
                <div style={styles.delHeader}>
                  <div>
                    <h3 style={styles.delType}>{getDeliverableLabel(deliverable.type)}</h3>
                    <p style={styles.delRequirement}>
                      {deliverable.submitted}/{deliverable.required} submitted
                    </p>
                  </div>
                  <div style={{...styles.delBadge, background: 
                    deliverable.submitted >= deliverable.required ? '#90ee90' : '#ffcc80'
                  }}>
                    {deliverable.submitted >= deliverable.required ? '✓ Complete' : 'In Progress'}
                  </div>
                </div>

                {/* Submissions List */}
                {deliverable.submissions && deliverable.submissions.length > 0 && (
                  <div style={styles.submissionsList}>
                    <h4 style={styles.submissionsTitle}>Submissions:</h4>
                    {deliverable.submissions.map((submission, subIdx) => (
                      <div key={subIdx} style={{...styles.submissionItem, borderLeft: `4px solid ${getStatusColor(submission.status)}`}}>
                        <div style={styles.submissionHeader}>
                          <span style={{...styles.submissionStatus, background: getStatusColor(submission.status)}}>
                            {submission.status.toUpperCase()}
                          </span>
                          <span style={styles.submissionDate}>{formatDate(submission.submittedAt)}</span>
                        </div>
                        <p style={styles.submissionUrl}>
                          <a href={submission.url} target="_blank" rel="noopener noreferrer" style={{color: '#4371f0', textDecoration: 'none'}}>
                            {submission.url.substring(0, 60)}...
                          </a>
                        </p>
                        {submission.caption && (
                          <p style={styles.submissionCaption}>Caption: {submission.caption}</p>
                        )}
                        {submission.feedback && (
                          <p style={styles.submissionFeedback}>Feedback: {submission.feedback}</p>
                        )}

                        {/* Review buttons (only for Brand) */}
                        {userRole.isBrand && submission.status === 'pending' && (
                          <div style={styles.submissionActions}>
                            <button 
                              style={{...styles.actionBtn, background: '#4CAF50'}}
                              onClick={() => {
                                setReviewData({ ...reviewData, action: 'approve', delivIdx: idx, submIdx: subIdx });
                                setShowReviewModal(true);
                              }}
                            >
                              ✓ Approve
                            </button>
                            <button 
                              style={{...styles.actionBtn, background: '#f44336'}}
                              onClick={() => {
                                setReviewData({ ...reviewData, action: 'reject', delivIdx: idx, submIdx: subIdx });
                                setShowReviewModal(true);
                              }}
                            >
                              ✕ Request Revision
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit button (only for KOL) */}
                {userRole.isKol && deliverable.submitted < deliverable.required && (
                  <button 
                    style={styles.submitBtn}
                    onClick={() => handleSubmitClick(idx)}
                  >
                    + Submit {getDeliverableLabel(deliverable.type)}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <>
          <div style={styles.modalOverlay} onClick={() => setShowSubmitModal(false)}></div>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Submit Deliverable</h2>
            <div style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Content URL *</label>
                <input 
                  type="url"
                  placeholder="https://instagram.com/... or https://tiktok.com/..."
                  value={submitForm.url}
                  onChange={(e) => setSubmitForm({...submitForm, url: e.target.value})}
                  style={styles.formInput}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Caption (Optional)</label>
                <textarea 
                  placeholder="Add caption or notes..."
                  value={submitForm.caption}
                  onChange={(e) => setSubmitForm({...submitForm, caption: e.target.value})}
                  style={styles.formTextarea}
                  rows={4}
                />
              </div>
              <div style={styles.modalActions}>
                <button 
                  style={{...styles.modalBtn, background: '#e0e0e0', color: '#333'}}
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </button>
                <button 
                  style={{...styles.modalBtn, background: '#4371f0', color: 'white'}}
                  onClick={handleSubmitDeliverable}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <>
          <div style={styles.modalOverlay} onClick={() => setShowReviewModal(false)}></div>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {reviewData.action === 'approve' ? '✓ Approve Submission' : '✕ Request Revision'}
            </h2>
            <div style={styles.modalForm}>
              {reviewData.action === 'reject' && (
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Feedback Message</label>
                  <textarea 
                    placeholder="Tell them what needs to be revised..."
                    value={reviewData.feedback}
                    onChange={(e) => setReviewData({...reviewData, feedback: e.target.value})}
                    style={styles.formTextarea}
                    rows={4}
                  />
                </div>
              )}
              <div style={styles.modalActions}>
                <button 
                  style={{...styles.modalBtn, background: '#e0e0e0', color: '#333'}}
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </button>
                <button 
                  style={{...styles.modalBtn, background: reviewData.action === 'approve' ? '#4CAF50' : '#f44336', color: 'white'}}
                  onClick={handleReviewSubmission}
                  disabled={reviewing}
                >
                  {reviewing ? 'Processing...' : (reviewData.action === 'approve' ? 'Approve' : 'Send Feedback')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#f9f9f9', padding: '20px' },
  header: { marginBottom: '30px' },
  backBtn: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', marginBottom: '10px', color: '#4371f0', fontWeight: '600' },
  title: { margin: 0, fontSize: '32px', fontWeight: '700', color: '#111' },
  mainContent: { maxWidth: '1000px', margin: '0 auto' },
  infoCard: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '24px', marginBottom: '24px' },
  infoPair: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#666', minWidth: '100px' },
  value: { fontSize: '14px', color: '#333' },
  progressBar: { flex: 1, height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#4371f0' },
  deliverables: { marginTop: '30px' },
  sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '20px' },
  deliverableCard: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', marginBottom: '16px', animation: 'slideIn 0.3s ease' },
  delHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  delType: { margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#111' },
  delRequirement: { margin: 0, fontSize: '12px', color: '#999' },
  delBadge: { padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#fff' },
  submissionsList: { marginBottom: '16px' },
  submissionsTitle: { margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: '#666' },
  submissionItem: { background: '#f5f5f5', padding: '12px', borderRadius: '8px', marginBottom: '12px' },
  submissionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  submissionStatus: { padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: '#fff' },
  submissionDate: { fontSize: '11px', color: '#999' },
  submissionUrl: { margin: '8px 0', fontSize: '13px' },
  submissionCaption: { margin: '8px 0', fontSize: '13px', color: '#666', fontStyle: 'italic' },
  submissionFeedback: { margin: '8px 0', fontSize: '13px', color: '#d32f2f', fontStyle: 'italic' },
  submissionActions: { display: 'flex', gap: '8px', marginTop: '12px' },
  actionBtn: { padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#fff', cursor: 'pointer' },
  submitBtn: { width: '100%', padding: '12px', background: '#4371f0', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '12px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998 },
  modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: '16px', padding: '30px', zIndex: 999, minWidth: '400px', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' },
  modalTitle: { margin: '0 0 20px 0', fontSize: '20px', fontWeight: '700', color: '#111' },
  modalForm: { marginBottom: '20px' },
  formGroup: { marginBottom: '16px' },
  formLabel: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '8px' },
  formInput: { width: '100%', padding: '10px 12px', border: '1px solid #d0d0d0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
  formTextarea: { width: '100%', padding: '10px 12px', border: '1px solid #d0d0d0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  modalBtn: { padding: '10px 24px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
};