const logger = {
    info: (message, data = {}) => {
        console.log(`[INFO] ${message}`, data);
    },
    error: (message, error = null) => {
        console.error(`[ERROR] ${message}`, error ? error.stack : '');
    },
    warn: (message, data = {}) => {
        console.warn(`[WARN] ${message}`, data);
    },
    debug: (message, data = {}) => {
        console.debug(`[DEBUG] ${message}`, data);
    },
    request: (req) => {
        console.log(`[REQUEST] ${req.method} ${req.url}`, {
            body: req.body,
            query: req.query,
            headers: req.headers
        });
    },
    response: (res, data) => {
        console.log(`[RESPONSE] ${res.statusCode}`, data);
    }
};

module.exports = logger; 