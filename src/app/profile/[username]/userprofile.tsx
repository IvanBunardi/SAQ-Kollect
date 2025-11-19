// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// reuse the styles object from your ProfilePage (kept consistent)
const styles = {
  circles: { position: "fixed", width: "100%", height: "100%", overflow: "hidden", zIndex: -1 },
  circle: { position: "absolute", borderRadius: "50%", opacity: 1, animation: "float 15s infinite ease-in-out" },
  pink: { background: "#e357a3" },
  lightpink: { background: "#f4a3c8" },
  blue: { background: "#4371f0" },
  lightblue: { background: "#a5c8f0" },
  verylightblue: { background: "#c8ddf0" },
  huge: { width: "350px", height: "350px" },
  extrabig: { width: "280px", height: "280px" },
  big: { width: "200px", height: "200px" },
  container: { display: "flex", minHeight: "100vh", background: "white" },

  sidebar: {
    width: "260px",
    background: "#fafbfc",
    position: "fixed",
    height: "100vh",
    left: 0,
    top: 0,
    zIndex: 100,
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #e8e8e8",
  },
  logo: { marginBottom: "50px", paddingLeft: "10px" },
  navMenu: { display: "flex", flexDirection: "column", gap: "4px", flex: 1 },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 18px",
    borderRadius: "12px",
    color: "#666",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
    background: "#e8eaed",
    transition: "all 0.2s ease",
    cursor: "pointer",
    border: "none",
  },
  navItemActive: { background: "#4371f0", color: "white" },
  sidebarDecoration: { position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", overflow: "hidden", pointerEvents: "none" },
  sidebarCircle: { position: "absolute", borderRadius: "50%", opacity: 0.5, animation: "float 12s infinite ease-in-out" },

  mainContent: { flex: 1, marginLeft: "260px", padding: "40px 60px", zIndex: 10 },

  successMessage: {
    background: "#d4edda",
    color: "#155724",
    padding: "14px 20px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "15px",
    border: "1px solid #c3e6cb",
  },
  errorMessage: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "14px 20px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "15px",
    border: "1px solid #f5c6cb",
  },

  profileHeader: { display: "flex", gap: "35px", marginBottom: "30px", alignItems: "flex-start" },
  profileAvatar: { width: "150px", height: "150px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "4px solid #f0f0f0" },
  profileInfo: { flex: 1 },
  profileUsername: { margin: 0, fontSize: "32px", fontWeight: "700", color: "#111", marginBottom: "5px" },
  profileTitle: { margin: 0, fontSize: "20px", fontWeight: "600", color: "#111", marginBottom: "8px" },
  profileCategory: { margin: 0, fontSize: "16px", color: "#666", marginBottom: "15px" },
  profileStats: { display: "flex", gap: "25px", marginBottom: "15px" },
  stat: { fontSize: "15px", color: "#333" },
  profileBio: { fontSize: "15px", color: "#333", lineHeight: "1.6", margin: 0 },

  actionButtons: { display: "flex", gap: "15px", marginBottom: "35px" },
  btnSecondary: {
    padding: "12px 28px",
    background: "#f0f2f5",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#333",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  btnPrimary: {
    padding: "12px 28px",
    background: "#e357a3",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "500",
    color: "white",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  tabsContainer: { display: "flex", gap: "5px", marginBottom: "30px", borderBottom: "2px solid #f0f0f0" },
  tab: { padding: "12px 0", marginRight: "30px", background: "none", border: "none", fontSize: "16px", fontWeight: "500", color: "#999", cursor: "pointer", position: "relative", transition: "color 0.2s" },
  tabActive: { color: "#333", fontWeight: "600" },
  tabInactive: { color: "#999" },

  contentGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "25px", marginBottom: "25px" },
  card: { borderRadius: "24px", padding: "28px", minHeight: "300px" },
  cardHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
  cardTitle: { margin: 0, fontSize: "18px", fontWeight: "600", color: "white" },
  cardContent: { flex: 1 },
  campaignPreview: { width: "100%", height: "200px", background: "white", borderRadius: "16px" },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" },
  metricBox: { background: "white", borderRadius: "16px", padding: "20px", textAlign: "center" },
  metricValue: { margin: 0, fontSize: "28px", fontWeight: "700", color: "#111", marginBottom: "5px" },
  metricLabel: { margin: 0, fontSize: "13px", color: "#666" },

  placeholderGrid: { display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "25px" },
  placeholderCard: { background: "linear-gradient(135deg, #e8e8e8, #f5f5f5)", borderRadius: "24px", minHeight: "280px" },
  placeholderCardLarge: { background: "linear-gradient(135deg, #e8e8e8, #f5f5f5)", borderRadius: "24px", minHeight: "280px" },

  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "20px" },
  spinner: { width: "50px", height: "50px", border: "5px solid #f0f0f0", borderTop: "5px solid #4371f0", borderRadius: "50%", animation: "spin 1s linear infinite" },
  errorContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "20px", padding: "20px" },
  errorText: { fontSize: "18px", color: "#e74c3c", textAlign: "center" },

  postsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
  postCard: { width: "100%", height: "260px", borderRadius: "12px", overflow: "hidden", background: "#eee" },
};

type User = {
  id: string;
  fullname: string;
  username: string;
  role?: string;
  email?: string;
  createdAt?: string;
  bio?: string;
  profilePicture?: string;
  profilePhoto?: string;
  followersCount?: number;
  followingCount?: number;
};

type Post = {
  _id: string;
  caption?: string;
  mediaUrl?: string;
  createdAt?: string;
};

export default function UserProfile({ username }: { username: string }) {
  const [userData, setUserData] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "work">("profile");
  const router = useRouter();

  useEffect(() => {
    if (!username) return;
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/profile/${username}`);
      
      console.log('🔍 Profile API Response Status:', res.status);
      
      if (!res.ok) {
        let txt = await res.text();
        try {
          const j = JSON.parse(txt);
          setError(j.message || "Failed to load profile");
        } catch {
          setError("Failed to load profile");
        }
        setUserData(null);
        setPosts([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log('📦 Profile Data:', data);
      
      if (!data.success) {
        setError(data.message || "User not found");
        setUserData(null);
        setLoading(false);
        return;
      }

      console.log('✅ User Data Loaded:', {
        username: data.user.username,
        hasProfilePhoto: !!data.user.profilePhoto,
        hasProfilePicture: !!data.user.profilePicture,
        profilePhoto: data.user.profilePhoto?.substring(0, 50) + '...',
      });

      setUserData(data.user || null);

      // fetch posts
      const resPosts = await fetch(`/api/profile/${username}/posts`);
      if (resPosts.ok) {
        const postsData = await resPosts.json();
        setPosts(postsData.posts || []);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("❌ Fetch profile error:", err);
      setError("Failed to load profile");
      setUserData(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = (username: string, profilePhoto: string | null, profilePicture: string | null) => {
    // Prioritas: profilePhoto > profilePicture > generated avatar
    if (profilePhoto && profilePhoto.trim() !== '') {
      console.log('🖼️ Using profilePhoto:', profilePhoto.substring(0, 50) + '...');
      return profilePhoto;
    }
    if (profilePicture && profilePicture.trim() !== '') {
      console.log('🖼️ Using profilePicture:', profilePicture.substring(0, 50) + '...');
      return profilePicture;
    }
    console.log('🎨 Generating avatar for:', username);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&size=150&bold=true`;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner as any} />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.btnPrimary as any} onClick={() => router.push("/")}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          66% { transform: translateY(15px) translateX(-10px) rotate(-3deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        body { margin: 0; padding: 0; overflow-x: hidden; }
      `}</style>

      <div style={styles.circles as any}>
        <div style={{ ...styles.circle, ...styles.blue, ...styles.huge, top: "-180px", left: "-180px", animationDelay: "0s" }} />
        <div style={{ ...styles.circle, ...styles.lightpink, ...styles.extrabig, top: "-120px", left: "120px", animationDelay: "2s" }} />
        <div style={{ ...styles.circle, ...styles.lightblue, ...styles.big, top: "50px", left: "150px", animationDelay: "1s" }} />
        <div style={{ ...styles.circle, ...styles.blue, ...styles.huge, bottom: "-150px", left: "-120px", animationDelay: "1s" }} />
        <div style={{ ...styles.circle, ...styles.pink, ...styles.extrabig, bottom: "-80px", left: "180px", animationDelay: "3s" }} />
        <div style={{ ...styles.circle, ...styles.blue, ...styles.huge, top: "-160px", right: "-160px", animationDelay: "2s" }} />
        <div style={{ ...styles.circle, ...styles.lightpink, ...styles.extrabig, top: "-100px", right: "140px", animationDelay: "4s" }} />
        <div style={{ ...styles.circle, ...styles.blue, ...styles.huge, bottom: "-140px", right: "-120px", animationDelay: "3s" }} />
        <div style={{ ...styles.circle, ...styles.pink, ...styles.extrabig, bottom: "-60px", right: "160px", animationDelay: "1s" }} />
      </div>

      <div style={styles.container as any}>
        <div style={styles.sidebar as any}>
          <div style={styles.logo as any}>
            <Image src="/assets/logo-full.png" alt="Kollect Logo" width={200} height={106} style={{ objectFit: "contain" }} />
          </div>

          <nav style={styles.navMenu as any}>
            <Link href="/feeds" style={styles.navItem as any}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </Link>
            <Link href="/search" style={styles.navItem as any}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>Search</span>
            </Link>
            <Link href="/explore" style={styles.navItem as any}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span>Explore</span>
            </Link>
            <Link href="/messages" style={styles.navItem as any}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Messages</span>
            </Link>
            <Link href="/notifications" style={styles.navItem as any}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span>Notifications</span>
            </Link>
            <Link href="/create" style={styles.navItem as any}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Create</span>
            </Link>
            <Link href="/profile/me" style={styles.navItem as any}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </Link>
            <Link href="/work" style={styles.navItem as any}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>Work</span>
            </Link>
            <Link href="/settings" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2"/>
              </svg>
              <span>Settings</span>
            </Link>
          </nav>

          <div style={styles.sidebarDecoration as any}>
            <div style={{ ...styles.sidebarCircle, width: "100px", height: "100px", bottom: "20px", left: "-20px", background: "#4371f0" }} />
            <div style={{ ...styles.sidebarCircle, width: "80px", height: "80px", bottom: "80px", left: "30px", background: "#e357a3", animationDelay: "2s" }} />
          </div>
        </div>

        <div style={styles.mainContent as any}>
          {error && (
            <div style={styles.errorMessage as any}>
              {error}
            </div>
          )}

          <div style={styles.profileHeader as any}>
            <div style={styles.profileAvatar as any}>
              <img
                src={getAvatarUrl(
                  userData?.username || 'User',
                  userData?.profilePhoto || null,
                  userData?.profilePicture || null
                )}
                alt={userData?.fullname || userData?.username}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                onError={(e) => {
                  console.error('❌ Image load error, falling back to generated avatar');
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.username || 'User')}&background=random&size=150&bold=true`;
                }}
              />
            </div>

            <div style={styles.profileInfo as any}>
              <h1 style={styles.profileUsername as any}>{userData?.username || "—"}</h1>
              <h2 style={styles.profileTitle as any}>{userData?.role ? userData.role.toUpperCase() : "USER"}</h2>
              <p style={styles.profileCategory as any}>{userData?.fullname || ""} • {userData?.email || ""}</p>

              <div style={styles.profileStats as any}>
                <span style={styles.stat as any}><strong>{userData?.followersCount ?? "10K"}</strong> followers</span>
                <span style={styles.stat as any}><strong>{userData?.followingCount ?? "539"}</strong> following</span>
              </div>

              <p style={styles.profileBio as any}>
                {userData?.bio || (userData?.createdAt ? `Member since ${new Date(userData.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : "")}
              </p>

              <div style={styles.actionButtons as any}>
                <button style={styles.btnPrimary as any} onClick={() => router.push(`/hire/${userData?.username || ""}`)}>
                  Hire for Campaign
                </button>
                <button style={styles.btnSecondary as any} onClick={() => router.push(`/messages/compose?to=${userData?.username || ""}`)}>
                  Message
                </button>
              </div>
            </div>
          </div>

          <div style={styles.tabsContainer as any}>
            <button style={{ ...styles.tab as any, ...(activeTab === "profile" ? styles.tabActive : {}) }} onClick={() => setActiveTab("profile")}>Profile</button>
            <button style={{ ...styles.tab as any, ...(activeTab === "work" ? styles.tabActive : {}) }} onClick={() => setActiveTab("work")}>Work</button>
          </div>

          {activeTab === "profile" ? (
            <>
              <div style={styles.contentGrid as any}>
                <div style={{ ...styles.card as any, background: "linear-gradient(135deg, #a5c8f0, #c8ddf0)" }}>
                  <div style={styles.cardHeader as any}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <h3 style={styles.cardTitle as any}>Recent Posts</h3>
                  </div>
                  <div style={styles.cardContent as any}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                      {posts.slice(0, 6).map((p) => (
                        <div key={p._id} style={{ borderRadius: 12, overflow: "hidden", height: 120, background: "#fff" }}>
                          {p.mediaUrl ? <img src={p.mediaUrl} alt="Post" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ padding: 8, fontSize: 12 }}>{p.caption}</div>}
                        </div>
                      ))}
                      {posts.length === 0 && <p style={{ color: "#666", gridColumn: "1 / -1" }}>No posts yet.</p>}
                    </div>
                  </div>
                </div>

                <div style={{ ...styles.card as any, background: "linear-gradient(135deg, #e357a3, #f4a3c8)" }}>
                  <div style={styles.cardHeader as any}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <h3 style={styles.cardTitle as any}>Performance Metrics</h3>
                  </div>
                  <div style={styles.metricsGrid as any}>
                    <div style={styles.metricBox as any}>
                      <p style={styles.metricValue as any}>5.4%</p>
                      <p style={styles.metricLabel as any}>Avg. Engagement Rate</p>
                    </div>
                    <div style={styles.metricBox as any}>
                      <p style={styles.metricValue as any}>25K</p>
                      <p style={styles.metricLabel as any}>Avg. Per Post</p>
                    </div>
                    <div style={styles.metricBox as any}>
                      <p style={styles.metricValue as any}>3.5%</p>
                      <p style={styles.metricLabel as any}>Click-Through Rate</p>
                    </div>
                    <div style={styles.metricBox as any}>
                      <p style={styles.metricValue as any}>2.4%</p>
                      <p style={styles.metricLabel as any}>Conversion Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.placeholderGrid as any}>
                <div style={styles.placeholderCard as any}></div>
                <div style={styles.placeholderCardLarge as any}></div>
                <div style={styles.placeholderCard as any}></div>
              </div>
            </>
          ) : (
            <div>
              <div style={{ ...styles.card as any, background: "linear-gradient(135deg, #a5c8f0, #c8ddf0)" }}>
                <div style={styles.cardHeader as any}>
                  <h3 style={styles.cardTitle as any}>Work / Portfolio</h3>
                </div>
                <div style={styles.cardContent as any}>
                  <p style={{ color: "#666" }}>This user's public work and portfolio will appear here.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}