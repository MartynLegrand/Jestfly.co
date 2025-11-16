
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { LiveStream } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, 
  Minimize, Settings, Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface StreamPlayerProps {
  stream: LiveStream;
  autoPlay?: boolean;
  className?: string;
  onError?: (error: any) => void;
}

const StreamPlayer = ({ 
  stream, 
  autoPlay = true, 
  className = '',
  onError 
}: StreamPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Inicializar o player de vídeo com HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playbackUrl = stream.playback_url;
    if (!playbackUrl) {
      setError('URL de reprodução não disponível');
      setIsLoading(false);
      if (onError) onError('Playback URL not available');
      return;
    }

    // Verificar se o navegador suporta HLS nativamente
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Navegadores Safari/iOS podem reproduzir HLS nativamente
      video.src = playbackUrl;
    } else if (Hls.isSupported()) {
      // Usar biblioteca HLS.js para navegadores que não suportam HLS nativamente
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      
      hls.loadSource(playbackUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch((e) => {
            console.error('Erro ao iniciar reprodução automática:', e);
            setIsPlaying(false);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              toast({
                title: "Erro de rede",
                description: "Ocorreu um problema de conexão. Tentando reconectar...",
                variant: "destructive"
              });
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              toast({
                title: "Erro de mídia",
                description: "Problema ao reproduzir o stream. Tentando recuperar...",
                variant: "destructive"
              });
              hls.recoverMediaError();
              break;
            default:
              setError('Erro ao reproduzir a transmissão');
              if (onError) onError(data);
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else {
      setError('Seu navegador não suporta a reprodução de streams HLS');
      setIsLoading(false);
      if (onError) onError('HLS not supported');
    }
  }, [stream.playback_url, autoPlay, onError, toast]);

  // Manipuladores de eventos para os controles
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(e => console.error('Erro ao reproduzir:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(e => {
        console.error('Erro ao entrar em tela cheia:', e);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const handleVideoLoadedData = () => {
    setIsLoading(false);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Erro de vídeo:', e);
    setIsLoading(false);
    setError('Erro ao carregar o stream');
    if (onError) onError(e);
  };

  const shareStream = () => {
    if (navigator.share) {
      navigator.share({
        title: stream.title,
        text: stream.description || `Assistir ${stream.title}`,
        url: window.location.href,
      })
      .catch(err => console.error('Erro ao compartilhar:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "O link da stream foi copiado para a área de transferência",
      });
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden rounded-lg bg-black ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="flex flex-col items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <p className="text-white mt-2">Carregando stream...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-center p-4">
            <p className="text-red-500 text-lg mb-2">{error}</p>
            <p className="text-muted-foreground mb-4">
              A transmissão pode estar offline ou indisponível no momento.
            </p>
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        autoPlay={autoPlay}
        muted={isMuted}
        onLoadedData={handleVideoLoadedData}
        onError={handleVideoError}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={togglePlay} 
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute} 
            className="text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          
          <div className="text-white text-sm ml-2">
            <span className="font-medium">{stream.title}</span>
            <div className="text-xs text-gray-300 flex items-center">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1" />
              {stream.viewer_count} espectadores
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={shareStream} 
            className="text-white hover:bg-white/20"
          >
            <Share2 size={20} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
          >
            <Settings size={20} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullScreen} 
            className="text-white hover:bg-white/20"
          >
            {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StreamPlayer;
