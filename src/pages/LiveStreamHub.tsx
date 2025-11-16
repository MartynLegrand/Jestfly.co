
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LiveStreamGrid from '@/components/streaming/LiveStreamGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchChannelByUserId, fetchScheduledStreams } from '@/lib/streaming';
import { useAuth } from '@/context/AuthContext';
import { LiveStream, StreamChannel } from '@/types';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Calendar, Video, History } from 'lucide-react';

const LiveStreamHub = () => {
  const { user } = useAuth();
  const [userChannel, setUserChannel] = useState<StreamChannel | null>(null);
  const [scheduledStreams, setScheduledStreams] = useState<LiveStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carregar canal do usuário se estiver logado
        if (user) {
          const channel = await fetchChannelByUserId(user.id);
          setUserChannel(channel);
        }
        
        // Carregar streams programadas
        const scheduled = await fetchScheduledStreams(5);
        setScheduledStreams(scheduled);
      } catch (error) {
        console.error('Error loading hub data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">JestFly Streaming</h1>
            <p className="text-muted-foreground mt-1">
              Assista a performances ao vivo e interaja com artistas da comunidade
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar canais ou streams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {user && !userChannel && (
              <Button asChild>
                <Link to="/live-stream/create-channel">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Criar Canal
                </Link>
              </Button>
            )}
            
            {user && userChannel && (
              <Button asChild>
                <Link to="/live-stream/studio">
                  <Video className="h-4 w-4 mr-2" />
                  Studio
                </Link>
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="live">
          <TabsList className="mb-4">
            <TabsTrigger value="live">Ao Vivo</TabsTrigger>
            <TabsTrigger value="scheduled">Programados</TabsTrigger>
            <TabsTrigger value="channels">Canais</TabsTrigger>
            <TabsTrigger value="following">Seguindo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="live" className="space-y-6">
            <h2 className="text-2xl font-semibold">Transmissões ao Vivo</h2>
            <LiveStreamGrid limit={12} />
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Transmissões Programadas</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/live-stream/schedule">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver Calendário
                </Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4 animate-pulse">
                    <div className="h-5 w-2/3 bg-muted rounded mb-2" />
                    <div className="h-4 w-1/3 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : scheduledStreams.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Nenhuma transmissão programada</h3>
                <p className="text-muted-foreground">
                  As transmissões programadas aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledStreams.map((stream) => (
                  <Link 
                    key={stream.id}
                    to={`/live-stream/${stream.id}`}
                    className="flex items-center p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    {stream.thumbnail_url ? (
                      <img 
                        src={stream.thumbnail_url} 
                        alt={stream.title}
                        className="w-24 h-16 object-cover rounded mr-4"
                      />
                    ) : (
                      <div className="w-24 h-16 bg-muted rounded flex items-center justify-center mr-4">
                        <Calendar className="h-6 w-6" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stream.channel?.name} • {new Date(stream.scheduled_start!).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="channels" className="space-y-6">
            <h2 className="text-2xl font-semibold">Canais Populares</h2>
            <p className="text-center py-12 text-muted-foreground">
              Funcionalidade em desenvolvimento
            </p>
          </TabsContent>
          
          <TabsContent value="following" className="space-y-6">
            <h2 className="text-2xl font-semibold">Canais que Você Segue</h2>
            {!user ? (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium">Faça login para ver seus canais seguidos</h3>
                <Button className="mt-4" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">
                Você ainda não segue nenhum canal
              </p>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">VODs Recentes</h2>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Assista as transmissões que você perdeu
            </p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/live-stream/vod">
                <History className="h-4 w-4 mr-2" />
                Ver Todos
              </Link>
            </Button>
          </div>
          
          <div className="flex justify-center py-12 border rounded-lg">
            <div className="text-center max-w-md">
              <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">VODs em breve</h3>
              <p className="text-muted-foreground mt-2">
                As transmissões passadas ficarão disponíveis para assistir quando quiser
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LiveStreamHub;
