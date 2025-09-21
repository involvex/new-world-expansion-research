import { defineConfig } from "vitest/config";
import "vitest-preview"; // Correctly import the vitest-preview plugin
import { vitest } from "vitest";
import { preview } from "vite";

export default defineConfig({
  test: {
    environment: "jsdom",
    css: true,
    globals: true,
    setupFiles: "./src/__tests__/example.test.tsx", // Correct path to your setup file
  },
  plugins: [
    // Use 'plugins' array for plugins
    {
      // Correctly define the plugin as an object literal
      name: "vitest-preview",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/preview") {
            preview({ preview: { port: 5173 } })
              .then((server) => {
                server.httpServer?.once("listening", () => {
                  res.statusCode = 200;
                  res.end("Preview server started");
                });
              })
              .catch((err) => {
                res.statusCode = 500;
                res.end(`Error starting preview server: ${err.message}`);
              });
          } else {
            next();
          }
        });
      },
    },
    // Call the imported plugin function
  ],
});
