import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import websocketService from '../services/websocketService';
import { useOrganization } from './OrganizationContext';
import { useNotification } from './NotificationContext';

const RealtimeContext = createContext(undefined);
export function RealtimeProvider({ children }) {
  const { organizationId } = useOrganization();
  const { notifyInfo } = useNotification();
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastEvent, setLastEvent] = useState(null);
  const listenersRef = useRef(new Set());

  useEffect(() => {
    if (!organizationId) {
      websocketService.disconnect();
      return undefined;
    }
    websocketService.connect(organizationId);
    return () => websocketService.disconnect();
  }, [organizationId]);

  useEffect(() => {
    const unsubscribeStatus = websocketService.subscribeToStatus(setConnectionStatus);
    const unsubscribeMessages = websocketService.subscribe((event) => {
      setLastEvent(event);
      listenersRef.current.forEach((listener) => listener(event));

      if (event.type === 'CONTRACT_STATUS_CHANGED') {
        notifyInfo(
          `Contract ${event.contract_id ?? ''} moved from ${event.previous_status} to ${event.new_status}`.trim()
        );
      } else if (event.type === 'CONTRACT_CREATED') {
        notifyInfo(`New contract created${event.client_name ? ` for ${event.client_name}` : ''}`);
      } else if (event.type === 'CONTRACT_DELETED') {
        notifyInfo(`Contract ${event.contract_id ?? ''} was deleted`.trim());
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeMessages();
    };
  }, [notifyInfo]);

  const subscribeToEvents = useMemo(
    () => (listener) => {
      listenersRef.current.add(listener);
      return () => listenersRef.current.delete(listener);
    },
    []
  );

  const value = useMemo(
    () => ({ connectionStatus, lastEvent, subscribeToEvents }),
    [connectionStatus, lastEvent, subscribeToEvents]
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}
