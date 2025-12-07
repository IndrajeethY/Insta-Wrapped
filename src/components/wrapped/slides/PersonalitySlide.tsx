import { motion } from 'framer-motion';
import { SlideContainer, AnimatedText } from '../SlideContainer';
import type { WrappedStats } from '@/types/instagram';
import { forwardRef } from 'react';

interface PersonalitySlideProps {
  stats: WrappedStats;
}

const formatHour = (hour: number): string => {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};

export const PersonalitySlide = forwardRef<HTMLDivElement, PersonalitySlideProps>(
  ({ stats }, ref) => {
    const [emoji, ...textParts] = stats.commentVibe.split(' ');
    const vibeText = textParts.join(' ');
    
    return (
      <SlideContainer ref={ref} gradient="primary">
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-4 w-full">
          <AnimatedText delay={0.2}>
            <p className="text-sm sm:text-base md:text-lg text-foreground/70 font-medium">Your Instagram Personality</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground mt-2">
              Based on your activity...
            </h2>
          </AnimatedText>
          
          <AnimatedText delay={0.6}>
            <motion.div 
              className="glass-card p-4 sm:p-6 md:p-8 w-full max-w-xs mx-auto"
              animate={{ 
                boxShadow: ['0 0 30px hsl(330 100% 60% / 0.2)', '0 0 60px hsl(330 100% 60% / 0.4)', '0 0 30px hsl(330 100% 60% / 0.2)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.p 
                className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {emoji}
              </motion.p>
              <p className="text-lg sm:text-xl md:text-2xl font-black text-foreground">
                {vibeText}
              </p>
            </motion.div>
          </AnimatedText>
          
          <div className="space-y-2 sm:space-y-3 w-full max-w-xs mx-auto" style={{ transformStyle: 'preserve-3d' }}>
            <motion.div
              initial={{ opacity: 0, x: -20, z: -20 }}
              animate={{ opacity: 1, x: 0, z: 0 }}
              transition={{ delay: 1.0, type: 'spring', stiffness: 100 }}
              className="glass-card px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center"
            >
              <span className="text-xs sm:text-sm md:text-base text-foreground/70">Peak activity</span>
              <span className="text-xs sm:text-sm md:text-base font-bold text-foreground">{formatHour(stats.peakHour)}</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20, z: -20 }}
              animate={{ opacity: 1, x: 0, z: 0 }}
              transition={{ delay: 1.1, type: 'spring', stiffness: 100 }}
              className="glass-card px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center"
            >
              <span className="text-xs sm:text-sm md:text-base text-foreground/70">App opens</span>
              <span className="text-xs sm:text-sm md:text-base font-bold text-foreground">{stats.totalLogins.toLocaleString()}</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20, z: -20 }}
              animate={{ opacity: 1, x: 0, z: 0 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 100 }}
              className="glass-card px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center"
            >
              <span className="text-xs sm:text-sm md:text-base text-foreground/70">Engagement style</span>
              <span className="text-xs sm:text-sm md:text-base font-bold text-foreground capitalize">{stats.engagementLevel}</span>
            </motion.div>
          </div>
        </div>
      </SlideContainer>
    );
  }
);

PersonalitySlide.displayName = 'PersonalitySlide';
