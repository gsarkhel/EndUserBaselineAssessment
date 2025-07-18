/**
 * LogWindowHelper - Browser-based logging utility for SCORM debugging
 * 
 * QUICK SWITCH FOR PRODUCTION DELIVERY:
 * The logger can be quickly disabled for production by setting:
 * - NODE_ENV=production (automatically disables logger)
 * - LOGGER_ENABLED=false (explicitly disables logger)
 * 
 * To enable logger in production, set: LOGGER_ENABLED=true
 * 
 * Usage:
 * - Development: Logger is enabled by default
 * - Production: Logger is disabled by default (unless LOGGER_ENABLED=true)
 */

// Add type declaration for the custom window properties
interface LogWindow extends Window {
  addLogEntry?: (timestamp: string, message: string) => void;
  clearLogs?: () => void;
}

class LogWindowHelper {
  // Quick switch to disable logger for production delivery
  private static readonly LOGGER_ENABLED = process.env.NODE_ENV === 'development' && process.env.LOGGER_ENABLED !== 'false';
  
  /**
   * Allows manual override of logger enabled state at runtime.
   * If set, this value takes precedence over environment variables.
   */
  private static manualOverride: boolean | null = null;

  /**
   * Set logger enabled/disabled manually at runtime.
   * Pass true to enable, false to disable, or null to reset to env-based logic.
   */
  static setLoggerEnabled(enabled: boolean | null) {
    LogWindowHelper.manualOverride = enabled;
  }

  /**
   * Returns true if logger is enabled (manual override takes precedence).
   */
  static isEnabled(): boolean {
    if (LogWindowHelper.manualOverride !== null) {
      return LogWindowHelper.manualOverride;
    }
    return LogWindowHelper.LOGGER_ENABLED;
  }

  private logWindow: LogWindow | null = null;
  private readonly title: string;
  private readonly width: number;
  private readonly height: number;
  private logBuffer: string[] = [];
  private maxBufferSize: number = 1000;

  constructor(
    title: string = 'API Logs',
    width: number = 800,
    height: number = 600
  ) {
    this.title = title;
    this.width = width;
    this.height = height;
  }

  open(): boolean {
    // Early return if logger is disabled
    if (!LogWindowHelper.isEnabled()) {
      return false;
    }

    try {
      // Check if window is already open
      if (this.logWindow && !this.logWindow.closed) {
        this.logWindow.focus();
        return true;
      }

      // Calculate center position for the popup
      const left = (window.screen.width - this.width) / 2;
      const top = (window.screen.height - this.height) / 2;

      // Open the popup window with more specific features
      this.logWindow = window.open(
        '',
        'LogWindow',
        `width=${this.width},height=${this.height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,location=no,menubar=no,toolbar=no`
      );

      if (!this.logWindow) {
        console.warn('LogWindowHelper: Popup blocked by browser. Logs will be buffered.');
        return false;
      }

      // Create the HTML content safely
      const htmlContent = this.createLogWindowHTML();
      
      // Use a safer approach than document.write
      this.logWindow.document.open();
      this.logWindow.document.write(htmlContent);
      this.logWindow.document.close();

      // Add event listener for window close
      this.logWindow.addEventListener('beforeunload', () => {
        this.logWindow = null;
      });

      // Flush buffered logs if any
      if (this.logBuffer.length > 0) {
        this.flushBuffer();
      }

      return true;
    } catch (error) {
      console.error('LogWindowHelper: Error opening log window:', error);
      return false;
    }
  }

  private createLogWindowHTML(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${this.title}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              margin: 0;
              padding: 10px;
              background-color: #1e1e1e;
              color: #ffffff;
            }
            #controls {
              margin-bottom: 10px;
              padding: 5px;
              background-color: #2d2d2d;
              border-radius: 3px;
            }
            button {
              background-color: #007acc;
              color: white;
              border: none;
              padding: 5px 10px;
              margin-right: 5px;
              border-radius: 3px;
              cursor: pointer;
              font-size: 11px;
            }
            button:hover {
              background-color: #005a9e;
            }
            #log {
              white-space: pre-wrap;
              word-wrap: break-word;
              max-height: calc(100vh - 80px);
              overflow-y: auto;
              background-color: #1e1e1e;
              padding: 10px;
              border: 1px solid #3c3c3c;
              border-radius: 3px;
            }
            .log-entry {
              margin-bottom: 2px;
              padding: 2px 0;
            }
            .log-entry:hover {
              background-color: #2d2d2d;
            }
            .timestamp {
              color: #569cd6;
              font-weight: bold;
            }
            .message {
              color: #d4d4d4;
            }
          </style>
        </head>
        <body>
          <div id="controls">
            <button onclick="clearLogs()">Clear Logs</button>
            <button onclick="exportLogs()">Export Logs</button>
            <button onclick="toggleAutoScroll()">Auto-scroll: ON</button>
            <span id="logCount">Logs: 0</span>
          </div>
          <div id="log"></div>
          <script>
            let autoScroll = true;
            let logCount = 0;

            function clearLogs() {
              document.getElementById('log').innerHTML = '';
              logCount = 0;
              updateLogCount();
            }

            function exportLogs() {
              const logContent = document.getElementById('log').textContent;
              const blob = new Blob([logContent], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'logs_' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.txt';
              a.click();
              URL.revokeObjectURL(url);
            }

            function toggleAutoScroll() {
              autoScroll = !autoScroll;
              const button = document.querySelector('button[onclick="toggleAutoScroll()"]');
              button.textContent = 'Auto-scroll: ' + (autoScroll ? 'ON' : 'OFF');
            }

            function updateLogCount() {
              document.getElementById('logCount').textContent = 'Logs: ' + logCount;
            }

            function addLogEntry(timestamp, message) {
              const logElement = document.getElementById('log');
              const entry = document.createElement('div');
              entry.className = 'log-entry';
              entry.innerHTML = '<span class="timestamp">[' + timestamp + ']</span> <span class="message">' + message + '</span>';
              logElement.appendChild(entry);
              logCount++;
              updateLogCount();
              
              if (autoScroll) {
                logElement.scrollTop = logElement.scrollHeight;
              }
            }

            // Expose function to parent window
            window.addLogEntry = addLogEntry;
          </script>
        </body>
      </html>
    `;
  }

  log(message: string): void {
    // Early return if logger is disabled
    if (!LogWindowHelper.isEnabled()) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${message}`;

    // Add to buffer
    this.logBuffer.push(logEntry);
    
    // Keep buffer size manageable
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
    }

    // Try to log to window if open
    if (this.logWindow && !this.logWindow.closed) {
      try {
        // Use the safer method exposed by the popup window
        if (this.logWindow.addLogEntry) {
          this.logWindow.addLogEntry(timestamp, message);
        } else {
          // Fallback to direct DOM manipulation
          const logElement = this.logWindow.document.getElementById('log');
          if (logElement) {
            logElement.textContent += logEntry + '\n';
            logElement.scrollTop = logElement.scrollHeight;
          }
        }
      } catch (error) {
        console.error('LogWindowHelper: Error writing to log window:', error);
        // If there's an error, the window might be in a bad state, so close it
        this.close();
      }
    }
  }

  private flushBuffer(): void {
    if (!LogWindowHelper.isEnabled() || !this.logWindow || this.logWindow.closed) return;

    try {
      this.logBuffer.forEach(entry => {
        const [timestamp, message] = entry.split(' - ', 2);
        if (this.logWindow?.addLogEntry) {
          this.logWindow.addLogEntry(timestamp, message);
        }
      });
      this.logBuffer = [];
    } catch (error) {
      console.error('LogWindowHelper: Error flushing buffer:', error);
    }
  }

  close(): void {
    if (!LogWindowHelper.isEnabled()) return;

    if (this.logWindow && !this.logWindow.closed) {
      try {
        this.logWindow.close();
      } catch (error) {
        console.error('LogWindowHelper: Error closing log window:', error);
      } finally {
        this.logWindow = null;
      }
    }
  }

  isOpen(): boolean {
    if (!LogWindowHelper.isEnabled()) return false;
    return !!this.logWindow && !this.logWindow.closed;
  }

  clear(): void {
    if (!LogWindowHelper.isEnabled()) return;

    this.logBuffer = [];
    if (this.logWindow && !this.logWindow.closed) {
      try {
        this.logWindow.clearLogs?.();
      } catch (error) {
        console.error('LogWindowHelper: Error clearing logs:', error);
      }
    }
  }

  getLogs(): string[] {
    if (!LogWindowHelper.isEnabled()) return [];
    return [...this.logBuffer];
  }
}

export default LogWindowHelper;
