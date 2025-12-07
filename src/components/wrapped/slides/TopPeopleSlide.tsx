import { motion } from 'framer-motion';
import { SlideContainer, AnimatedText } from '../SlideContainer';
import type { WrappedStats } from '@/types/instagram';
import { forwardRef } from 'react';

interface TopPeopleSlideProps {
  stats: WrappedStats;
}

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'] as const;

export const TopPeopleSlide = forwardRef<HTMLDivElement, TopPeopleSlideProps>(
  ({ stats }, ref) => {
    const topPeople = stats.topEngagedAccounts.slice(0, 5);
    
    return (
      <SlideContainer ref={ref} gradient="aurora">
        <div className="text-center space-y-4 sm:space-y-6 px-2 sm:px-4 w-full">
          <AnimatedText delay={0.2}>
            <p className="text-sm sm:text-base md:text-lg text-foreground/70 font-medium">Your Top People</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mt-2">
              These accounts lived<br />rent-free in your feed
            </h2>
          </AnimatedText>
          
          <div className="space-y-2 sm:space-y-3 w-full max-w-sm mx-auto" style={{ transformStyle: 'preserve-3d' }}>
            {topPeople.map((person, index) => (
              <motion.div
                key={person.account}
                initial={{ opacity: 0, x: -30, scale: 0.9, z: -20 }}
                animate={{ opacity: 1, x: 0, scale: 1, z: 0 }}
                transition={{ delay: 0.5 + index * 0.15, type: 'spring', stiffness: 100 }}
                whileHover={{ scale: 1.02, z: 10 }}
                className="glass-card px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-4"
              >
                <span className="text-xl sm:text-2xl flex-shrink-0">{MEDALS[index]}</span>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-bold text-foreground truncate text-sm sm:text-base">@{person.account}</p>
                  <p className="text-[10px] sm:text-xs text-foreground/60">{person.count.toLocaleString()} interactions</p>
                </div>
                {index === 0 && (
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    className="text-xl"
                  >
                    👑
                  </motion.span>
                )}
              </motion.div>
            ))}
            
            {topPeople.length === 0 && (
              <AnimatedText delay={0.5}>
                <div className="glass-card px-6 py-8">
                  <p className="text-foreground/60">No interaction data found</p>
                </div>
              </AnimatedText>
            )}
          </div>
          
          {topPeople.length > 0 && (
            <AnimatedText delay={1.3}>
              <p className="text-sm text-foreground/50 italic">
                You really couldn't stop checking their posts 👀
              </p>
            </AnimatedText>
          )}
        </div>
      </SlideContainer>
    );
  }
);

TopPeopleSlide.displayName = 'TopPeopleSlide';
