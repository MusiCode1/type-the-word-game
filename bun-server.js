const { serve } = require('bun');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const net = require('net');

let server = null;

const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const interfaceName of Object.keys(interfaces)) {
        const iface = interfaces[interfaceName];
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '0.0.0.0';
};

const isPortAvailable = (port) => {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.unref();
        server.on('error', () => resolve(false));
        server.listen(port, () => {
            server.close(() => resolve(true));
        });
    });
};

const getAvailablePort = async (startPort) => {
    let port = startPort;
    while (!(await isPortAvailable(port))) {
        port++;
    }
    return port;
};

const startServer = async () => {
    const localIP = getLocalIP();
    const port = await getAvailablePort(3000);
    server = serve({
        fetch: handler,
        port: port,
        hostname: localIP,
    });
    console.log(`Server is running on http://${localIP}:${port}`);
};

const restartServer = async () => {
    if (server) {
        server.stop();
        console.log('Server stopped');
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    await startServer();
};


const watchFiles = async () => {
    const watcher = fs.watch('.', { recursive: true });
    for await (const event of watcher) {
        if (
            event.eventType === 'change' &&
            !event.filename.includes('.git') &&
            !path.dirname(event.filename).includes('.git')
        ) {
            console.log(`File ${event.filename} changed`);
            await restartServer();
        }
    }
};

const handler = async (req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (pathname === '/') {
        const files = await getFileList('.');
        const fileList = files
            .map((file) => `<li><a href="${file}">${file}</a></li>`)
            .join('');
        const html = `
      <html>
        <head>
          <title>File Server</title>
        </head>
        <body>
          <h1>File List</h1>
          <ul>${fileList}</ul>
        </body>
      </html>
    `;
        return new Response(html, {
            headers: {
                'Content-Type': 'text/html',
            },
        });
    }

    const filePath = path.join('.', decodeURIComponent(pathname));
    try {
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            const files = await getFileList(filePath);
            const fileList = files
                .map((file) => `<li><a href="${path.join(pathname, file)}">${file}</a></li>`)
                .join('');
            const html = `
        <html>
          <head>
            <title>File Server</title>
          </head>
          <body>
            <h1>File List</h1>
            <ul>${fileList}</ul>
          </body>
        </html>
      `;
            return new Response(html, {
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        } else {
            const fileContent = await Bun.file(filePath).arrayBuffer();
            const contentType = getContentType(filePath);
            return new Response(fileContent, {
                headers: {
                    'Content-Type': contentType,
                },
            });
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            return new Response('File not found', {
                status: 404,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        }
        return new Response('Internal Server Error', {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
};

const getFileList = async (directory) => {

    const entries = await fs.readdir(directory, { withFileTypes: true });

    const files = entries
        .filter((entry) => !entry.isDirectory() && !entry.name.startsWith('.git'))
        .map((entry) => entry.name);

    console.log(files);

    const directories = entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith('.git'));

    for (const dir of directories) {
        const subFiles = await getFileList(path.join(directory, dir.name));
        files.push(...subFiles.map((file) => path.join(dir.name, file)));
    }
    return files;
};

const getContentType = (filePath) => {
    const extname = filePath.split('.').pop();
    switch (extname) {
        case 'html':
            return 'text/html';
        case 'css':
            return 'text/css';
        case 'js':
            return 'application/javascript';
        case 'json':
            return 'application/json';
        case 'png':
            return 'image/png';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        default:
            return 'application/octet-stream';
    }
};

startServer();
watchFiles();