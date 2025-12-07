import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileArchive, AlertCircle, Loader2 } from 'lucide-react';
import { parseInstagramExport, computeWrappedStats } from '@/utils/instagramParser';
import type { WrappedStats } from '@/types/instagram';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onComplete: (stats: WrappedStats) => void;
}

export const FileUpload = ({ onComplete }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  
  const year = '2025';
  
  const handleProgress = useCallback((prog: number, stat: string) => {
    setProgress(prog);
    setStatus(stat);
  }, []);
  
  const processFile = async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      setError('Please upload a ZIP file from your Instagram data export');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const parsedData = await parseInstagramExport(file, parseInt(year), handleProgress);
      
      
      const stats = await computeWrappedStats(parsedData, parseInt(year));
      
      toast({ 
        title: 'Data processed!', 
        description: 'Your wrapped is ready to view' 
      });
      
      onComplete(stats);
    } catch (err) {
      console.error('Parse error:', err);
      setError('Failed to parse your Instagram data. Make sure you uploaded the correct ZIP file.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };
  
  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Upload Zone */}
      <motion.div
        className={`upload-zone relative cursor-pointer ${isDragging ? 'border-primary scale-[1.02] glow-pink' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
      >
        <input
          type="file"
          accept=".zip"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-4"
            >
              <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">{status}</p>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{progress}% complete</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-4"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center">
                <FileArchive className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-foreground">
                  Drop your Instagram export here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse • ZIP files only
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Instructions */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-bold text-foreground">How to get your Instagram data:</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary font-bold">1.</span>
            <span>
              Go to{' '}
              <a 
                href="https://accountscenter.instagram.com/info_and_permissions/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline font-medium"
              >
                Instagram Settings → Info and Permissions
              </a>
              {' '}→ Download Your Information
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">2.</span>
            Request your data in <span className="text-foreground font-medium">JSON format</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">3.</span>
            Wait for Instagram to email you the download link
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">4.</span>
            Download the ZIP file and upload it here
          </li>
        </ol>
        <p className="text-xs text-muted-foreground/70 pt-2 border-t border-border">
          🔒 Your data is processed locally in your browser and never uploaded to any server.
        </p>
      </div>
    </div>
  );
};
