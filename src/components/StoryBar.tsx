'use client';

import { useState, useEffect } from 'react';

interface StoryUser {
  user: {
    _id: string;
    username: string;
    fullname: string;
    profilePhoto?: string;
    profilePicture?: string;
  };
  stories: any[];
  hasUnviewed: boolean;
}

interface StoryBarProps {
  onStoryClick: (userId: string, stories: any[]) => void;
  onAddStory: () => void;
}

export default function StoryBar({ onStoryClick, onAddStory }: StoryBarProps) {
  const [storyUsers, setStoryUsers] = useState<StoryUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/story', {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setStoryUsers(data.storyUsers || []);
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = (profilePhoto?: string, profilePicture?: string, fallbackName?: string) => {
    if (profilePhoto && profilePhoto.trim() !== '') return profilePhoto;
    if (profilePicture && profilePicture.trim() !== '') return profilePicture;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || 'User')}&background=random&size=64&bold=true`;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading stories...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Add Story Button */}
      <div style={styles.storyItem} onClick={onAddStory}>
        <div style={styles.addStoryRing}>
          <div style={styles.addStoryInner}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4371f0" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
        </div>
        <span style={styles.username}>Your Story</span>
      </div>

      {/* Story Users */}
      {storyUsers.map((storyUser) => (
        <div 
          key={storyUser.user._id} 
          style={styles.storyItem}
          onClick={() => onStoryClick(storyUser.user._id, storyUser.stories)}
        >
          <div style={{
            ...styles.storyRing,
            background: storyUser.hasUnviewed 
              ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
              : '#ccc'
          }}>
            <div style={styles.storyInner}>
              <img 
                src={getAvatarUrl(
                  storyUser.user.profilePhoto,
                  storyUser.user.profilePicture,
                  storyUser.user.fullname
                )}
                alt={storyUser.user.username}
                style={styles.avatar}
                onError={(e: any) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(storyUser.user.fullname || 'User')}&background=random&size=64&bold=true`;
                }}
              />
            </div>
          </div>
          <span style={{
            ...styles.username,
            fontWeight: storyUser.hasUnviewed ? '600' : '400'
          }}>
            {storyUser.user.username.length > 10 
              ? storyUser.user.username.substring(0, 10) + '...' 
              : storyUser.user.username}
          </span>
        </div>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    gap: '16px',
    padding: '16px 0',
    overflowX: 'auto',
    marginBottom: '24px'
  },
  storyItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    minWidth: '80px'
  },
  storyRing: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    padding: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  storyInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'white',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  addStoryRing: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    border: '2px dashed #4371f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addStoryInner: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#f0f5ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  username: {
    fontSize: '12px',
    color: '#333',
    textAlign: 'center',
    maxWidth: '80px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  loadingText: {
    fontSize: '14px',
    color: '#666'
  }
};