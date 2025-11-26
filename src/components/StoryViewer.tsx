'use client';

import { useState, useEffect, useRef } from 'react';

interface Story {
  _id: string;
  mediaUrl: string;
  mediaType: string;
  caption: string;
  viewersCount: number;
  likesCount: number;
  isViewed: boolean;
  isLiked: boolean;
  createdAt: string;
}

interface StoryViewerProps {
  userId: string;
  stories: Story[];
  user: {
    _id: string;
    username: string;
    fullname: string;
    profilePhoto?: string;
    profilePicture?: string;
  };
  onClose: () => void;
}

export default function StoryViewer({ userId, stories, user, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(stories[0]?.isLiked || false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const currentStory = stories[currentIndex];
  const STORY_DURATION = 5000; // 5 seconds per story

  useEffect(() => {
    if (!currentStory) return;

    // Mark story as viewed
    markAsViewed(currentStory._id);
    setIsLiked(currentStory.isLiked);

    // Start progress bar
    startProgress();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentIndex]);

  const startProgress = () => {
    setProgress(0);
    
    if (progressRef.current) clearInterval(progressRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    const interval = 50; // Update every 50ms
    const increment = (interval / STORY_DURATION) * 100;

    progressRef.current = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          if (prev >= 100) {
            goToNext();
            return 0;
          }
          return prev + increment;
        });
      }
    }, interval);
  };

  const markAsViewed = async (storyId: string) => {
    try {
      await fetch(`/api/story/${storyId}`, {
        credentials: 'include'
      });
    } catch (err) {
      console.error('Error marking story as viewed:', err);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/story/${currentStory._id}`, {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.isLiked);
      }
    } catch (err) {
      console.error('Error liking story:', err);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
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
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1h ago';
    return `${hours}h ago`;
  };

  if (!currentStory) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Progress Bars */}
        <div style={styles.progressContainer}>
          {stories.map((_, index) => (
            <div key={index} style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <img 
              src={getAvatarUrl(user.profilePhoto, user.profilePicture, user.fullname)}
              alt={user.username}
              style={styles.avatar}
            />
            <div>
              <span style={styles.username}>{user.username}</span>
              <span style={styles.time}>{formatTimeAgo(currentStory.createdAt)}</span>
            </div>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Story Content */}
        <div 
          style={styles.content}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Left tap area */}
          <div style={styles.tapLeft} onClick={goToPrev} />
          
          {/* Right tap area */}
          <div style={styles.tapRight} onClick={goToNext} />

          {currentStory.mediaType === 'video' ? (
            <video 
              src={currentStory.mediaUrl}
              style={styles.media}
              autoPlay
              muted
              playsInline
            />
          ) : (
            <img 
              src={currentStory.mediaUrl}
              alt="Story"
              style={styles.media}
            />
          )}

          {/* Caption */}
          {currentStory.caption && (
            <div style={styles.caption}>
              {currentStory.caption}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={styles.footer}>
          <button 
            style={{...styles.actionButton, color: isLiked ? '#e357a3' : 'white'}}
            onClick={handleLike}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill={isLiked ? '#e357a3' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
    height: '100vh',
    maxHeight: '800px',
    background: '#000',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  progressContainer: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    right: '12px',
    display: 'flex',
    gap: '4px',
    zIndex: 10
  },
  progressBar: {
    flex: 1,
    height: '3px',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'white',
    transition: 'width 0.05s linear'
  },
  header: {
    position: 'absolute',
    top: '24px',
    left: '12px',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  username: {
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    marginRight: '8px'
  },
  time: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '12px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  },
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  tapLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '30%',
    height: '100%',
    zIndex: 5
  },
  tapRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '70%',
    height: '100%',
    zIndex: 5
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  caption: {
    position: 'absolute',
    bottom: '80px',
    left: '16px',
    right: '16px',
    color: 'white',
    fontSize: '15px',
    textAlign: 'center',
    textShadow: '0 1px 3px rgba(0,0,0,0.5)'
  },
  footer: {
    position: 'absolute',
    bottom: '24px',
    left: '16px',
    right: '16px',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 10
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px'
  }
};