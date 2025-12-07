import { motion } from 'framer-motion';
import { SlideContainer, AnimatedText } from '../SlideContainer';
import type { WrappedStats } from '@/types/instagram';
import { forwardRef } from 'react';

interface FinaleSlideProps {
  stats: WrappedStats;
}

export const FinaleSlide = forwardRef<HTMLDivElement, FinaleSlideProps>(
  ({ stats }, ref) => {
    return (
      <SlideContainer ref={ref} gradient="aurora">
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-4 w-full">
          <AnimatedText delay={0.2}>
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl sm:text-5xl md:text-6xl"
            >
              🎉
            </motion.div>
          </AnimatedText>
          
          <AnimatedText delay={0.5}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground">
              That's your {stats.year}!
            </h2>
          </AnimatedText>
          
          <AnimatedText delay={0.8}>
            <p className="text-sm sm:text-base md:text-lg text-foreground/70 px-2">
              {stats.profile?.fullName || stats.profile?.username || 'You'}, thanks for scrolling with us
            </p>
          </AnimatedText>
          
          <AnimatedText delay={1.1}>
            <div className="glass-card p-4 sm:p-6 w-full max-w-xs mx-auto space-y-2 sm:space-y-3" style={{ transformStyle: 'preserve-3d' }}>
              <p className="text-xs sm:text-sm text-foreground/60 uppercase tracking-wider">Your Year in Numbers</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3, type: 'spring', stiffness: 100 }}
                >
                  <p className="text-xl sm:text-2xl font-bold text-wrapped-pink">{stats.totalLikes.toLocaleString()}</p>
                  <p className="text-[10px] sm:text-xs text-foreground/60">Likes</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, type: 'spring', stiffness: 100 }}
                >
                  <p className="text-xl sm:text-2xl font-bold text-wrapped-cyan">{stats.totalMessages.toLocaleString()}</p>
                  <p className="text-[10px] sm:text-xs text-foreground/60">DMs</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, type: 'spring', stiffness: 100 }}
                >
                  <p className="text-xl sm:text-2xl font-bold text-wrapped-yellow">{(stats.postsViewed + stats.videosWatched).toLocaleString()}</p>
                  <p className="text-[10px] sm:text-xs text-foreground/60">Content</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, type: 'spring', stiffness: 100 }}
                >
                  <p className="text-xl sm:text-2xl font-bold text-wrapped-green">{stats.followers.toLocaleString()}</p>
                  <p className="text-[10px] sm:text-xs text-foreground/60">Followers</p>
                </motion.div>
              </div>
            </div>
          </AnimatedText>
          

          
          <AnimatedText delay={1.6}>
            <p className="text-center text-xs sm:text-sm text-foreground/60 mt-2 sm:mt-4 px-2">
              Create your own wrapped at{' '}
              <a 
                href="https://ig.indrajeeth.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                ig.indrajeeth.in
              </a>
            </p>
          </AnimatedText>
          
          <AnimatedText delay={1.7}>
            <p className="text-xs text-foreground/40">
              Made with ❤️ by InstaWrapped
            </p>
          </AnimatedText>
        </div>
      </SlideContainer>
    );
  }
);

FinaleSlide.displayName = 'FinaleSlide';
