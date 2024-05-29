const { route } = require("../routes");

const services = [
    {
        route: "/inventory",
        target: "http://localhost:8001/api/v1/inventory",
    },
];


const rateLimit = 50;
const interval = 60 * 1000; // 50 requests per minute

const requestCounts = {};

setInterval(() => {
    Object.keys(requestCounts).forEach((ip) => {
        requestCounts[ip] = 0;
    });
}, interval);

function rateLimitAndTimeout(req, res, next) {
    const ip = req.ip;
    console.log("IP: ", ip);
    requestCounts[ip] = (requestCounts[ip] || 0) + 1;

    if (requestCounts[ip] > rateLimit) {
        return res.status(429).json({
            code: 429,
            message: "Rate limit exceeded.",
        });
    }

    req.setTimeout(60000, () => {
        res.status(504).json({
            code: 504,
            message: "Gateway timeout.",
        });
        req.abort();
    });

    next();
}

module.exports = {
    services,
    rateLimitAndTimeout,
};