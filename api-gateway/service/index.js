const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const port = 3000;
const url = require('url');


const serviceRegistry = {
  A: 'http://localhost:3001',
  B: 'http://localhost:3002',
  C: 'http://localhost:3003'
};

console.log('Proxy configured with routes:');
for (const prefix in serviceRegistry) {
  console.log(`  /${prefix}/* -> ${serviceRegistry[prefix]}`);
}


app.use('/', (req, res, next) => {
  const pathSegments = req.path.split('/').filter(segment => segment.length > 0);
  
  if (pathSegments.length === 0) {
    return res.status(200).send('Welcome to the Proxy. Try /A/ or /B/');
  }

  const servicePrefix = pathSegments[0]; 
  const targetServiceUrl = serviceRegistry[servicePrefix];

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