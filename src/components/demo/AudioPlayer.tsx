
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, artist, className = '' }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = volume;

    // Event listeners
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Effect for play/pause
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  // Effect for src changes
  useEffect(() => {
    if (audioRef.current) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [src]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleMute = () => {
    if (audioRef.current) {
      setIsMuted(!isMuted);
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const handleTimeChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  return (
    <div className={`bg-background border rounded-lg shadow-sm p-4 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {(title || artist) && (
        <div className="mb-3">
          {title && <h3 className="font-medium text-lg">{title}</h3>}
          {artist && <p className="text-muted-foreground text-sm">{artist}</p>}
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleSkipBack}
              title="Skip back 10 seconds"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10" 
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleSkipForward}
              title="Skip forward 10 seconds"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <div className="w-20">
              <Slider 
                value={[volume]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={handleVolumeChange} 
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <Slider 
            value={[currentTime]} 
            min={0} 
            max={duration || 100} 
            step={0.1} 
            disabled={duration === 0}
            onValueChange={handleTimeChange} 
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
