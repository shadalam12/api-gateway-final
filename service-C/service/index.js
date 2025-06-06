import express from 'express';
import querystring from 'querystring';
import htmlparser from 'node-html-parser';
const app = express();
const port = 3003;

function universalBodyParser(options = {}) {
  return function(req, res, next) {
    if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
      return next();
    }

    let data = '';
    req.on('data', chunk => {
      data += chunk.toString();
    });

    req.on('end', () => {
      try {
        const contentType = req.headers['content-type'] || '';
        
        if (contentType.includes('application/json')) {
          req.body = JSON.parse(data);
        } 
        else if (contentType.includes('application/x-www-form-urlencoded')) {
          req.body = querystring.parse(data);
        } 
        else if (contentType.includes('application/html')) {
          req.body = htmlparser.parse(data);
        }
        else if (contentType.includes('multipart/form-data')) {
          req.body = parseMultipartData(data, contentType);
        } 
        else {
          req.body = tryAutoParse(data);
        }
        next();
      } catch (err) {
        next(err);
      }
    });
  };
}

function tryAutoParse(data) {
  try {
    return JSON.parse(data); 
  } catch (e) {
    try {
      return querystring.parse(data); 
    } catch (e) {
      return data; 
    }
  }
}

function parseMultipartData(data, contentType) {
  const boundary = contentType.split('boundary=')[1];
  const parts = data.split(`--${boundary}`);
  
  const result = {};
  parts.forEach(part => {
    if (part.includes('Content-Disposition')) {
      const nameMatch = part.match(/name="([^"]+)"/);
      if (nameMatch) {
        const value = part.split('\r\n\r\n')[1].trim();
        result[nameMatch[1]] = value;
      }
    }
  });
  
  return result;
}

app.use(universalBodyParser());


app.all('/*url', (req, res) => { // Use app.all to catch any method on any path
  res.status(200).send({
    message: 'Hello from Service C!',
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    headers: req.headers,
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Service C listening at http://localhost:${port}`);
});