const SIGNALS = ['SIGINT', 'SIGTERM'];

const setupExitSignals = (serverData = {}) => {
  SIGNALS.forEach(signal => {
    process.on(signal, () => {
      if (serverData.server) {
        // eslint-disable-next-line no-process-exit
        serverData.server.close(() => process.exit());
      } else {
        // eslint-disable-next-line no-process-exit
        process.exit();
      }
    });
  });
};

export { setupExitSignals };
