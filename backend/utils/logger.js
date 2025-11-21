import winston from 'winston';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');

// Define log format with timestamp and structured data
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // Include stack traces for errors
  winston.format.json() // Log in JSON format for better parsing
);

// Create logger instance with different transports
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', // Default to info level
  format: logFormat,
  defaultMeta: { service: 'gdrive-express-backend' }, // Add service name to all logs
  transports: [
    // Write all logs to combined.log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error', // Only write errors to this file
      maxsize: 5242880, // 5MB max file size
      maxFiles: 5, // Keep 5 rotated files
    }),
    // Write all logs to combined.log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB max file size
      maxFiles: 5, // Keep 5 rotated files
    }),
  ],
});

// If we're not in production, also log to console with color formatting
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(), // Add colors to console output
      winston.format.simple() // Simple format for console
    )
  }));
}

// Helper functions for different log levels with context
export const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

export const logError = (message, error = null, meta = {}) => {
  const errorData = {
    ...meta,
    ...(error && {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    })
  };
  logger.error(message, errorData);
};

export const logWarn = (message, meta = {}) => {
  logger.warn(message, meta);
};

export const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};

// Specialized logging functions for common operations
export const logAuth = (action, userId, email, success = true, error = null) => {
  const logData = {
    action, // 'login', 'logout', 'register'
    userId,
    email,
    success,
    timestamp: new Date().toISOString()
  };

  if (success) {
    logInfo(`Authentication ${action} successful`, logData);
  } else {
    logError(`Authentication ${action} failed`, error, logData);
  }
};

export const logFileOperation = (operation, userId, fileId, filename, success = true, error = null) => {
  const logData = {
    operation, // 'upload', 'download', 'delete', 'rename'
    userId,
    fileId,
    filename,
    success,
    timestamp: new Date().toISOString()
  };

  if (success) {
    logInfo(`File ${operation} successful`, logData);
  } else {
    logError(`File ${operation} failed`, error, logData);
  }
};

export const logDirectoryOperation = (operation, userId, dirId, dirName, success = true, error = null) => {
  const logData = {
    operation, // 'create', 'delete', 'rename', 'access'
    userId,
    dirId,
    dirName,
    success,
    timestamp: new Date().toISOString()
  };

  if (success) {
    logInfo(`Directory ${operation} successful`, logData);
  } else {
    logError(`Directory ${operation} failed`, error, logData);
  }
};

export const logSecurity = (event, details = {}) => {
  // Log security-related events with high priority
  logError(`SECURITY EVENT: ${event}`, null, {
    ...details,
    timestamp: new Date().toISOString(),
    severity: 'HIGH'
  });
};

export default logger;