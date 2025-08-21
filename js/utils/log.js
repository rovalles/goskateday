import { getDebugFromURL } from "./url-utils.js"; // Import the utility function to check debug mode

// Function to check if debug mode is enabled (e.g., via localStorage)
const isDebugEnabled = () => getDebugFromURL();

// A common prefix for your app's log messages
const APP_PREFIX = "[APP] ";

const logger = {
  /**
   * Logs a general message.
   * @param {string} message - The main message to log.
   * @param {any[]} args - Any additional arguments to pass to console.log.
   */
  log: (message, ...args) => {
    if (isDebugEnabled()) {
      console.log(APP_PREFIX + message, ...args);
    }
  },

  /**
   * Logs informational messages.
   * @param {string} message - The main message to log.
   * @param {any[]} args - Any additional arguments.
   */
  info: (message, ...args) => {
    if (isDebugEnabled()) {
      console.info(APP_PREFIX + message, ...args);
    }
  },

  /**
   * Logs warning messages.
   * @param {string} message - The main message to log.
   * @param {any[]} args - Any additional arguments.
   */
  warn: (message, ...args) => {
    if (isDebugEnabled()) {
      console.warn(APP_PREFIX + message, ...args);
    }
  },

  /**
   * Logs error messages.
   * @param {string} message - The main message to log.
   * @param {any[]} args - Any additional arguments.
   */
  error: (message, ...args) => {
    if (isDebugEnabled()) {
      console.error(APP_PREFIX + message, ...args);
    }
  },

  /**
   * Returns true if debug mode is currently enabled.
   * Useful for conditional logic outside of logging itself.
   */
  isDebug: isDebugEnabled(),
};

// Export the logger object as default
export default logger;
