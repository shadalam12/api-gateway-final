import express from 'express';
import cors from 'cors';  
import universalBodyParser from '../middleware/universalBodyParser.js';


// ✅ Create separate apps for each service
const ports = [3001, 3002, 3003];
const names = ['Service A', 'Service B', 'Service C'];

for (let i = 0; i < ports.length; i++) {
  const app = express();
  const port = ports[i];
  const name = names[i];

  app.use(cors());
  app.use(universalBodyParser());

  app.all('/*url', (req, res) => {
    try {
      if (req.body) {
          res.status(200).send({
          message: `Hello from ${name}!`,
          method: req.method,
          url: req.originalUrl,
          query: req.query,
          headers: req.headers,
          data: req.body,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error ) {
      console.error('Proxy error:', error.message);
      res.status(error?.response?.status || 500).json({
        error: error?.response?.data || 'Internal gateway error'
      });
    }
    
  });

  app.listen(port, () => {
    console.log(`${name} listening at http://localhost:${port}`);
  });
}
