import { motion } from 'framer-motion';
import { SlideContainer, AnimatedText, AnimatedNumber } from '../SlideContainer';
import { OdometerNumber } from '../OdometerNumber';
import type { WrappedStats } from '@/types/instagram';
import { forwardRef } from 'react';

interface EngagementSlideProps {
  stats: WrappedStats;
}

export const EngagementSlide = forwardRef<HTMLDivElement, EngagementSlideProps>(
  ({ stats }, ref) => {
    const totalEngagement = stats.totalLikes + stats.totalComments + stats.totalStoryLikes;
    
    return (
      <SlideContainer ref={ref} gradient="warm">
        <div className="text-center space-y-8 px-4">
          <AnimatedText delay={0.2}>
            <p className="text-sm sm:text-lg text-foreground/70 font-medium">Your Engagement Energy</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mt-2">
              You showed up! 💪
            </h2>
          </AnimatedText>
          
          <AnimatedText delay={0.5}>
            <div className="space-y-2">
              <p className="text-foreground/60 text-xs sm:text-sm uppercase tracking-wider">Total Interactions</p>
              <OdometerNumber 
                value={totalEngagement} 
                delay={0.7}
                duration={2.5}
                className="stat-number text-gradient-primary text-5xl md:text-6xl font-black"
              />
            </div>
          </AnimatedText>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-sm mx-auto" style={{ transformStyle: 'preserve-3d' }}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              transition={{ 
                delay: 1.2, 
                type: 'spring', 
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-2 sm:p-4 space-y-1"
            >
              <span className="text-xl sm:text-2xl">❤️</span>
              <OdometerNumber 
                value={stats.totalLikes} 
                delay={1.4}
                duration={1.8}
                className="text-lg sm:text-2xl font-bold text-wrapped-pink"
              />
              <p className="text-[10px] sm:text-xs text-foreground/60">Likes</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 1.4, 
                type: 'spring', 
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-2 sm:p-4 space-y-1"
            >
              <span className="text-xl sm:text-2xl">💬</span>
              <OdometerNumber 
                value={stats.totalComments} 
                delay={1.6}
                duration={1.8}
                className="text-lg sm:text-2xl font-bold text-wrapped-cyan"
              />
              <p className="text-[10px] sm:text-xs text-foreground/60">Comments</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              transition={{ 
                delay: 1.6, 
                type: 'spring', 
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-2 sm:p-4 space-y-1"
            >
              <span className="text-xl sm:text-2xl">⭐</span>
              <OdometerNumber 
                value={stats.totalStoryLikes} 
                delay={1.8}
                duration={1.8}
                className="text-lg sm:text-2xl font-bold text-wrapped-yellow"
              />
              <p className="text-[10px] sm:text-xs text-foreground/60">Story Likes</p>
            </motion.div>
          </div>
          
          <AnimatedText delay={2.0}>
            <div className="glass-card px-6 py-4 inline-block">
              <p className="text-sm text-foreground/70">You're a</p>
              <p className="text-xl font-bold text-foreground capitalize">
                {stats.engagementLevel === 'power-user' && '⚡ Power User'}
                {stats.engagementLevel === 'active' && '🌟 Active Engager'}
                {stats.engagementLevel === 'casual' && '😊 Casual Scroller'}
                {stats.engagementLevel === 'lurker' && '👀 Silent Observer'}
              </p>
            </div>
          </AnimatedText>
        </div>
      </SlideContainer>
    );
  }
);

EngagementSlide.displayName = 'EngagementSlide';
