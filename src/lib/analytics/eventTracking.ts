
import { supabase } from '@/lib/supabase/client';
import { EventType } from './types';

/**
 * Track an analytics event
 */
export const trackEvent = async (
  eventType: EventType,
  metadata: Record<string, any> = {},
  path?: string
) => {
  try {
    const sessionId = localStorage.getItem('analytics_session_id') || 
      crypto.randomUUID();
    
    // Store session ID for later use
    if (!localStorage.getItem('analytics_session_id')) {
      localStorage.setItem('analytics_session_id', sessionId);
    }
    
    // Collect basic client info
    const clientInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    
    // Track the event in Supabase
    const { error } = await supabase.rpc('track_analytics_event', {
      p_event_type: eventType,
      p_metadata: metadata,
      p_session_id: sessionId,
      p_path: path || window.location.pathname,
      p_client_info: clientInfo
    });
    
    if (error) {
      console.error('Error tracking event:', error);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};
