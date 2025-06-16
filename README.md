# API Gateway

A robust and scalable API Gateway built with Node.js that provides a unified entry point for microservices, handling routing, authentication, rate limiting, and request/response transformation.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Middleware](#middleware)
- [Monitoring](#monitoring)
- [Security](#security)
- [Performance](#performance)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Request Routing**: Intelligent routing to downstream services based on URL patterns
- **Load Balancing**: Distribute requests across multiple service instances
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Rate Limiting**: Configurable rate limiting per endpoint and user
- **Request/Response Transformation**: Modify requests and responses on the fly
- **Caching**: Redis-based response caching for improved performance
- **Health Checks**: Monitor downstream service health
- **Logging & Monitoring**: Comprehensive logging with metrics collection
- **Circuit Breaker**: Protect against cascading failures
- **CORS Support**: Cross-origin resource sharing configuration
- **API Versioning**: Support for multiple API versions

## Architecture

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│   Client    │───▶│   API Gateway   │───▶│  Service A  │
└─────────────┘    │                 │    └─────────────┘
                   │  - Routing      │    ┌─────────────┐
                   │  - Auth         │───▶│  Service B  │
                   │  - Rate Limit   │    └─────────────┘
                   │  - Transform    │    ┌─────────────┐
                   │  - Cache        │───▶│  Service C  │
                   └─────────────────┘    └─────────────┘
```

## Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn
- Redis (for caching and rate limiting)
- MongoDB/PostgreSQL (for configuration storage)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/api-gateway.git
cd api-gateway
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment configuration:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`

5. Start the gateway:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/api_gateway

# JWT Configuration
JWT_SECRET=your-super-secret-key
JWT_EXPIRY=24h


### Service Configuration

Configure your downstream services in `config/services.json`:

```json
{
  "services": {
    "user-service": {
      "url": "http://localhost:3001",
      "healthCheck": "/health",
      "timeout": 5000,
      "retries": 3
    },
    "order-service": {
      "url": "http://localhost:3002",
      "healthCheck": "/health",
      "timeout": 5000,
      "retries": 3
    }
  },
  "routes": [
    {
      "path": "/api/v1/users/*",
      "service": "user-service",
      "methods": ["GET", "POST", "PUT", "DELETE"],
      "auth": true,
      "rateLimit": {
        "windowMs": 900000,
        "max": 100
      }
    },
    {
      "path": "/api/v1/orders/*",
      "service": "order-service",
      "methods": ["GET", "POST"],
      "auth": true,
      "cache": {
        "ttl": 300
      }
    }
  ]
}
```

## Usage

### Starting the Gateway

```bash
# Production
npm start

# Development with auto-reload
npm run dev

# With PM2
pm2 start ecosystem.config.js
```


## API Documentation

### Authentication

The gateway uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Rate Limiting

Rate limits are applied per endpoint and user. When exceeded, the gateway returns:

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retryAfter": 300
}
```

### Error Responses

Standard error response format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/users/123"
}
```

## Middleware

The gateway includes several built-in middleware:

- **Authentication Middleware**: Validates JWT tokens
- **Rate Limiting Middleware**: Enforces request rate limits
- **CORS Middleware**: Handles cross-origin requests
- **Logging Middleware**: Logs all requests and responses
- **Error Handling Middleware**: Standardizes error responses

### Custom Middleware

Add custom middleware in the `middleware/` directory:

```javascript
// middleware/custom.js
module.exports = (req, res, next) => {
  // Custom logic here
  req.customProperty = 'value';
  next();
};
```

## Monitoring

### Health Checks

Check gateway health:
```bash
curl http://localhost:3000/health
```

### Metrics

Metrics are exposed on a separate port (default: 3001):
```bash
curl http://localhost:3001/metrics
```

Available metrics:
- Request count and duration
- Error rates
- Downstream service health
- Cache hit/miss rates
- Rate limit violations

### Logging

Logs are structured JSON format and include:
- Request/response details
- Performance metrics
- Error information
- Downstream service calls

## Security

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent abuse and DoS attacks
- **CORS Configuration**: Control cross-origin access
- **Input Validation**: Sanitize and validate all inputs
- **Security Headers**: Helmet.js for security headers
- **SSL/TLS**: HTTPS support with certificate management

## Performance

- **Connection Pooling**: Efficient HTTP connection management
- **Response Caching**: Redis-based caching for faster responses
- **Compression**: Gzip compression for reduced bandwidth
- **Keep-Alive**: Persistent connections to downstream services
- **Load Balancing**: Distribute load across service instances


## Scripts

- `npm start` - Start the gateway in production mode
- `npm run dev` - Start with nodemon for development
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run build` - Build for production
- `npm run docs` - Generate API documentation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [Wiki](https://github.com/yourusername/api-gateway/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/api-gateway/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/api-gateway/discussions)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

Built with ❤️ using Node.js
