import { motion } from 'framer-motion';
import { SlideContainer, AnimatedText } from '../SlideContainer';
import type { WrappedStats } from '@/types/instagram';
import { forwardRef } from 'react';

interface IntroSlideProps {
  stats: WrappedStats;
}

export const IntroSlide = forwardRef<HTMLDivElement, IntroSlideProps>(
  ({ stats }, ref) => {
    return (
      <SlideContainer ref={ref} gradient="primary">
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
          <AnimatedText delay={0.2}>
            <motion.div
              animate={{ 
                boxShadow: ['0 0 20px hsl(330 100% 60% / 0.3)', '0 0 60px hsl(330 100% 60% / 0.6)', '0 0 20px hsl(330 100% 60% / 0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 mx-auto rounded-full bg-gradient-warm flex items-center justify-center overflow-hidden"
            >
              {stats.profile?.profilePicture ? (
                <img 
                  src={stats.profile.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">📸</span>
              )}
            </motion.div>
          </AnimatedText>
          
          <AnimatedText delay={0.5} className="space-y-1 sm:space-y-2">
            <p className="text-sm sm:text-base md:text-lg text-foreground/70 font-medium">Hey there,</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground break-words px-2">
              {stats.profile?.fullName || stats.profile?.username || 'Instagram User'}
            </h1>
            {stats.profile?.username && (
              <p className="text-base text-foreground/50 font-medium">
                @{stats.profile.username}
              </p>
            )}
          </AnimatedText>
          
          <AnimatedText delay={0.8}>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 font-semibold">
              This is your
            </p>
          </AnimatedText>
          
          <AnimatedText delay={1.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gradient-warm px-2">
              Instagram Wrapped
            </h2>
          </AnimatedText>
          
          <AnimatedText delay={1.4}>
            <div className="inline-flex items-center gap-2 glass-card px-4 sm:px-6 py-2 sm:py-3">
              <span className="text-xl sm:text-2xl font-bold text-wrapped-cyan">{stats.year}</span>
              <span className="text-sm sm:text-base text-foreground/60">Edition</span>
            </div>
          </AnimatedText>
          
          <AnimatedText delay={1.8}>
            <motion.p 
              className="text-sm text-foreground/50"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Tap to continue →
            </motion.p>
          </AnimatedText>
        </div>
      </SlideContainer>
    );
  }
);

IntroSlide.displayName = 'IntroSlide';
