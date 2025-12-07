import { motion } from 'framer-motion';
import { SlideContainer, AnimatedText, AnimatedNumber } from '../SlideContainer';
import type { WrappedStats } from '@/types/instagram';
import { forwardRef } from 'react';

interface AlgorithmSlideProps {
  stats: WrappedStats;
}

const SCROLL_SCORE_CONFIG = {
  'casual': { emoji: '😌', text: 'Casual Scroller' },
  'moderate': { emoji: '📱', text: 'Dedicated Browser' },
  'doomscroller': { emoji: '🫠', text: 'Professional Doomscroller' },
  'legendary': { emoji: '🏆', text: 'Legendary Feed Consumer' },
} as const;

export const AlgorithmSlide = forwardRef<HTMLDivElement, AlgorithmSlideProps>(
  ({ stats }, ref) => {
    const totalContent = stats.postsViewed + stats.videosWatched;
    const scrollScore = SCROLL_SCORE_CONFIG[stats.scrollScore] || SCROLL_SCORE_CONFIG['moderate'];
    
    return (
      <SlideContainer ref={ref} gradient="sunset">
        <div className="text-center space-y-4 sm:space-y-6 px-2 sm:px-4 w-full">
          <AnimatedText delay={0.2}>
            <p className="text-sm sm:text-base md:text-lg text-foreground/70 font-medium">You & The Algorithm</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground mt-2">
              You scrolled...<br />a lot 📜
            </h2>
          </AnimatedText>
          
          <AnimatedText delay={0.5}>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-foreground/60 text-xs sm:text-sm uppercase tracking-wider">Total Content Viewed</p>
              <AnimatedNumber value={totalContent} delay={0.7} />
            </div>
          </AnimatedText>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-sm mx-auto" style={{ transformStyle: 'preserve-3d' }}>
            <motion.div
              initial={{ opacity: 0, y: 20, z: -20 }}
              animate={{ opacity: 1, y: 0, z: 0 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 100 }}
              className="glass-card p-2 sm:p-3 space-y-1"
            >
              <span className="text-lg sm:text-xl">📷</span>
              <p className="text-sm sm:text-base md:text-lg font-bold text-wrapped-pink">{stats.postsViewed.toLocaleString()}</p>
              <p className="text-[10px] sm:text-xs text-foreground/60">Posts</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20, z: -20 }}
              animate={{ opacity: 1, y: 0, z: 0 }}
              transition={{ delay: 1.0, type: 'spring', stiffness: 100 }}
              className="glass-card p-2 sm:p-3 space-y-1"
            >
              <span className="text-lg sm:text-xl">🎬</span>
              <p className="text-sm sm:text-base md:text-lg font-bold text-wrapped-cyan">{stats.videosWatched.toLocaleString()}</p>
              <p className="text-[10px] sm:text-xs text-foreground/60">Videos</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20, z: -20 }}
              animate={{ opacity: 1, y: 0, z: 0 }}
              transition={{ delay: 1.1, type: 'spring', stiffness: 100 }}
              className="glass-card p-2 sm:p-3 space-y-1"
            >
              <span className="text-lg sm:text-xl">📢</span>
              <p className="text-sm sm:text-base md:text-lg font-bold text-wrapped-orange">{stats.adsViewed.toLocaleString()}</p>
              <p className="text-[10px] sm:text-xs text-foreground/60">Ads</p>
            </motion.div>
          </div>
          
          <AnimatedText delay={1.3}>
            <div className="glass-card px-3 sm:px-4 md:px-6 py-3 sm:py-4 inline-flex items-center gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl">{scrollScore.emoji}</span>
              <div className="text-left">
                <p className="text-xs sm:text-sm text-foreground/60">You're a</p>
                <p className="text-sm sm:text-base md:text-lg font-bold text-foreground">{scrollScore.text}</p>
              </div>
            </div>
          </AnimatedText>
          
          {stats.savedPosts > 0 && (
            <AnimatedText delay={1.5}>
              <p className="text-xs sm:text-sm text-foreground/50 px-2">
                And you saved <span className="font-bold text-foreground">{stats.savedPosts.toLocaleString()}</span> posts for later
                <br />(we know you'll never look at them again 😏)
              </p>
            </AnimatedText>
          )}
        </div>
      </SlideContainer>
    );
  }
);

AlgorithmSlide.displayName = 'AlgorithmSlide';
