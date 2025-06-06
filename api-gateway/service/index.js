const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const port = 3000;
const url = require('url');
const rateLimit = require('express-rate-limit');

// Service registry
const serviceRegistry = {
  A: {url: 'http://localhost:3001', time: 15*60*1000, limit: 100},
  B: {url: 'http://localhost:3002', time: 10*60*1000, limit: 200},
  C: {url: 'http://localhost:3003', time: 5*60*1000, limit: 300},
};


console.log('Proxy configured with routes:');
for (const prefix in serviceRegistry) {
  console.log(`  /${prefix}/* -> ${serviceRegistry[prefix].url}`);
}

// Create rate limiters for each service upfront
const rateLimiters = {};
for (const prefix in serviceRegistry) {
  const config = serviceRegistry[prefix];
  rateLimiters[prefix] = rateLimit({
    windowMs: config.time,
    max: config.limit,
    message: `Too many requests to service ${prefix}, please try again later.`,
    standardHeaders: true,
    legacyHeaders: false,
  });
}

// Apply rate limiting middleware before the proxy
for (const prefix in serviceRegistry) {
  app.use(`/${prefix}`, rateLimiters[prefix]);
}

// Proxy requests to the appropriate service
app.use('/', (req, res, next) => {
  const pathSegments = req.path.split('/').filter(segment => segment.length > 0);
  
  if (pathSegments.length === 0) {
    return res.status(200).send('Welcome to the Proxy. Try /A/ or /B/');
  }

  const servicePrefix = pathSegments[0]; 
  const targetServiceUrl = serviceRegistry[servicePrefix].url;
  
  if (targetServiceUrl) {
    console.log(`Proxy: Matched prefix "${servicePrefix}". Routing to ${targetServiceUrl}`);

    const newPath = '/' + pathSegments.slice(1).join('/') + (url.parse(req.originalUrl).search || '');
    
    const serviceProxy = proxy(targetServiceUrl, {
      proxyReqPathResolver: function (originalReq) {
        console.log(`Proxy: Forwarding request for "${servicePrefix}" to path: ${newPath} at ${targetServiceUrl}`);
        return newPath;
      },
      proxyReqBodyDecorator: function(bodyContent, srcReq) {
        console.log(`Proxy: Forwarding body for "${servicePrefix}":`, bodyContent);
        return bodyContent;
      },
      userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
        console.log(`Proxy: Received response from "${servicePrefix}" for path ${userReq.originalUrl}`);
        return proxyResData;
      },
      preserveHostHdr: true, 
    });

    return serviceProxy(req, res, next);

  } else {
    console.log(`Proxy: No service configured for prefix "${servicePrefix}". Path: ${req.path}`);
    res.status(404).send(`Service not found for prefix: ${servicePrefix}`);
  }
});


app.listen(port, () => {
  console.log(`Proxy listening at http://localhost:${port}`);
});