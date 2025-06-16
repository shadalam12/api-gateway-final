import proxy from 'express-http-proxy';
import url from 'url';
import { loadServiceRegistry } from '../lib/serviceRegistry.js';
import RequestLog from '../model/requestLogger.js'
import logger from '../lib/logger.js';

// Proxy middleware
export async function apiGateway() {
  // Load the service registry
  const serviceRegistry = await loadServiceRegistry();

  return (req, res, next) => {
    // Extract the service prefix from the path
    const pathSegments = req.path.split('/').filter(segment => segment.length > 0);

    // If the path is empty, send a welcome message
    if (pathSegments.length === 0) {
      logger.info('Root request received. Sending API gateway greeting.');
      return res.status(200).send('Welcome to the Proxy. Try /A/ or /B/');
    }

    // Find the target service based on the service prefix
    const servicePrefix = pathSegments[0];
    const serviceEntry = serviceRegistry[servicePrefix];
    const targetServiceUrl = serviceEntry?.url;

    // If a target service is found, proxy the request
    if (targetServiceUrl) {
      // Construct the new path
      const newPath = '/' + pathSegments.slice(1).join('/') + (url.parse(req.originalUrl).search || '');

      logger.info(`Proxying request: [${req.method}] ${req.originalUrl} → ${targetServiceUrl}${newPath}`);

      // Proxy the request
      const serviceProxy = proxy(targetServiceUrl, {
        proxyReqPathResolver: () => newPath,

        proxyReqBodyDecorator: (body) => {
          logger.debug(`Body forwarded for [${servicePrefix}]: ${JSON.stringify(body)}`);
          return body;
        },

        userResDecorator: async (proxyRes, proxyResData, userReq, userRes) => {
          logger.info(`Response from [${servicePrefix}]: ${proxyRes.statusCode}`);
          try {
            // Log the request
            await RequestLog.create({
              path: userReq.originalUrl,
              ip_address: userReq.ip,
              status_code: proxyRes.statusCode,
            });
          } catch (err) {
            console.error('Logging error:', err);
          }
          return proxyResData;
        },

        preserveHostHdr: true,
      });

      // Proxy the request
      return serviceProxy(req, res, next);
    } else {
      logger.warn(`Unmapped service prefix "${servicePrefix}". Path: ${req.path}`);
      // If no target service is found, return a 404
      return res.status(404).send(`Service not found for prefix: ${servicePrefix}`);
    }
  };
}
