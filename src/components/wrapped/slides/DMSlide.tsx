import { motion } from 'framer-motion';
import { SlideContainer, AnimatedText, AnimatedNumber } from '../SlideContainer';
import type { WrappedStats } from '@/types/instagram';
import { forwardRef } from 'react';

interface DMSlideProps {
  stats: WrappedStats;
}

const PERSONALITY_CONFIG = {
  'night-owl': { emoji: '🦉', text: 'Night Owl' },
  'early-bird': { emoji: '🐦', text: 'Early Bird' },
  'afternoon-chatter': { emoji: '☀️', text: 'Afternoon Chatter' },
  'balanced': { emoji: '⚖️', text: 'All-Day Texter' },
} as const;

export const DMSlide = forwardRef<HTMLDivElement, DMSlideProps>(
  ({ stats }, ref) => {
    const personality = PERSONALITY_CONFIG[stats.chatPersonality] || PERSONALITY_CONFIG['balanced'];
    
    return (
      <SlideContainer ref={ref} gradient="secondary">
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-4 w-full">
          <AnimatedText delay={0.2}>
            <p className="text-sm sm:text-base md:text-lg text-foreground/70 font-medium">Your DM Energy</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground mt-2">
              Let's talk about<br />your conversations 💬
            </h2>
          </AnimatedText>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-sm mx-auto" style={{ transformStyle: 'preserve-3d' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, z: -20 }}
              animate={{ opacity: 1, scale: 1, z: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
              className="glass-card p-2 sm:p-4 space-y-1 sm:space-y-2"
            >
              <p className="text-2xl sm:text-3xl font-black text-wrapped-cyan">{stats.totalMessages.toLocaleString()}</p>
              <p className="text-[10px] sm:text-xs text-foreground/60">Messages Sent</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, z: -20 }}
              animate={{ opacity: 1, scale: 1, z: 0 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 100 }}
              className="glass-card p-2 sm:p-4 space-y-1 sm:space-y-2"
            >
              <p className="text-2xl sm:text-3xl font-black text-wrapped-pink">{stats.totalConversations}</p>
              <p className="text-[10px] sm:text-xs text-foreground/60">Conversations</p>
            </motion.div>
          </div>
          
          {stats.topDMContacts.length > 0 && (
            <AnimatedText delay={0.9}>
              <div className="glass-card px-3 sm:px-5 py-3 sm:py-4 w-full max-w-sm mx-auto">
                <p className="text-xs sm:text-sm text-foreground/60 mb-1 sm:mb-2">Most Messaged</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-foreground truncate">{stats.topDMContacts[0].account}</p>
                <p className="text-xs sm:text-sm text-foreground/50">{stats.topDMContacts[0].count.toLocaleString()} messages</p>
              </div>
            </AnimatedText>
          )}
          
          <AnimatedText delay={1.2}>
            <div className="inline-flex items-center gap-2 sm:gap-3 glass-card px-4 sm:px-6 py-3 sm:py-4">
              <span className="text-3xl sm:text-4xl">{personality.emoji}</span>
              <div className="text-left">
                <p className="text-xs sm:text-sm text-foreground/60">You're a</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-foreground">{personality.text}</p>
              </div>
            </div>
          </AnimatedText>
        </div>
      </SlideContainer>
    );
  }
);

DMSlide.displayName = 'DMSlide';
