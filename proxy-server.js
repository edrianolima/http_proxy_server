const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');

const app = express();
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

// Define the entry point for your proxy server
const proxyTarget = 'https://target-api.com'; // Replace with your backend URL
const port = 4000;

// Middleware to handle CORS requests
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
        'Authorization', 
        'Content-Type', 
        'Origin', 
        'X-Requested-With', 
        'Accept', 
        'x-channel-name', 
        'x-device-name', 
    ],
};
app.use(cors(corsOptions));

// Route for health check
app.get('/health', (req, res) => {
    console.log(`\n[Proxy Request] ${req.method} ${req.url} -> ${req.protocol}://${req.hostname}${req.url}`);
    console.log(`[Proxy Request Headers]`, req.headers);
    const data = {
        uptime: process.uptime(),
        message: 'Server is healthy',
        date: new Date()
    };
    res.status(200).send(data);
});

// Logs to trace requests and responses
proxy.on('proxyReq', (proxyReq, req, res, options) => {
    console.log(`\n[Proxy Request] ${req.method} ${req.url} -> ${proxyTarget}${req.url}`);
    console.log(`[Proxy Request Headers]`, req.headers);

    let requestBody = '';
    req.on('data', (chunk) => {
        requestBody += chunk;
    });

    req.on('end', () => {
        if (requestBody) {
            console.log(`[Proxy Request Body] ${requestBody}`);
        }
    });
});

proxy.on('proxyRes', (proxyRes, req, res) => {
    let responseBuffer = [];
    
    proxyRes.on('data', (chunk) => {
        responseBuffer.push(chunk);
    });

    proxyRes.on('end', () => {
        const responseData = Buffer.concat(responseBuffer).toString();
        console.log(`[Proxy Response] ${req.method} ${req.url} <- ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
        console.log(`[Proxy Response Headers]`, proxyRes.headers);

        if (responseData.length > 0) {
            console.log(`[Proxy Response Body] <- ${responseData.length} bytes`);
            console.log(`[Proxy Response Body] <- ${responseData}`);
        } else {
            console.log(`[Proxy Response Body] <- No content`);
        }
    });
});

// Route to redirect all requests to the backend
app.all('/base-target-endpoint/*', (req, res) => { // Replace with your backend Base target endpoint
    proxy.web(req, res, { target: proxyTarget, timeout: 60000 }, (error, req, res) => {
        if (error) {
            console.error(`[Proxy Error] ${error}`);
        }
    });
});

// Start the proxy server on port 4000 (or any desired port)
app.listen(port, () => {
    console.log(`Proxy server is running on port ${port}.`);
});
