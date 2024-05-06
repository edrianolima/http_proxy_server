# HTTP Proxy Server

This project configures an HTTP proxy server using Node.js, Express, and `http-proxy`. It is designed to forward requests from a frontend application to a backend API, manage CORS issues, and provide basic logging capabilities.

## Getting Started

These instructions will guide you through setting up and running the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://npmjs.com/) (Node Package Manager)

### Installation

Follow these steps to set up your development environment:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/edrianolima/http_proxy_server
   ```
2. **Navigate to the repository directory:**
   ```bash
   cd http_proxy_server
   ```
3. **Install the required packages:**
   ```bash
   npm install
   ```

### Configuration

Configure the server by updating the proxy settings:

- **Target API URL**: Replace `'https://target-api.com'` in the `proxyTarget` variable with your actual backend API URL.
- **Base Target Endpoint**: Modify `/base-target-endpoint/*` in the route configuration to your backend base endpoint:

   ```javascript
   const proxyTarget = 'https://target-api.com'; // Replace with your backend URL
   app.all('/base-target-endpoint/*', (req, res) => { // Replace with your backend Base target endpoint
       proxy.web(req, res, { target: proxyTarget, timeout: 60000 });
   });
   ```

### Running the Server

To launch the server, execute:

```bash
npm start
```

Alternatively, for development with automatic restarts, you can use:

```bash
npm run dev
```

The server will initialize on port 4000, or another port if configured differently.

### Health Check

Check the health of the proxy server by visiting:

```url
http://localhost:4000/health
```

This will display the server uptime and a status message about the server's health.

### Deployment

To deploy this proxy server using Docker, follow these steps:

1. **Build the Docker image:**
   ```bash
   docker build -t http-proxy-server .
   ```
2. **Run the container:**
   ```bash
   docker run -p 4000:4000 http-proxy-server
   ```

This will start the server in a Docker container and expose it on port 4000 of your host machine.

## Technologies Used

- [Express](https://expressjs.com/) - Web framework
- [http-proxy](https://www.npmjs.com/package/http-proxy) - HTTP proxying library

## Authors

- **Edriano Lima** - [edrianolima](https://github.com/edrianolima)

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.
