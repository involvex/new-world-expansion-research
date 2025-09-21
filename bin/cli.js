#!/usr/bin/env node

import { existsSync } from "fs";
import { execSync, fork } from "child_process";
import { createServer } from "http";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const distDir = join(projectRoot, "docs");

let runningSpinner; // Declare runningSpinner in a higher scope

console.log("   Thank your for using Aeternum Research Tool! \n");
console.log(
  "   Check out the Repository:\n🛜 https://github.com/involvex/new-world-expansion-research \n",
);

if (!process.env.VITEST) {
  const startupSpinner = ora(" Starting Aeternum Research Tool...").start();

  // Check if dist directory exists, if not, build the project
  if (!existsSync(distDir)) {
    startupSpinner.text = " Building project...";
    try {
      execSync("npm run build", {
        cwd: projectRoot,
        stdio: "inherit",
      });
      startupSpinner.succeed(" Build completed!");
    } catch (error) {
      startupSpinner.fail(`Build failed: ${error.message}`);
      process.exit(1);
    }
  } else {
    startupSpinner.info(" Using existing build.");
  }

  // Start the backend API server
  startupSpinner.text = " Starting backend API server...";
  const backendProcess = fork(join(projectRoot, "server.cjs"), [], {
    cwd: projectRoot,
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });

  let backendReady = false;
  backendProcess.on("message", (message) => {
    if (message === "backend-ready") {
      backendReady = true;
      startupSpinner.succeed(" Backend API server started!");
    }
  });

  backendProcess.on("error", (error) => {
    startupSpinner.fail(`Backend server failed to start: ${error.message}`);
    process.exit(1);
  });

  // Wait a bit for backend to start
  setTimeout(() => {
    if (!backendReady) {
      startupSpinner.warn(
        " Backend server may not be ready yet, but continuing...",
      );
    }
  }, 3000);

  // Create HTTP server to serve the built files
  const server = createServer(async (req, res) => {
    try {
      let filePath = join(distDir, req.url === "/" ? "index.html" : req.url);

      // Handle SPA routing - serve index.html for all non-file requests
      if (!existsSync(filePath) || !filePath.startsWith(distDir)) {
        filePath = join(distDir, "index.html");
      }

      const content = await readFile(filePath);
      const ext = filePath.split(".").pop();

      // Set appropriate content types
      const contentTypes = {
        html: "text/html",
        css: "text/css",
        js: "application/javascript",
        json: "application/json",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        svg: "image/svg+xml",
        ico: "image/x-icon",
      };

      res.writeHead(200, {
        "Content-Type": contentTypes[ext] || "text/plain",
        "Cache-Control": "no-cache",
      });
      res.end(content);
    } catch (error) {
      res.writeHead(404);
      res.end("File not found");
    }
  });

  const PORT = 3000;

  // Start server
  server
    .listen(PORT, () => {
      const url = `http://localhost:${PORT}`;
      startupSpinner.succeed(` Server is running at: ${url}`);
      ora().succeed(" Aeternum Research Tool is ready!");

      // Open browser
      const { platform } = process;
      let openCommand;

      if (platform === "darwin") {
        openCommand = "open";
      } else if (platform === "win32") {
        openCommand = "start";
      } else {
        openCommand = "xdg-open";
      }

      try {
        execSync(`${openCommand} ${url}`, { stdio: "ignore" });
        ora().succeed(" Browser opened automatically");
      } catch (error) {
        ora().warn(`Please open your browser and navigate to: ${url}`);
      }

      runningSpinner = ora(" Aeternum Research Tool is running...").start();

      console.log(
        "\n💡 Press Ctrl+C to stop the server\n❓ to display Hotkeys",
      );

      // Enable raw mode for stdin to listen for single key presses
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
      }
      process.stdin.resume();
      process.stdin.setEncoding("utf8");

      process.stdin.on("data", (key) => {
        // Ctrl+C to exit
        if (key === "\u0003") {
          process.emit("SIGINT");
          return;
        }

        const keyString = key.toString().toLowerCase();

        switch (keyString) {
          case "g": // Open GitHub repository
            ora().info("Opening GitHub repository...");
            execSync(
              `start https://github.com/involvex/new-world-expansion-research`,
              { stdio: "ignore" },
            );
            break;
          case "r": // Restart server (CLI process)
            ora().warn(
              " To restart the server, please stop the current process (Ctrl+C) and run the CLI again.",
            );
            break;
          case "d": // Download data (frontend action)
            ora().info(
              " Data download functionality is available in the web application (hotkey D).",
            );
            break;
          case "s": // Share Research (frontend action)
            ora().info(
              " Share research functionality is available in the web application (hotkey S).",
            );
            break;
          case "?": // Show hotkey overview
            ora().info(
              "CLI Hotkeys:\n" +
                "  G: Open GitHub Repository\n" +
                "  R: Restart CLI (manual restart required)\n" +
                "  D: Download Data (web app only)\n" +
                "  S: Share Research (web app only)\n" +
                "  ?: Show this Hotkey Overview\n" +
                "  Ctrl+C: Stop Server",
            );
            break;
          default:
            // Ignore other keys
            break;
        }
      });
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        startupSpinner.fail(
          `Port ${PORT} is already in use. Please close the other application or try a different port.`,
        );
        process.exit(1);
      } else {
        startupSpinner.fail(`Server failed to start: ${err.message}`);
        process.exit(1);
      }
    });

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    process.stdin.setRawMode(false); // Disable raw mode before exiting
    runningSpinner.stop(); // Stop the running spinner
    const shutdownSpinner = ora(
      " Shutting down Aeternum Research Tool...",
    ).start();

    // Kill backend process
    if (backendProcess && !backendProcess.killed) {
      backendProcess.kill("SIGINT");
    }

    server.close(() => {
      shutdownSpinner.succeed(" Server stopped");
      console.log(
        "\n   Support the Project at:\n☕ https://www.buymeacoffee.com/involvex\n   See your soon!",
      );
      process.exit(0);
    });
  });

  process.on("SIGTERM", () => {
    process.stdin.setRawMode(false); // Disable raw mode before exiting
    runningSpinner.stop(); // Stop the running spinner
    const shutdownSpinner = ora(
      " Shutting down Aeternum Research Tool...",
    ).start();

    // Kill backend process
    if (backendProcess && !backendProcess.killed) {
      backendProcess.kill("SIGTERM");
    }

    console.log(
      "\n   Support the Project at:\n☕ https://www.buymeacoffee.com/involvex\n   See your soon!",
    );
    server.close(() => {
      shutdownSpinner.succeed(" Server stopped");
      process.exit(0);
    });
  });
}
