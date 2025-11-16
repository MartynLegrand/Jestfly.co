
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Music, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import UploadProgressIndicator from '../upload/UploadProgressIndicator';

interface AudioUploadProps {
  audioFiles: File[];
  onAddAudioFiles: (files: File[]) => void;
  onRemoveAudioFile: (index: number) => void;
  audioPreviews: string[];
  uploadProgress: Record<string, number>;
}

const AudioUpload: React.FC<AudioUploadProps> = ({
  audioFiles,
  onAddAudioFiles,
  onRemoveAudioFile,
  audioPreviews,
  uploadProgress,
}) => {
  const [dragActive, setDragActive] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter for audio files
    const audioFiles = acceptedFiles.filter(file => 
      file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav')
    );
    
    if (audioFiles.length === 0) {
      return;
    }
    
    onAddAudioFiles(audioFiles);
  }, [onAddAudioFiles]);
  
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.aac', '.flac'],
    },
    multiple: true,
  });
  
  // Format bytes to readable string
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  return (
    <div className="space-y-4">
      <div>
        <FormLabel>Arquivos de Áudio</FormLabel>
        <div
          {...getRootProps()}
          className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
        >
          <input {...getInputProps()} />
          <Music className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">
            Arraste seus arquivos de áudio aqui ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Formatos aceitos: MP3, WAV, OGG, AAC, FLAC (máx. 20MB por arquivo)
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={open}>
            <Upload className="h-4 w-4 mr-2" />
            Selecionar Arquivos
          </Button>
        </div>
      </div>
      
      {audioFiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Arquivos Selecionados ({audioFiles.length})</p>
          
          {audioFiles.map((file, index) => {
            // Get the progress value for this file, default to 0
            const progress = uploadProgress[file.name] || 0;
            // Determine the status
            let status: 'idle' | 'uploading' | 'success' | 'error' = 'idle';
            if (progress === 100) status = 'success';
            else if (progress > 0) status = 'uploading';
            
            return (
              <div key={index} className="relative">
                <UploadProgressIndicator
                  progress={progress}
                  status={status}
                  fileName={file.name}
                  fileSize={formatBytes(file.size)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => onRemoveAudioFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          
          {audioFiles.length < 5 && (
            <Button type="button" variant="outline" size="sm" onClick={open}>
              <Upload className="h-4 w-4 mr-2" />
              Adicionar mais arquivos
            </Button>
          )}
        </div>
      )}
      
      {audioPreviews.length > 0 && (
        <div className="space-y-3 mt-4">
          <p className="text-sm font-medium">Pré-visualização</p>
          {audioPreviews.map((preview, index) => (
            <div key={index} className="rounded-md border p-4">
              <audio 
                src={preview} 
                controls 
                className="w-full" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioUpload;
