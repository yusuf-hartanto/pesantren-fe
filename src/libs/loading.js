let listeners = [];
let progressListeners = [];

let requestCount = 0;

export const loading = {
  subscribe(callback) {
    listeners.push(callback);

    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  },
  emit(value) {
    listeners.forEach(cb => cb(value));
  },
  start() {
    requestCount++;
    this.emit(true);
  },
  stop() {
    requestCount--;

    if (requestCount <= 0) {
      requestCount = 0;
      this.emit(false);
    }
  },
  onProgress(callback) {
    progressListeners.push(callback);

    return () => {
      progressListeners = progressListeners.filter(cb => cb !== callback);
    };
  },
  progress(value) {
    progressListeners.forEach(cb => cb(value));
  }
};
