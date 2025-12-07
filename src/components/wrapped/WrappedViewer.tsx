import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WrappedStats } from '@/types/instagram';
import { IntroSlide } from './slides/IntroSlide';
import { EngagementSlide } from './slides/EngagementSlide';
import { TopPeopleSlide } from './slides/TopPeopleSlide';
import { DMSlide } from './slides/DMSlide';
import { FollowersSlide } from './slides/FollowersSlide';
import { AlgorithmSlide } from './slides/AlgorithmSlide';
import { PersonalitySlide } from './slides/PersonalitySlide';
import { SummarySlide } from './slides/SummarySlide';
import { FinaleSlide } from './slides/FinaleSlide';
import { useToast } from '@/hooks/use-toast';
import { createShareableLink } from '@/utils/apiClient';
import { toPng, toJpeg } from 'html-to-image';

interface WrappedViewerProps {
  stats: WrappedStats;
  onReset?: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    rotateY: direction > 0 ? 10 : -10,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    rotateY: direction < 0 ? 10 : -10,
  }),
};

export const WrappedViewer = ({ stats, onReset }: WrappedViewerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();
  
  
  useEffect(() => {
    const createShare = async () => {
      try {
        const response = await createShareableLink(stats);
        setShareUrl(response.shareUrl);
      } catch (error) {
        console.error('Failed to create shareable link:', error);
      }
    };
    
    createShare();
  }, [stats]);
  
  const slides = [
    { component: IntroSlide, name: 'intro' },
    { component: EngagementSlide, name: 'engagement' },
    { component: TopPeopleSlide, name: 'top-people' },
    { component: DMSlide, name: 'dms' },
    { component: FollowersSlide, name: 'followers' },
    { component: AlgorithmSlide, name: 'algorithm' },
    { component: PersonalitySlide, name: 'personality' },
    { component: FinaleSlide, name: 'finale' },
    { component: SummarySlide, name: 'summary' },
  ];
  
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide, slides.length]);
  
  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);
  
  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);
  
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  }, [nextSlide, prevSlide]);
  
  const handleShare = async () => {
    try {
      if (!shareUrl) {
        toast({ 
          title: 'Share link not ready', 
          description: 'Please wait a moment and try again',
          variant: 'destructive'
        });
        return;
      }
      
      const shareText = `🎉 Check out my Instagram Wrapped ${stats.year}!\n\n` +
        `📊 My Year in Numbers:\n` +
        `❤️ ${stats.totalLikes.toLocaleString()} posts liked\n` +
        `💬 ${stats.totalMessages.toLocaleString()} messages sent\n` +
        `👥 ${stats.followers.toLocaleString()} followers\n` +
        `📸 ${(stats.postsViewed + stats.videosWatched).toLocaleString()} content viewed\n\n` +
        `View my full wrapped: ${shareUrl}`;
      
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${stats.profile?.fullName || stats.profile?.username || 'My'} Instagram Wrapped ${stats.year}`,
            text: shareText,
            url: shareUrl,
          });
          return;
        } catch (err) {
          
          console.log('Native sharing not available or cancelled');
        }
      }
      
      
      await navigator.clipboard.writeText(shareUrl);
      toast({ 
        title: 'Share link copied!', 
        description: 'Share this link with your friends to show them your wrapped',
        duration: 5000
      });
    } catch (error) {
      console.error('Share failed:', error);
      toast({ 
        title: 'Share failed', 
        description: 'Unable to share at this time',
        variant: 'destructive' 
      });
    }
  };
  
  const generateImageBlob = async (format: 'png' | 'jpeg' = 'jpeg'): Promise<Blob | null> => {
    try {
      
      const summarySlideIndex = slides.length - 1;
      const summarySlideEl = slideRefs.current[summarySlideIndex];
      
      if (!summarySlideEl) {
        return null;
      }
      
      
      const buttonsEl = summarySlideEl.querySelector('.download-buttons');
      if (buttonsEl) {
        (buttonsEl as HTMLElement).style.display = 'none';
      }
      
      
      const imageGenerator = format === 'jpeg' ? toJpeg : toPng;
      
      const dataUrl = await imageGenerator(summarySlideEl, {
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#0a0a0f',
        quality: 0.95,
        style: {
          borderRadius: '24px',
        }
      });
      
      
      if (buttonsEl) {
        (buttonsEl as HTMLElement).style.display = '';
      }
      
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      return blob;
    } catch (error) {
      console.error('Image generation failed:', error);
      return null;
    }
  };

  const handleDownloadImage = async () => {
    try {
      toast({ title: 'Generating image...', description: 'Please wait' });
      
      const blob = await generateImageBlob('jpeg');
      
      if (!blob) {
        toast({ 
          title: 'Not ready yet', 
          description: 'Please wait a moment and try again',
          variant: 'destructive'
        });
        return;
      }
      
      
      if (shareUrl) {
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch (clipboardError) {
          console.log('Failed to copy to clipboard:', clipboardError);
        }
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `instawrapped-${stats.year}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      
      const description = shareUrl
        ? '✨ The image includes a QR code! Anyone can scan it to view your full wrapped.\n\n🔗 Link also copied to clipboard for easy sharing!'
        : 'Open Instagram and add the downloaded image to your Story';
      
      toast({ 
        title: 'Image downloaded!', 
        description: description,
        duration: 7000
      });
    } catch (error) {
      console.error('Image download failed:', error);
      toast({ 
        title: 'Download failed', 
        description: 'Unable to download image at this time',
        variant: 'destructive' 
      });
    }
  };

  const handleShareInstagram = async () => {
    try {
      toast({ title: 'Generating image...', description: 'Creating your Instagram Story' });
      
      const blob = await generateImageBlob('jpeg');
      
      if (!blob) {
        toast({ 
          title: 'Not ready yet', 
          description: 'Please wait a moment and try again',
          variant: 'destructive'
        });
        return;
      }
      
      
      
      if (shareUrl) {
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch (clipboardError) {
          
        }
      }
      
      
      const file = new File([blob], `instawrapped-${stats.year}.jpg`, { type: 'image/jpeg' });
      
      
      
      const shareText = shareUrl 
        ? `🎉 My ${stats.year} Instagram Wrapped!\n\nScan the QR code or visit: ${shareUrl}\n\nGet yours at ig.indrajeeth.in ✨`
        : `Check out my Instagram Wrapped ${stats.year}! 📊✨\n\nCreate yours at ig.indrajeeth.in`;
      
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          
          const shareData: ShareData = {
            files: [file],
            title: `My ${stats.year} Instagram Wrapped`,
            text: shareText,
          };
          
          
          if (shareUrl) {
            shareData.url = shareUrl;
          }
          
          await navigator.share(shareData);
          
          toast({ 
            title: '✅ Ready to share!', 
            description: shareUrl 
              ? '🔗 Link copied! Paste it in Instagram Story or scan the QR code on the image'
              : 'Share to Instagram Story and let your followers see your wrapped!',
            duration: 6000
          });
          return;
        } catch (err) {
          
          if (err instanceof Error && err.name === 'AbortError') {
            return;
          }
          console.log('Sharing cancelled or failed:', err);
        }
      }
      
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `instawrapped-${stats.year}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      
      const downloadMessage = shareUrl 
        ? '📱 Image downloaded!\n\n🔗 Link copied to clipboard!\n\nOpen Instagram Story:\n1. Upload the image\n2. Add link sticker\n3. Paste the link\n\nOr let others scan the QR code!' 
        : '📱 Image downloaded! Open Instagram and add it to your Story';
      
      toast({ 
        title: shareUrl ? '✅ Ready for Instagram!' : 'Image downloaded!', 
        description: downloadMessage,
        duration: 10000
      });
    } catch (error) {
      console.error('Instagram share failed:', error);
      toast({ 
        title: 'Share failed', 
        description: 'Unable to share to Instagram at this time',
        variant: 'destructive' 
      });
    }
  };
  
  const CurrentSlide = slides[currentSlide].component;
  const isFinale = currentSlide === slides.length - 1;
  
  return (
    <div 
      className="relative w-full max-w-[95vw] sm:max-w-md mx-auto px-2 sm:px-0"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    >
      <div 
        className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl" 
        style={{ 
          aspectRatio: '9/16',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 10px 25px rgba(0, 0, 0, 0.3)',
          transformStyle: 'preserve-3d'
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              type: 'spring', 
              stiffness: 350, 
              damping: 32,
              mass: 0.7,
            }}
            className="absolute inset-0"
            onClick={nextSlide}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {slides[currentSlide].name === 'summary' ? (
              <SummarySlide 
                ref={(el) => { slideRefs.current[currentSlide] = el; }}
                stats={stats}
                onDownloadImage={handleDownloadImage}
                onShare={handleShare}
                onShareInstagram={handleShareInstagram}
                shareUrl={shareUrl}
              />
            ) : (
              <CurrentSlide 
                ref={(el) => { slideRefs.current[currentSlide] = el; }}
                stats={stats} 
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Arrows */}
        {currentSlide > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center text-foreground/80 hover:bg-background/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {currentSlide < slides.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center text-foreground/80 hover:bg-background/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-primary w-6' 
                : 'bg-muted hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
      
      {/* Reset Button */}
      {onReset && (
        <button
          onClick={onReset}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto block"
        >
          Upload different data
        </button>
      )}
    </div>
  );
};
