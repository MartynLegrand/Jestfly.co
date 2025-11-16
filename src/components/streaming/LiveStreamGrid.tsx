
import React, { useState, useEffect } from 'react';
import { LiveStream } from '@/types';
import { fetchLiveStreams } from '@/lib/streaming';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye } from 'lucide-react';

interface LiveStreamGridProps {
  limit?: number;
}

const LiveStreamGrid = ({ limit = 8 }: LiveStreamGridProps) => {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadStreams = async () => {
      setIsLoading(true);
      try {
        const liveStreams = await fetchLiveStreams(limit);
        setStreams(liveStreams);
      } catch (error) {
        console.error('Error loading streams:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStreams();
  }, [limit]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(limit).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (streams.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Nenhuma transmissão ao vivo no momento</h3>
        <p className="text-muted-foreground">Volte mais tarde para ver as streams em andamento</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {streams.map((stream) => (
        <Link to={`/live-stream/${stream.id}`} key={stream.id}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-video bg-muted overflow-hidden">
              {stream.thumbnail_url ? (
                <img 
                  src={stream.thumbnail_url} 
                  alt={stream.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <span className="text-lg font-medium text-primary-foreground">
                    {stream.title.substring(0, 30)}
                    {stream.title.length > 30 ? '...' : ''}
                  </span>
                </div>
              )}
              
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-sm font-medium">
                AO VIVO
              </div>
              
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-sm flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {stream.viewer_count.toLocaleString()}
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-medium line-clamp-1">{stream.title}</h3>
              
              <div className="flex items-center mt-2 space-x-2">
                <Avatar className="h-7 w-7">
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
                  <p className="text-sm">
                    {stream.channel?.name || 'Canal'}
                    {stream.channel?.is_verified && (
                      <span className="ml-1 text-blue-500">✓</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stream.stream_type === 'live' ? 'Ao vivo' : 'Premiere'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default LiveStreamGrid;
