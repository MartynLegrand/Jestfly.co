
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { fetchStreamById } from '@/lib/streaming';
import { LiveStream as LiveStreamType } from '@/types';
import StreamPlayer from '@/components/streaming/StreamPlayer';
import ChatInterface from '@/components/streaming/ChatInterface';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HeartIcon, Share2Icon, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import DonationPanel from '@/components/streaming/DonationPanel';

const LiveStreamPage = () => {
  const { id } = useParams<{ id: string }>();
  const [stream, setStream] = useState<LiveStreamType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadStream = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const streamData = await fetchStreamById(id);
        if (!streamData) {
          setError('Stream não encontrada');
        } else {
          setStream(streamData);
          document.title = `${streamData.title} - JestFly Streaming`;
        }
      } catch (err) {
        console.error('Erro ao carregar stream:', err);
        setError('Não foi possível carregar a transmissão');
      } finally {
        setIsLoading(false);
      }
    };

    loadStream();
  }, [id]);

  // Para layouts responsivos em dispositivos móveis
  useEffect(() => {
    const handleResize = () => {
      setIsChatCollapsed(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleShareStream = () => {
    if (navigator.share) {
      navigator.share({
        title: stream?.title || 'JestFly Streaming',
        text: stream?.description || 'Assista esta transmissão ao vivo no JestFly',
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

  if (isLoading) {
    return (
      <MainLayout fullWidth>
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-3/4">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center space-x-2 mt-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/4 h-[600px]">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !stream) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Transmissão não encontrada</h2>
          <p className="text-muted-foreground mb-6">{error || 'Esta transmissão não existe ou foi removida'}</p>
          <Button onClick={() => window.history.back()}>Voltar</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout fullWidth>
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-3/4 flex flex-col">
            <StreamPlayer 
              stream={stream}
              className="aspect-video w-full rounded-lg"
            />
            
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{stream.title}</h1>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant={stream.status === 'live' ? 'destructive' : 'secondary'}>
                  {stream.status === 'live' ? 'AO VIVO' : 'OFFLINE'}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {stream.viewer_count.toLocaleString()} espectadores
                </span>
                <Badge variant="outline" className="ml-auto">
                  {stream.stream_type === 'live' ? 'Transmissão ao vivo' : 'Premiere'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mt-6 border-t border-b border-border py-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    {stream.channel?.avatar_url ? (
                      <AvatarImage 
                        src={stream.channel.avatar_url} 
                        alt={stream.channel?.name || ''} 
                      />
                    ) : (
                      <AvatarFallback>
                        {stream.channel?.name.substring(0, 2).toUpperCase() || ''}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold">{stream.channel?.name}</h3>
                      {stream.channel?.is_verified && (
                        <span className="ml-1 text-blue-500">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stream.channel?.follower_count.toLocaleString()} seguidores
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleShareStream}>
                    <Share2Icon className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button variant="default" size="sm">
                    <HeartIcon className="h-4 w-4 mr-2" />
                    Seguir
                  </Button>
                </div>
              </div>
              
              {stream.description && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Sobre esta transmissão</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {stream.description}
                  </p>
                </div>
              )}

              {user && (
                <DonationPanel 
                  streamId={stream.id} 
                  channelName={stream.channel?.name || ''} 
                  className="mt-6 mb-4"
                />
              )}
            </div>
          </div>
          
          <div className="w-full md:w-1/4 h-[600px]">
            <ChatInterface 
              streamId={stream.id}
              className="h-full"
              collapsed={isChatCollapsed}
              onToggleCollapse={() => setIsChatCollapsed(!isChatCollapsed)}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LiveStreamPage;
