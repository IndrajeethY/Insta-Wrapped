import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUpload } from '@/components/wrapped/FileUpload';
import { WrappedViewer } from '@/components/wrapped/WrappedViewer';
import type { WrappedStats } from '@/types/instagram';

const Index = () => {
  const [wrappedStats, setWrappedStats] = useState<WrappedStats | null>(null);
  
  const handleReset = () => {
    setWrappedStats(null);
  };
  
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
          {wrappedStats ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <WrappedViewer stats={wrappedStats} onReset={handleReset} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FileUpload onComplete={setWrappedStats} />
            </motion.div>
          )}
        </main>
        
        <footer className="py-8 px-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>100% Private - Your data is processed entirely in your browser and never uploaded to any server</span>
          </div>
          <a 
            href="https://github.com/IndrajeethY/Insta-Wrapped" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>View on GitHub</span>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Index;
