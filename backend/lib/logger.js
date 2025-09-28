/**
 * @fileoverview Production-ready logging utility
 *
 * This logger provides structured logging for production environments with:
 * - Environment-based log levels (development vs production)
 * - Structured JSON output for production (better for log aggregation)
 * - Error tracking with stack traces
 * - Request context preservation
 *
 * In production, logs are output as JSON for easy parsing by log aggregation services.
 * In development, logs are human-readable for easier debugging.
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Base logger class with environment-aware formatting
 */
class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
  }

  /**
   * Check if a log level should be output
   * @param {string} level - Log level to check
   * @returns {boolean} Whether to output this level
   */
  shouldLog(level) {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  /**
   * Format log entry for output
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   * @returns {Object|string} Formatted log entry
   */
  format(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta,
    };

    if (isProduction) {
      // In production, output structured JSON for log aggregation
      return JSON.stringify(logEntry);
    } else {
      // In development, output human-readable format
      const metaStr =
        Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
    }
  }

  /**
   * Log an error message
   * @param {string} message - Error message
   * @param {Error|Object} error - Error object or metadata
   * @param {Object} context - Additional context
   */
  error(message, error = null, context = {}) {
    if (!this.shouldLog('error')) return;

    const meta = {
      ...context,
      ...(error && {
        error: {
          message: error.message || error,
          stack: error.stack,
          name: error.name,
        },
      }),
    };

    const output = this.format('error', message, meta);
    console.error(output);
  }

  /**
   * Log a warning message
   * @param {string} message - Warning message
   * @param {Object} context - Additional context
   */
  warn(message, context = {}) {
    if (!this.shouldLog('warn')) return;

    const output = this.format('warn', message, context);
    console.warn(output);
  }

  /**
   * Log an info message
   * @param {string} message - Info message
   * @param {Object} context - Additional context
   */
  info(message, context = {}) {
    if (!this.shouldLog('info')) return;

    const output = this.format('info', message, context);
    console.log(output);
  }

  /**
   * Log a debug message
   * @param {string} message - Debug message
   * @param {Object} context - Additional context
   */
  debug(message, context = {}) {
    if (!this.shouldLog('debug')) return;

    const output = this.format('debug', message, context);
    console.log(output);
  }
}

// Export singleton instance
export default new Logger();
