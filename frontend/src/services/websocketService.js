const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.organizationId = null;
    this.listeners = new Set();
    this.statusListeners = new Set();
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.manuallyClosed = false;
    this.status = 'disconnected';
  }

  connect(organizationId) {
    if (!organizationId) return;

    if (
      this.organizationId === organizationId &&
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.disconnect();
    this.organizationId = organizationId;
    this.manuallyClosed = false;
    this._open();
  }

  _open() {
    this._setStatus('connecting');
    const url = `${WS_BASE_URL}/ws/contracts/${encodeURIComponent(
      this.organizationId
    )}`;

    try {
      this.socket = new WebSocket(url);
    } catch {
      this._scheduleReconnect();
      return;
    }

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this._setStatus('connected');
    };

    this.socket.onmessage = (event) => {
      let payload;
      try {
        payload = JSON.parse(event.data);
      } catch {
        return;
      }
      this.listeners.forEach((listener) => listener(payload));
    };

    this.socket.onclose = () => {
      this._setStatus('disconnected');
      if (!this.manuallyClosed) {
        this._scheduleReconnect();
      }
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }

  _scheduleReconnect() {
    if (this.manuallyClosed || !this.organizationId) return;
    clearTimeout(this.reconnectTimer);
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 15000);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => this._open(), delay);
  }

  _setStatus(status) {
    this.status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }

  disconnect() {
    this.manuallyClosed = true;
    clearTimeout(this.reconnectTimer);
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.close();
      this.socket = null;
    }
    this._setStatus('disconnected');
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  
  subscribeToStatus(listener) {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }
}
const websocketService = new WebSocketService();

export default websocketService;
