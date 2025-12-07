import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { WrappedViewer } from '@/components/wrapped/WrappedViewer';
import type { WrappedStats } from '@/types/instagram';
import { getSharedData } from '@/utils/apiClient';

const SHARE_ID_LENGTH = 8;

const DEFAULT_PROFILE = {
  username: 'user',
  fullName: 'User',
  joinDate: '',
  profilePicCount: 0,
};

const transformSharedDataToStats = (data: Record<string, unknown>): WrappedStats => {
  return {
    year: (data.year as number) || new Date().getFullYear(),
    profile: (data.profile as WrappedStats['profile']) || {
      username: (data.username as string) || DEFAULT_PROFILE.username,
      fullName: (data.fullName as string) || DEFAULT_PROFILE.fullName,
      joinDate: DEFAULT_PROFILE.joinDate,
      profilePicCount: DEFAULT_PROFILE.profilePicCount,
    },
    totalLikes: (data.totalLikes as number) || 0,
    totalComments: (data.totalComments as number) || 0,
    totalStoryLikes: (data.totalStoryLikes as number) || 0,
    topEngagedAccounts: (data.topEngagedAccounts as WrappedStats['topEngagedAccounts']) || [],
    totalMessages: (data.totalMessages as number) || 0,
    totalConversations: (data.totalConversations as number) || 0,
    topDMContacts: (data.topDMContacts as WrappedStats['topDMContacts']) || [],
    chatPersonality: (data.chatPersonality as WrappedStats['chatPersonality']) || 'balanced',
    followers: (data.followers as number) || 0,
    following: (data.following as number) || 0,
    netChange: (data.netChange as number) || 0,
    socialRatio: (data.socialRatio as WrappedStats['socialRatio']) || 'balanced',
    savedPosts: (data.savedPosts as number) || 0,
    adsViewed: (data.adsViewed as number) || 0,
    postsViewed: (data.postsViewed as number) || 0,
    videosWatched: (data.videosWatched as number) || 0,
    scrollScore: (data.scrollScore as WrappedStats['scrollScore']) || 'moderate',
    commentVibe: (data.commentVibe as string) || '😊 Friendly Commenter',
    engagementLevel: (data.engagementLevel as WrappedStats['engagementLevel']) || 'casual',
    peakHour: (data.peakHour as number) || 12,
    peakDay: (data.peakDay as string) || 'Sunday',
    totalLogins: (data.totalLogins as number) || 0,
  };
};

const Wrapped = () => {
  const [wrappedStats, setWrappedStats] = useState<WrappedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: shareId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!shareId || shareId.length !== SHARE_ID_LENGTH) {
      setError('Invalid share link');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getSharedData(shareId);
        const sharedStats = transformSharedDataToStats(data);
        
        setWrappedStats(sharedStats);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load shared data from backend:', error);
        setError('Failed to load wrapped data. The share link may be invalid or expired.');
        setLoading(false);
      }
    })();
  }, [shareId]);
  
  const handleReset = () => {
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="blob w-96 h-96 bg-wrapped-pink/10 -top-48 -left-48" />
          <div className="blob w-[500px] h-[500px] bg-wrapped-purple/10 -bottom-64 -right-64" style={{ animationDelay: '3s' }} />
          <div className="blob w-72 h-72 bg-wrapped-cyan/10 top-1/2 left-1/3" style={{ animationDelay: '6s' }} />
        </div>
        
        <div className="relative z-10 text-center space-y-4">
          <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
          <p className="text-lg text-foreground/70">Loading wrapped...</p>
        </div>
      </div>
    );
  }
  
  if (error || !wrappedStats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="blob w-96 h-96 bg-wrapped-pink/10 -top-48 -left-48" />
          <div className="blob w-[500px] h-[500px] bg-wrapped-purple/10 -bottom-64 -right-64" style={{ animationDelay: '3s' }} />
          <div className="blob w-72 h-72 bg-wrapped-cyan/10 top-1/2 left-1/3" style={{ animationDelay: '6s' }} />
        </div>
        
        <div className="relative z-10 text-center space-y-6 px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 space-y-4"
          >
            <AlertCircle className="w-16 h-16 mx-auto text-destructive" />
            <h2 className="text-2xl font-bold text-foreground">Oops!</h2>
            <p className="text-foreground/70">{error}</p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Create Your Own Wrapped
            </button>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob w-96 h-96 bg-wrapped-pink/10 -top-48 -left-48" />
        <div className="blob w-[500px] h-[500px] bg-wrapped-purple/10 -bottom-64 -right-64" style={{ animationDelay: '3s' }} />
        <div className="blob w-72 h-72 bg-wrapped-cyan/10 top-1/2 left-1/3" style={{ animationDelay: '6s' }} />
      </div>
      
      <div className="relative z-10">
        <header className="pt-8 pb-4 px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-black text-gradient-primary">
              InstaWrapped
            </h1>
            <p className="text-muted-foreground mt-2">
              Your Instagram year, beautifully wrapped
            </p>
          </motion.div>
        </header>
        
        <main className="px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <WrappedViewer stats={wrappedStats} onReset={handleReset} />
          </motion.div>
        </main>
        
        <footer className="py-8 text-center">
          <p className="text-xs text-muted-foreground/50">
            Create your own at ig.indrajeeth.in
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Wrapped;
