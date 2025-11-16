
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileAudio, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioUploadProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioPreview: string | null;
  setAudioPreview: (preview: string | null) => void;
}

const AudioUpload: React.FC<AudioUploadProps> = ({
  audioFile,
  setAudioFile,
  audioPreview,
  setAudioPreview
}) => {
  const { toast } = useToast();

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Formato inválido',
        description: 'Por favor, envie arquivos nos formatos MP3, WAV ou OGG.',
        variant: 'destructive',
      });
      return;
    }
    
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'Arquivo muito grande',
        description: 'Por favor, envie arquivos com até 20MB.',
        variant: 'destructive',
      });
      return;
    }
    
    setAudioFile(file);
    setAudioPreview(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-2">
      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-muted/50">
        {!audioFile ? (
          <>
            <FileAudio className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Arraste e solte seu arquivo aqui ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              MP3, WAV ou OGG (Máx. 20MB)
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('audio-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" /> Selecionar Arquivo
            </Button>
          </>
        ) : (
          <>
            <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-sm font-medium mb-1">{audioFile.name}</p>
            <p className="text-xs text-muted-foreground mb-4">
              {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            {audioPreview && (
              <audio controls className="w-full max-w-md mt-2 mb-4">
                <source src={audioPreview} type={audioFile.type} />
                Seu navegador não suporta o elemento de áudio.
              </audio>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setAudioFile(null);
                setAudioPreview(null);
              }}
            >
              Remover
            </Button>
          </>
        )}
        <input
          id="audio-upload"
          type="file"
          accept="audio/mpeg,audio/wav,audio/ogg,audio/mp3"
          className="hidden"
          onChange={handleAudioChange}
        />
      </div>
    </div>
  );
};

export default AudioUpload;
