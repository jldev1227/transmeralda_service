// src/services/socketService.ts
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000; // 2 segundos iniciales
  private reconnectTimer: NodeJS.Timeout | null = null;
  private userId: string | null = null;

  // Método para obtener la URL del socket con el protocolo correcto
  private getSocketUrl(): string {
    let url = process.env.NEXT_PUBLIC_API_URL || "https://api.transmeralda.com";

    return url;
  }

  // Método para conectar con el socket
  connect(userId: string): void {
    if (this.socket && this.socket.connected) {
      return;
    }

    // Guardar el userId para intentos de reconexión
    this.userId = userId;

    // Configuración para la conexión
    const socketUrl = this.getSocketUrl();

    try {
      this.socket = io(socketUrl, {
        path: "/socket.io/",
        transports: ["polling"], // Usar solo polling para evitar problemas con WebSockets
        timeout: 20000,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        forceNew: true,
        query: { userId },
        withCredentials: true,
      });

      // Manejadores de eventos de conexión
      this.socket.on("connect", this.handleConnect);
      this.socket.on("connect_error", this.handleConnectError);
      this.socket.on("disconnect", this.handleDisconnect);
      this.socket.on("error", this.handleError);
    } catch (error: any) {
      console.error("Error al crear conexión Socket.IO:", error);
    }
  }

  // Manejador de conexión exitosa
  private handleConnect = () => {
    this.reconnectAttempts = 0; // Resetear conteo de intentos al conectar
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  };

  // Manejador de error de conexión
  private handleConnectError = (error: any) => {
    console.error("Error de conexión Socket.IO:", error);

    // Intentar reconectar con estrategia diferente
    this.disconnect();
    this.attemptReconnect();
  };

  // Manejador de desconexión
  private handleDisconnect = (reason: string) => {
    // Intentar reconectar si la desconexión no fue intencional
    if (reason !== "io client disconnect" && this.userId) {
      this.attemptReconnect();
    }
  };

  // Manejador de errores generales
  private handleError = (error: any) => {
    console.error("Error en Socket.IO:", error);
  };

  // Lógica de reconexión manual
  private attemptReconnect = () => {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId) {
      this.reconnectAttempts++;

      // Calcular retraso exponencial
      const delay =
        this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);

      this.reconnectTimer = setTimeout(() => {
        if (this.userId) {
          // En el último intento, probar con URL alternativa
          if (this.reconnectAttempts === this.maxReconnectAttempts) {
            // Usar la misma URL pero con configuración diferente
            this.socket = io(this.getSocketUrl(), {
              path: "/socket.io/",
              transports: ["polling"], // Intentar polling como último recurso
              timeout: 15000,
              forceNew: true,
              query: { userId: this.userId },
              withCredentials: true,
            });

            // Reconectar manejadores
            this.socket.on("connect", this.handleConnect);
            this.socket.on("connect_error", this.handleConnectError);
            this.socket.on("disconnect", this.handleDisconnect);
            this.socket.on("error", this.handleError);
          } else {
            // Intentar de nuevo con la configuración normal
            this.connect(this.userId);
          }
        }
      }, delay);
    } else {
      console.error("No se pudo establecer la conexión en tiempo real");
    }
  };

  // Enviar evento al servidor
  emit(event: string, data: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`No se pudo emitir evento '${event}': Socket no conectado`);
    }
  }

  // Escuchar evento del servidor
  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn(
        `No se pudo registrar escucha para '${event}': Socket no inicializado`,
      );
    }
  }

  // Dejar de escuchar evento
  off(event?: string): void {
    if (this.socket) {
      if (event) {
        this.socket.off(event);
      } else {
        this.socket.removeAllListeners();
      }
    }
  }

  // Desconectar socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Limpiar el timer de reconexión si existe
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.userId = null;
    this.reconnectAttempts = 0;
  }

  // Verificar estado de conexión
  isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }
}

// Exportar una instancia singleton
const socketService = new SocketService();

export default socketService;
