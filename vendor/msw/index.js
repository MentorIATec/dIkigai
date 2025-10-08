function setupWorker(...handlers) {
  return {
    handlers,
    async start() {
      console.info('[MSW stub] start called');
    },
  };
}

function http() {
  return () => {};
}

const HttpResponse = {
  json(payload, init = {}) {
    return { payload, init };
  },
};

module.exports = {
  setupWorker,
  http,
  HttpResponse,
};
