// hooks/useWialonRealtime.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

interface UseWialonRealtimeOptions {
  sessionId: string;
  pollInterval?: number;
  onUpdate?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useWialonRealtime = ({
  sessionId,
  pollInterval = 3000,
  onUpdate,
  onError
}: UseWialonRealtimeOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<any>(null);
  const [subscribeAttempts, setSubscribeAttempts] = useState(0);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Función para suscribirse a eventos
  const subscribe = useCallback(async () => {
    if (!sessionId) return false;
    
    try {
      // Limitar intentos de suscripción para evitar bucles infinitos
      if (subscribeAttempts > 2) {
        console.log('Demasiados intentos de suscripción, pausando...');
        setError(new Error('Múltiples intentos de suscripción fallidos. Posible problema con el token de sesión.'));
        return false;
      }
      
      setSubscribeAttempts(prev => prev + 1);
      console.log(`Intento de suscripción #${subscribeAttempts + 1}`);
      
      const response = await axios.post('/api/wialon-socket', {
        action: 'subscribe',
        sid: sessionId
      });
      
      if (response.data && !response.data.error) {
        setIsConnected(true);
        setError(null);
        return true;
      } else {
        // Si el error es 2, el token de sesión no es válido
        if (response.data && response.data.error === 2) {
          throw new Error('Token de sesión inválido o expirado (ACCESS_DENIED)');
        }
        throw new Error(response.data?.error 
          ? `Error de Wialon: ${response.data.error}` 
          : 'Fallo en la suscripción');
      }
    } catch (err) {
      console.error('Error subscribing to events:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido en la suscripción'));
      setIsConnected(false);
      if (onError) onError(err);
      return false;
    }
  }, [sessionId, onError, subscribeAttempts]);

  // Función para poll de actualizaciones
  const pollUpdates = useCallback(async () => {
    if (!sessionId || !isConnected || isPolling) return;
    
    setIsPolling(true);
    
    try {
      const response = await axios.post('/api/wialon-socket', {
        action: 'poll',
        sid: sessionId
      });
      
      if (response.data) {
        // Si la respuesta contiene un error, puede ser que la sesión expiró
        if (response.data.error) {
          if (response.data.error === 2) {
            throw new Error('Token de sesión inválido o expirado durante el polling');
          }
          throw new Error(`Error en polling: ${response.data.error}`);
        }
        
        setLastUpdate(response.data);
        if (onUpdate) onUpdate(response.data);
      }
    } catch (err) {
      console.error('Error polling updates:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido en polling'));
      setIsConnected(false);
      if (onError) onError(err);
    } finally {
      setIsPolling(false);
      
      // Programar el siguiente poll solo si estamos conectados y montados
      if (mountedRef.current && isConnected) {
        timeoutRef.current = setTimeout(pollUpdates, pollInterval);
      }
    }
  }, [sessionId, isConnected, isPolling, pollInterval, onUpdate, onError]);

  // Iniciar la suscripción solo una vez al montar y cuando cambia sessionId
  useEffect(() => {
    mountedRef.current = true;
    
    const initialize = async () => {
      if (sessionId && mountedRef.current) {
        const subscribed = await subscribe();
        if (subscribed && mountedRef.current) {
          pollUpdates();
        }
      }
    };
    
    if (sessionId) {
      setSubscribeAttempts(0); // Reset intentos al cambiar el token
      initialize();
    }
    
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [sessionId]);

  const reconnect = useCallback(async () => {
    setIsConnected(false);
    setSubscribeAttempts(0);
    setError(null);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    const subscribed = await subscribe();
    if (subscribed) {
      pollUpdates();
    }
  }, [subscribe, pollUpdates]);

  return {
    isConnected,
    isPolling,
    error,
    lastUpdate,
    reconnect,
    subscribeAttempts
  };
};