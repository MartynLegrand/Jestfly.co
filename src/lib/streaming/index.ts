
import { supabase } from "@/lib/supabase";
import { LiveStream, StreamChannel, StreamChatMessage, StreamDonation } from "@/types";

// Buscar canais
export const fetchStreamChannels = async (limit = 10, searchQuery = "") => {
  try {
    let query = supabase
      .from('stream_channels')
      .select('*')
      .order('follower_count', { ascending: false })
      .limit(limit);
    
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as StreamChannel[];
  } catch (error) {
    console.error('Error fetching stream channels:', error);
    return [];
  }
};

// Buscar canal por ID
export const fetchChannelById = async (channelId: string) => {
  try {
    const { data, error } = await supabase
      .from('stream_channels')
      .select('*')
      .eq('id', channelId)
      .single();
    
    if (error) throw error;
    return data as StreamChannel;
  } catch (error) {
    console.error('Error fetching channel:', error);
    return null;
  }
};

// Buscar canal pelo user ID
export const fetchChannelByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('stream_channels')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 é "no rows returned"
    return data as StreamChannel | null;
  } catch (error) {
    console.error('Error fetching channel by user ID:', error);
    return null;
  }
};

// Criar um canal
export const createStreamChannel = async (channelData: Partial<StreamChannel>) => {
  try {
    const { data, error } = await supabase
      .from('stream_channels')
      .insert([channelData])
      .select()
      .single();
    
    if (error) throw error;
    return data as StreamChannel;
  } catch (error) {
    console.error('Error creating stream channel:', error);
    throw error;
  }
};

// Atualizar um canal
export const updateStreamChannel = async (channelId: string, updates: Partial<StreamChannel>) => {
  try {
    const { data, error } = await supabase
      .from('stream_channels')
      .update(updates)
      .eq('id', channelId)
      .select()
      .single();
    
    if (error) throw error;
    return data as StreamChannel;
  } catch (error) {
    console.error('Error updating stream channel:', error);
    throw error;
  }
};

// Buscar streams ao vivo
export const fetchLiveStreams = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('live_streams')
      .select(`
        *,
        channel:channel_id(*)
      `)
      .eq('status', 'live')
      .order('viewer_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as LiveStream[];
  } catch (error) {
    console.error('Error fetching live streams:', error);
    return [];
  }
};

// Buscar streams programados
export const fetchScheduledStreams = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('live_streams')
      .select(`
        *,
        channel:channel_id(*)
      `)
      .eq('status', 'scheduled')
      .order('scheduled_start', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    return data as LiveStream[];
  } catch (error) {
    console.error('Error fetching scheduled streams:', error);
    return [];
  }
};

// Buscar stream por ID
export const fetchStreamById = async (streamId: string) => {
  try {
    const { data, error } = await supabase
      .from('live_streams')
      .select(`
        *,
        channel:channel_id(*)
      `)
      .eq('id', streamId)
      .single();
    
    if (error) throw error;
    return data as LiveStream;
  } catch (error) {
    console.error('Error fetching stream:', error);
    return null;
  }
};

// Criar uma stream
export const createLiveStream = async (streamData: Partial<LiveStream>) => {
  try {
    const { data, error } = await supabase
      .from('live_streams')
      .insert([streamData])
      .select()
      .single();
    
    if (error) throw error;
    return data as LiveStream;
  } catch (error) {
    console.error('Error creating live stream:', error);
    throw error;
  }
};

// Atualizar uma stream
export const updateLiveStream = async (streamId: string, updates: Partial<LiveStream>) => {
  try {
    const { data, error } = await supabase
      .from('live_streams')
      .update(updates)
      .eq('id', streamId)
      .select()
      .single();
    
    if (error) throw error;
    return data as LiveStream;
  } catch (error) {
    console.error('Error updating live stream:', error);
    throw error;
  }
};

// Iniciar uma stream
export const startStream = async (streamId: string) => {
  try {
    const { data, error } = await supabase
      .from('live_streams')
      .update({
        status: 'live',
        started_at: new Date().toISOString()
      })
      .eq('id', streamId)
      .select()
      .single();
    
    if (error) throw error;
    return data as LiveStream;
  } catch (error) {
    console.error('Error starting stream:', error);
    throw error;
  }
};

// Encerrar uma stream
export const endStream = async (streamId: string) => {
  try {
    const { data, error } = await supabase
      .from('live_streams')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString()
      })
      .eq('id', streamId)
      .select()
      .single();
    
    if (error) throw error;
    return data as LiveStream;
  } catch (error) {
    console.error('Error ending stream:', error);
    throw error;
  }
};

// Buscar mensagens de chat
export const fetchChatMessages = async (streamId: string, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('stream_chat_messages')
      .select(`
        *,
        author:user_id(username, display_name, avatar)
      `)
      .eq('stream_id', streamId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as StreamChatMessage[];
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
};

// Enviar mensagem de chat
export const sendChatMessage = async (message: Partial<StreamChatMessage>) => {
  try {
    const { data, error } = await supabase
      .from('stream_chat_messages')
      .insert([message])
      .select(`
        *,
        author:user_id(username, display_name, avatar)
      `)
      .single();
    
    if (error) throw error;
    return data as StreamChatMessage;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

// Inscrever-se para atualizações de chat em tempo real
export const subscribeToChatMessages = (streamId: string, callback: (message: StreamChatMessage) => void) => {
  const subscription = supabase
    .channel(`stream_chat_${streamId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'stream_chat_messages',
      filter: `stream_id=eq.${streamId}`
    }, (payload) => {
      callback(payload.new as StreamChatMessage);
    })
    .subscribe();
  
  return () => {
    supabase.removeChannel(subscription);
  };
};

// Fazer uma doação
export const makeStreamDonation = async (donation: {
  stream_id: string;
  donor_id: string;
  amount: number;
  message?: string;
}) => {
  try {
    const { data, error } = await supabase
      .rpc('process_stream_donation', {
        p_stream_id: donation.stream_id,
        p_donor_id: donation.donor_id,
        p_amount: donation.amount,
        p_message: donation.message || null
      });
    
    if (error) throw error;
    return data as { success: boolean; donation_id: string; transaction_id: string };
  } catch (error) {
    console.error('Error making donation:', error);
    throw error;
  }
};

// Buscar doações de uma stream
export const fetchStreamDonations = async (streamId: string, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('stream_donations')
      .select(`
        *,
        donor:donor_id(username, display_name, avatar)
      `)
      .eq('stream_id', streamId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as StreamDonation[];
  } catch (error) {
    console.error('Error fetching stream donations:', error);
    return [];
  }
};

// Inscrever-se para notificações de doação em tempo real
export const subscribeToStreamDonations = (streamId: string, callback: (donation: StreamDonation) => void) => {
  const subscription = supabase
    .channel(`stream_donations_${streamId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'stream_donations',
      filter: `stream_id=eq.${streamId}`
    }, (payload) => {
      callback(payload.new as StreamDonation);
    })
    .subscribe();
  
  return () => {
    supabase.removeChannel(subscription);
  };
};
