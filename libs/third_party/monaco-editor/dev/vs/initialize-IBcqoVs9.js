define("vs/initialize-IBcqoVs9", ["exports", "./editorWorkerHost-DEXzajWn"], (function(exports, editorWorkerHost) {
  "use strict";
  let initialized$1 = false;
  function initialize$1(factory) {
    if (initialized$1) {
      throw new Error("WebWorker already initialized!");
    }
    initialized$1 = true;
    const webWorkerServer = new editorWorkerHost.WebWorkerServer((msg) => globalThis.postMessage(msg), (workerServer) => factory(workerServer));
    globalThis.onmessage = (e) => {
      webWorkerServer.onmessage(e.data);
    };
    return webWorkerServer;
  }
  function start(createClient) {
    let client;
    const webWorkerServer = initialize$1((workerServer) => {
      const editorWorkerHost$1 = editorWorkerHost.EditorWorkerHost.getChannel(workerServer);
      const host = new Proxy({}, {
        get(target, prop, receiver) {
          if (prop === "then") {
            return void 0;
          }
          if (typeof prop !== "string") {
            throw new Error(`Not supported`);
          }
          return (...args) => {
            return editorWorkerHost$1.$fhr(prop, args);
          };
        }
      });
      const ctx = {
        host,
        getMirrorModels: () => {
          return webWorkerServer.requestHandler.getModels();
        }
      };
      client = createClient(ctx);
      return new editorWorkerHost.EditorWorker(client);
    });
    return client;
  }
  let initialized = false;
  function isWorkerInitialized() {
    return initialized;
  }
  function initialize(callback) {
    initialized = true;
    self.onmessage = (m) => {
      start((ctx) => {
        return callback(ctx, m.data);
      });
    };
  }
  exports.initialize = initialize;
  exports.isWorkerInitialized = isWorkerInitialized;
  exports.start = start;
}));
