// Universal body parser
export default function universalBodyParser(options = {}) {
  return function(req, res, next) {
    // Skip non-POST/PUT/PATCH requests
    if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
      return next();
    }

    // Read the request body
    let data = '';
    req.on('data', chunk => {
      data += chunk.toString();
    });

    // Parse the request body
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

// Try to automatically parse the request body
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

// Parse multipart/form-data
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
