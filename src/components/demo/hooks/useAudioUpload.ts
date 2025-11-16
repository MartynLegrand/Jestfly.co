
import { useState } from 'react';
import { uploadDemoAudio } from '@/lib/demo/storageService';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook for handling multiple audio file uploads
 */
export const useAudioUpload = (userId?: string) => {
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [audioPreviews, setAudioPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  /**
   * Add audio files to the queue
   */
  const addAudioFiles = (files: File[]) => {
    const newFiles = [...files];
    setAudioFiles(prev => [...prev, ...newFiles]);
    
    // Create audio previews for each file
    newFiles.forEach(file => {
      const objectUrl = URL.createObjectURL(file);
      setAudioPreviews(prev => [...prev, objectUrl]);
      // Initialize progress for this file
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }));
    });
  };
  
  /**
   * Remove an audio file from the queue
   */
  const removeAudioFile = (index: number) => {
    setAudioFiles(prev => {
      const newFiles = [...prev];
      // Get the file that's being removed
      const removedFile = newFiles[index];
      
      // Remove the file from the array
      newFiles.splice(index, 1);
      
      // Also remove the preview and progress
      setAudioPreviews(prev => {
        const newPreviews = [...prev];
        newPreviews.splice(index, 1);
        // Revoke object URL to avoid memory leaks
        URL.revokeObjectURL(prev[index]);
        return newPreviews;
      });
      
      // Remove progress tracking for this file
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[removedFile.name];
        return newProgress;
      });
      
      return newFiles;
    });
  };
  
  /**
   * Clear all audio files
   */
  const clearAudioFiles = () => {
    // Revoke all object URLs to avoid memory leaks
    audioPreviews.forEach(preview => URL.revokeObjectURL(preview));
    setAudioFiles([]);
    setAudioPreviews([]);
    setUploadProgress({});
  };
  
  /**
   * Upload all audio files to storage and get the URLs
   */
  const uploadAudios = async (): Promise<string[]> => {
    if (audioFiles.length === 0 || !userId) {
      toast({
        title: 'Erro no upload',
        description: 'Nenhum arquivo selecionado ou usuário não autenticado',
        variant: 'destructive',
      });
      return [];
    }
    
    setIsUploading(true);
    
    try {
      const uploadPromises = audioFiles.map(async (file, index) => {
        // Setup a simulated progress tracker for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[file.name] || 0;
            const newProgress = currentProgress + Math.random() * 15;
            return {
              ...prev,
              [file.name]: newProgress > 95 ? 95 : newProgress
            };
          });
        }, 300);
        
        // Actual upload occurs here
        const url = await uploadDemoAudio(file, userId);
        
        // Clear interval and set to 100%
        clearInterval(progressInterval);
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 100
        }));
        
        return url;
      });
      
      const urls = await Promise.all(uploadPromises);
      
      toast({
        title: 'Upload concluído',
        description: urls.length > 1 
          ? `${urls.length} arquivos de áudio foram enviados com sucesso` 
          : 'Seu arquivo de áudio foi enviado com sucesso',
      });
      
      return urls;
    } catch (error) {
      console.error('Error uploading audio:', error);
      
      toast({
        title: 'Erro no upload',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao enviar os arquivos',
        variant: 'destructive',
      });
      
      return [];
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    audioFiles,
    addAudioFiles,
    removeAudioFile,
    clearAudioFiles,
    audioPreviews,
    uploadProgress,
    uploadAudios,
    isUploading
  };
};
