import { motion } from 'framer-motion';
import { SlideContainer, AnimatedText } from '../SlideContainer';
import type { WrappedStats } from '@/types/instagram';
import { forwardRef } from 'react';

interface FollowersSlideProps {
  stats: WrappedStats;
}

const SOCIAL_RATIO_CONFIG = {
  'popular': { emoji: '👑', text: 'You\'re kind of a big deal' },
  'explorer': { emoji: '🧭', text: 'You love discovering new accounts' },
  'balanced': { emoji: '⚖️', text: 'Perfect balance, as all things should be' },
} as const;

export const FollowersSlide = forwardRef<HTMLDivElement, FollowersSlideProps>(
  ({ stats }, ref) => {
    const socialRatio = SOCIAL_RATIO_CONFIG[stats.socialRatio] || SOCIAL_RATIO_CONFIG['balanced'];
    
    return (
      <SlideContainer ref={ref} gradient="cool">
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-4 w-full">
          <AnimatedText delay={0.2}>
            <p className="text-sm sm:text-base md:text-lg text-foreground/70 font-medium">Your Social Circle</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground mt-2">
              The numbers don't lie 📊
            </h2>
          </AnimatedText>
          
          <div className="relative w-full max-w-xs mx-auto" style={{ transformStyle: 'preserve-3d' }}>
            <motion.div
              initial={{ opacity: 0, x: -50, z: -20 }}
              animate={{ opacity: 1, x: 0, z: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
              className="glass-card p-4 sm:p-6 text-center mb-3 sm:mb-4"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-wrapped-cyan">{stats.followers.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-foreground/60 mt-1">Followers</p>
            </motion.div>
            
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                className="bg-background rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 border-border"
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}
              >
                <span className="text-[10px] sm:text-xs font-bold text-foreground/60">VS</span>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 50, z: -20 }}
              animate={{ opacity: 1, x: 0, z: 0 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 100 }}
              className="glass-card p-4 sm:p-6 text-center mt-3 sm:mt-4"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-wrapped-pink">{stats.following.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-foreground/60 mt-1">Following</p>
            </motion.div>
          </div>
          
          <AnimatedText delay={1.1}>
            <div className="glass-card px-3 sm:px-4 md:px-6 py-3 sm:py-4 inline-flex items-center gap-2 sm:gap-3 max-w-xs">
              <span className="text-2xl sm:text-3xl flex-shrink-0">{socialRatio.emoji}</span>
              <div className="text-left">
                <p className="text-xs sm:text-sm text-foreground/60">Your vibe</p>
                <p className="text-sm sm:text-base md:text-lg font-bold text-foreground">{socialRatio.text}</p>
              </div>
            </div>
          </AnimatedText>
        </div>
      </SlideContainer>
    );
  }
);

FollowersSlide.displayName = 'FollowersSlide';
