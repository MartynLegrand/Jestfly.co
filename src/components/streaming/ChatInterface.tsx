
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  fetchChatMessages, 
  sendChatMessage, 
  subscribeToChatMessages 
} from '@/lib/streaming';
import { StreamChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, AlertTriangle, X } from 'lucide-react';

interface ChatInterfaceProps {
  streamId: string;
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ChatInterface = ({ 
  streamId, 
  className = '',
  collapsed = false,
  onToggleCollapse 
}: ChatInterfaceProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<StreamChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Carregar mensagens iniciais
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const chatMessages = await fetchChatMessages(streamId);
        // Inverter ordem, pois recebemos as mais recentes primeiro
        setMessages(chatMessages.reverse());
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
        setError('Não foi possível carregar o chat');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [streamId]);

  // Inscrever para novas mensagens em tempo real
  useEffect(() => {
    const unsubscribe = subscribeToChatMessages(streamId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      
      // Atualizar autoscroll apenas se o usuário está próximo do final
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setAutoScroll(isNearBottom);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [streamId]);

  // Auto-scrolling para novas mensagens
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;
    
    try {
      await sendChatMessage({
        stream_id: streamId,
        user_id: user.id,
        message: newMessage.trim(),
        is_highlighted: false,
        is_deleted: false
      });
      
      setNewMessage('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (collapsed) {
    return (
      <div className={`fixed bottom-4 right-4 ${className}`}>
        <Button onClick={onToggleCollapse} className="rounded-full w-12 h-12 shadow-lg">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-background border border-border rounded-lg ${className}`}>
      <div className="p-3 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold">Chat ao vivo</h3>
        {onToggleCollapse && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleCollapse} 
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2"
        onScroll={() => {
          if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            setAutoScroll(scrollHeight - scrollTop - clientHeight < 100);
          }
        }}
      >
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-start space-x-2 py-1">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
            <p className="text-muted-foreground">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Recarregar
            </Button>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma mensagem ainda. Seja o primeiro a comentar!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start space-x-2 py-1 ${
                msg.is_highlighted ? 'bg-primary/10 rounded px-2 -mx-2' : ''
              }`}
            >
              <Avatar className="h-8 w-8">
                {msg.author?.avatar_url ? (
                  <AvatarImage src={msg.author.avatar_url} alt={msg.author?.display_name || 'User'} />
                ) : (
                  <AvatarFallback>
                    {getInitials(msg.author?.display_name || 'U')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-sm">
                    {msg.author?.display_name || 'Usuário'}
                  </span>
                  {msg.author?.is_mod && (
                    <span className="bg-blue-500 text-white text-xs px-1 rounded">MOD</span>
                  )}
                </div>
                <p className="text-sm break-words">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {user ? (
        <form onSubmit={handleSubmit} className="p-3 border-t border-border">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enviar mensagem..."
              className="flex-1"
              maxLength={200}
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-3 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Faça login para participar do chat
          </p>
          <Button variant="outline" size="sm">
            Entrar
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
