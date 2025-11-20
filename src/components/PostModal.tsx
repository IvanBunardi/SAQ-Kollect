'use client';

import { useState, useEffect } from 'react';

interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    username: string;
    fullname: string;
    profilePhoto?: string;
    profilePicture?: string;
  };
  createdAt: string;
}

interface PostModalProps {
  postId: string;
  onClose: () => void;
}

export default function PostModal({ postId, onClose }: PostModalProps) {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchPostDetails();
    fetchComments();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      const res = await fetch(`/api/post/${postId}`, {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/post/${postId}/comment`, {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/post/${postId}/like`, {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setPost((prev: any) => ({
          ...prev,
          isLikedByUser: data.isLiked,
          likesCount: data.likesCount
        }));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/post/${postId}/save`, {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setPost((prev: any) => ({
          ...prev,
          isSavedByUser: data.isSaved
        }));
      }
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    setCommentLoading(true);

    try {
      const res = await fetch(`/api/post/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ text: newComment })
      });

      if (res.ok) {
        const data = await res.json();
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
        setPost((prev: any) => ({
          ...prev,
          commentsCount: prev.commentsCount + 1
        }));
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const getAvatarUrl = (profilePhoto?: string, profilePicture?: string, fallbackName?: string) => {
    if (profilePhoto && profilePhoto.trim() !== '') return profilePhoto;
    if (profilePicture && profilePicture.trim() !== '') return profilePicture;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || 'User')}&background=random&size=40&bold=true`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <div style={styles.overlay} onClick={onClose}></div>
        <div style={styles.modal}>
          <div style={{textAlign: 'center', padding: '60px'}}>
            <div style={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!post) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.overlay} onClick={onClose}></div>

      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div style={styles.modalContent}>
          <div style={styles.mediaSection}>
            {post.type === 'video' ? (
              <video 
                src={post.mediaUrl} 
                controls
                style={styles.media}
              />
            ) : (
              <img 
                src={post.mediaUrl} 
                alt="Post" 
                style={styles.media}
              />
            )}
          </div>

          <div style={styles.detailsSection}>
            <div style={styles.userInfo}>
              <img 
                src={getAvatarUrl(
                  post.user?.profilePhoto,
                  post.user?.profilePicture,
                  post.user?.name || post.user?.username
                )}
                alt={post.user?.name}
                style={styles.userAvatar}
                onError={(e: any) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.name || 'User')}&background=random&size=40&bold=true`;
                }}
              />
              <div>
                <h3 style={styles.userName}>{post.user?.name || post.user?.username}</h3>
                <p style={styles.userHandle}>@{post.user?.username}</p>
              </div>
            </div>

            {post.caption && (
              <div style={styles.caption}>
                <p>{post.caption}</p>
              </div>
            )}

            {post.location && (
              <div style={styles.location}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{post.location}</span>
              </div>
            )}

            <div style={styles.divider}></div>

            <div style={styles.actions}>
              <button 
                style={{...styles.actionButton, color: post.isLikedByUser ? '#e357a3' : '#666'}}
                onClick={handleLike}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={post.isLikedByUser ? '#e357a3' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>{post.likesCount}</span>
              </button>

              <button style={styles.actionButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>{post.commentsCount}</span>
              </button>

              <button 
                style={{...styles.actionButton, color: post.isSavedByUser ? '#4371f0' : '#666'}}
                onClick={handleSave}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={post.isSavedByUser ? '#4371f0' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                <span>{post.savesCount}</span>
              </button>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.commentsSection}>
              <h4 style={styles.commentsTitle}>Comments</h4>
              
              <div style={styles.commentsList}>
                {comments.length === 0 ? (
                  <p style={styles.noComments}>No comments yet. Be the first!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} style={styles.commentItem}>
                      <img 
                        src={getAvatarUrl(
                          comment.user.profilePhoto,
                          comment.user.profilePicture,
                          comment.user.fullname || comment.user.username
                        )}
                        alt={comment.user.fullname}
                        style={styles.commentAvatar}
                        onError={(e: any) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.fullname || 'User')}&background=random&size=32&bold=true`;
                        }}
                      />
                      <div style={styles.commentContent}>
                        <div style={styles.commentHeader}>
                          <strong>{comment.user.fullname || comment.user.username}</strong>
                          <span style={styles.commentTime}>{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p style={styles.commentText}>{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
              <input 
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                style={styles.commentInput}
                disabled={commentLoading}
              />
              <button 
                type="submit"
                style={{
                  ...styles.commentSubmit,
                  opacity: commentLoading || !newComment.trim() ? 0.5 : 1,
                  cursor: commentLoading || !newComment.trim() ? 'not-allowed' : 'pointer'
                }}
                disabled={commentLoading || !newComment.trim()}
              >
                {commentLoading ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    zIndex: 9998
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    borderRadius: '16px',
    maxWidth: '1200px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'hidden',
    zIndex: 9999,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transition: 'all 0.2s'
  },
  modalContent: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    height: '90vh'
  },
  mediaSection: {
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  media: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    overflow: 'hidden'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    borderBottom: '1px solid #f0f0f0'
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  userName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#111'
  },
  userHandle: {
    margin: 0,
    fontSize: '14px',
    color: '#666'
  },
  caption: {
    padding: '16px 20px',
    fontSize: '15px',
    color: '#333',
    lineHeight: '1.5'
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0 20px 16px',
    fontSize: '14px',
    color: '#666'
  },
  divider: {
    height: '1px',
    background: '#f0f0f0',
    margin: '0'
  },
  actions: {
    display: 'flex',
    gap: '20px',
    padding: '16px 20px'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    color: '#666',
    transition: 'all 0.2s'
  },
  commentsSection: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto'
  },
  commentsTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#111'
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  noComments: {
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
    padding: '40px 20px'
  },
  commentItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  commentAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0
  },
  commentContent: {
    flex: 1
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  },
  commentTime: {
    fontSize: '12px',
    color: '#999'
  },
  commentText: {
    margin: 0,
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.5'
  },
  commentForm: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px',
    borderTop: '1px solid #f0f0f0',
    background: 'white'
  },
  commentInput: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '20px',
    fontSize: '14px',
    outline: 'none'
  },
  commentSubmit: {
    padding: '10px 24px',
    background: '#4371f0',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f0f0f0',
    borderTop: '4px solid #4371f0',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  }
};