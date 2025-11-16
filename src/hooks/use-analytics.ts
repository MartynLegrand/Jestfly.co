
/**
 * Custom hook for tracking page views in the application.
 * Automatically tracks page views when route changes occur.
 * 
 * @example
 * // In your component:
 * const App = () => {
 *   usePageViewTracking();
 *   return <div>Your app content</div>;
 * };
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics/eventTracking';

export const usePageViewTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackEvent('page_view', {
      path: location.pathname,
      referrer: document.referrer,
      query: location.search
    }, location.pathname);
  }, [location.pathname, location.search]);
};

export default usePageViewTracking;
