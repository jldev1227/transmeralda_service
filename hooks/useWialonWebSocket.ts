// hooks/useWialonWebSocket.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface WialonWebSocketOptions {
  token: string;
  sessionId: string;
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

interface WialonWebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  lastMessage: any | null;
}

export const useWialonWebSocket = ({
  token,
  sessionId,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: WialonWebSocketOptions) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [state, setState] = useState<WialonWebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastMessage: null,
  });

  // Función para conectar WebSocket
  const connect = useCallback(async () => {
    if (!token || !sessionId || state.isConnecting) return;

    setState((prev) => ({ ...prev, isConnecting: true }));

    try {
      // Obtenemos los parámetros para la conexión WebSocket a través de nuestro proxy
      const prepareResponse = await axios.post("/api/wialon-socket", {
        action: "prepare",
        sid: sessionId,
      });

      const { wsUrl, subscriptionParams } = prepareResponse.data;

      // Creamos la conexión WebSocket
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }));

        // Enviamos los parámetros de suscripción
        ws.send(JSON.stringify(subscriptionParams));

        if (onConnect) onConnect();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          setState((prev) => ({ ...prev, lastMessage: data }));
          if (onMessage) onMessage(data);
        } catch (err) {
          console.error("Error al procesar mensaje WebSocket:", err);
        }
      };

      ws.onerror = (error) => {
        console.error("Error en WebSocket:", error);
        setState((prev) => ({
          ...prev,
          error: new Error("WebSocket connection error"),
          isConnecting: false,
        }));
        if (onError) onError(error);
      };

      ws.onclose = () => {
        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));
        if (onDisconnect) onDisconnect();
      };

      setSocket(ws);
    } catch (error) {
      console.error("Error al preparar conexión WebSocket:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error("Unknown error"),
        isConnecting: false,
      }));
      if (onError) onError(error);
    }
  }, [
    token,
    sessionId,
    state.isConnecting,
    onConnect,
    onMessage,
    onError,
    onDisconnect,
  ]);

  // Desconexión manual del WebSocket
  const disconnect = useCallback(() => {
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
      socket.close();
    }
  }, [socket]);

  // Conectamos automáticamente cuando tenemos sessionId
  useEffect(() => {
    if (sessionId && !socket && !state.isConnected && !state.isConnecting) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [
    sessionId,
    socket,
    state.isConnected,
    state.isConnecting,
    connect,
    disconnect,
  ]);

  // Reconexión automática
  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [disconnect, connect]);

  return {
    ...state,
    connect,
    disconnect,
    reconnect,
  };
};
