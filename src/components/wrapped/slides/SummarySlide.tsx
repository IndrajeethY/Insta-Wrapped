import { motion } from 'framer-motion';
import { SlideContainer, AnimatedText } from '../SlideContainer';
import type { WrappedStats } from '@/types/instagram';
import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, ImageDown, Instagram } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface SummarySlideProps {
  stats: WrappedStats;
  onShare?: () => void;
  onDownloadImage?: () => void;
  onShareInstagram?: () => void;
  shareUrl?: string | null;
}

export const SummarySlide = forwardRef<HTMLDivElement, SummarySlideProps>(
  ({ stats, onShare, onDownloadImage, onShareInstagram, shareUrl }, ref) => {
    
    const totalInteractions = stats.totalLikes + stats.totalComments + stats.totalStoryLikes;
    const totalContent = stats.postsViewed + stats.videosWatched;
    
    const getFancyTitle = (): string => {
      if (stats.engagementLevel === 'power-user') {
        return '⚡ Power User Extraordinaire';
      }
      if (stats.scrollScore === 'legendary') {
        return '🏆 Legendary Feed Consumer';
      }
      if (stats.scrollScore === 'doomscroller') {
        return '🫠 Professional Doomscroller';
      }
      if (stats.totalMessages > 10000) {
        return '💬 Ultimate Conversationalist';
      }
      if (stats.followers > stats.following * 2) {
        return '👑 Instagram Influencer';
      }
      if (stats.following > stats.followers * 2) {
        return '🧭 Curious Explorer';
      }
      if (totalInteractions > 5000) {
        return '🌟 Super Engager';
      }
      if (stats.chatPersonality === 'night-owl') {
        return '🦉 Night Owl Extraordinaire';
      }
      if (stats.chatPersonality === 'early-bird') {
        return '🐦 Early Bird Champion';
      }
      if (stats.totalMessages > 5000) {
        return '💬 Master Communicator';
      }
      if (totalContent > 50000) {
        return '📱 Content Connoisseur';
      }
      if (stats.engagementLevel === 'active') {
        return '🔥 Active Engager';
      }
      if (stats.socialRatio === 'popular') {
        return '✨ Rising Star';
      }
      return '🎉 Instagram Enthusiast';
    };
    
    return (
      <SlideContainer ref={ref} gradient="primary">
        <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6 py-4 sm:py-6 space-y-2 sm:space-y-3 md:space-y-4">
          {/* Profile Section */}
          <AnimatedText delay={0.2}>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="relative"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-wrapped-pink via-wrapped-purple to-wrapped-cyan p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    {stats.profile?.profilePicture ? (
                      <img 
                        src={stats.profile.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-wrapped-pink/20 to-wrapped-purple/20 flex items-center justify-center">
                        <span className="text-2xl font-bold text-foreground">
                          {stats.profile?.fullName?.[0] || stats.profile?.username?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              
              <div className="text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-foreground">
                  {stats.profile?.fullName || stats.profile?.username || 'Instagram User'}
                </h2>
                {stats.profile?.username && (
                  <p className="text-xs sm:text-sm text-foreground/70">
                    @{stats.profile.username}
                  </p>
                )}
              </div>
            </div>
          </AnimatedText>
          
          {/* Title Section */}
          <AnimatedText delay={0.5}>
            <div className="text-center space-y-0.5 sm:space-y-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-foreground leading-tight px-2">
                {getFancyTitle()}
              </h3>
              <p className="text-[10px] sm:text-xs text-foreground/60 uppercase tracking-wider">
                {stats.year} Instagram Wrapped
              </p>
            </div>
          </AnimatedText>
          
          {/* Stats Grid - 2x2 layout */}
          <AnimatedText delay={0.7}>
            <div className="w-full max-w-md grid grid-cols-2 gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="glass-card p-2 sm:p-3 border-l-4 border-wrapped-pink"
              >
                <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                  <p className="text-[10px] sm:text-xs text-foreground/60 uppercase tracking-wider">Interactions</p>
                  <span className="text-lg sm:text-2xl">❤️</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-wrapped-pink mb-0.5 sm:mb-1">{totalInteractions.toLocaleString()}</p>
                <div className="text-[10px] text-foreground/50 space-y-0.5">
                  <div>{stats.totalLikes.toLocaleString()} Likes</div>
                  <div>{stats.totalComments.toLocaleString()} Comments</div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: 'spring' }}
                className="glass-card p-2 sm:p-3 border-l-4 border-wrapped-cyan"
              >
                <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                  <p className="text-[10px] sm:text-xs text-foreground/60 uppercase tracking-wider">Messages</p>
                  <span className="text-lg sm:text-2xl">💬</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-wrapped-cyan mb-0.5 sm:mb-1">{stats.totalMessages.toLocaleString()}</p>
                <div className="text-[10px] text-foreground/50 space-y-0.5">
                  <div>{stats.totalMessages.toLocaleString()} Sent</div>
                  <div>{stats.totalConversations.toLocaleString()} Chats</div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, type: 'spring' }}
                className="glass-card p-2 sm:p-3 border-l-4 border-wrapped-purple"
              >
                <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                  <p className="text-[10px] sm:text-xs text-foreground/60 uppercase tracking-wider">Social</p>
                  <span className="text-lg sm:text-2xl">👥</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-wrapped-purple mb-0.5 sm:mb-1">{stats.followers.toLocaleString()}</p>
                <div className="text-[10px] text-foreground/50 space-y-0.5">
                  <div>{stats.followers.toLocaleString()} Followers</div>
                  <div>{stats.following.toLocaleString()} Following</div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, type: 'spring' }}
                className="glass-card p-2 sm:p-3 border-l-4 border-wrapped-yellow"
              >
                <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                  <p className="text-[10px] sm:text-xs text-foreground/60 uppercase tracking-wider">Content</p>
                  <span className="text-lg sm:text-2xl">📱</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-wrapped-yellow mb-0.5 sm:mb-1">{totalContent.toLocaleString()}</p>
                <div className="text-[10px] text-foreground/50 space-y-0.5">
                  <div>{stats.postsViewed.toLocaleString()} Posts</div>
                  <div>{stats.videosWatched.toLocaleString()} Videos</div>
                </div>
              </motion.div>
            </div>
          </AnimatedText>
          
          {/* QR Code Section - Only shown when shareUrl exists */}
          {shareUrl && (
            <AnimatedText delay={1.2}>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 mt-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3, type: 'spring' }}
                  className="bg-white p-1.5 sm:p-2 rounded-lg shadow-lg"
                >
                  <QRCodeSVG 
                    value={shareUrl} 
                    size={80}
                    level="M"
                    includeMargin={false}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                  />
                </motion.div>
                <p className="text-[9px] sm:text-[10px] text-foreground/50 text-center max-w-[180px] leading-tight">
                  Scan to view full wrapped
                </p>
              </div>
            </AnimatedText>
          )}
          
          {/* Action Buttons */}
          <AnimatedText delay={1.3}>
            <div className="download-buttons flex gap-2 justify-center mt-2 flex-wrap">
              <Button
                onClick={onDownloadImage}
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90 font-bold gap-1.5 text-xs"
              >
                <ImageDown className="w-3 h-3" />
                Save
              </Button>
              <Button
                onClick={onShareInstagram}
                size="sm"
                className="bg-gradient-to-r from-wrapped-pink via-wrapped-purple to-wrapped-orange text-white hover:opacity-90 font-bold gap-1.5 text-xs"
              >
                <Instagram className="w-3 h-3" />
                Share
              </Button>
            </div>
          </AnimatedText>
          
          {/* Footer */}
          <AnimatedText delay={1.5}>
            <div className="text-center space-y-0.5">
              <p className="text-[10px] text-foreground/40">
                ig.indrajeeth.in • InstaWrapped
              </p>
            </div>
          </AnimatedText>
        </div>
      </SlideContainer>
    );
  }
);

SummarySlide.displayName = 'SummarySlide';
