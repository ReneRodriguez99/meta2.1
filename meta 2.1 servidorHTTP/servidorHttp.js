const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Obtén la URL y el método de la solicitud
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const method = req.method;

  // Obtén la ruta completa, incluyendo la consulta
  const fullUrl = req.url;

  // Obtén las cabeceras de la solicitud
  const headers = req.headers;

  // Configura el encabezado de respuesta con la codificación UTF-8
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // Manejo de solicitudes GET
  if (method === 'GET') {
    if (pathname === '/datos') {
      // Genera una página HTML que muestra los datos recibidos en la solicitud GET, el método utilizado, la ruta completa y las cabeceras de solicitud
      const htmlResponse = `
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Respuesta GET</title>
          </head>
          <body>
            
            <h2>Request headers:</h2>
            <pre>${JSON.stringify(headers, null, 2)}</pre>

            <h2>Método ${method}</h2>

            <h2>URL: ${fullUrl}</h2>

          </body>
        </html>
      `;
      res.statusCode = 200;
      res.end(htmlResponse);
    } else if (pathname === '/formulario') {
      // Servir una página HTML con un formulario para ingresar valores de campo1 y campo2
      const formularioPath = path.join(__dirname, 'formulario.html');
      fs.readFile(formularioPath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Error interno del servidor');
        } else {
          res.statusCode = 200;
          res.end(data);
        }
      });
    } else {
      res.statusCode = 404;
      res.end('<h1>Recurso no encontrado</h1>');
    }
  }

  // Manejo de solicitudes POST
  if (method === 'POST') {
    if (pathname === '/') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const parsedBody = new URLSearchParams(body);
        const campo1 = parsedBody.get('campo1');
        const campo2 = parsedBody.get('campo2');

        // Genera una página HTML que muestra los datos recibidos en la solicitud POST
        const htmlResponse = `
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Respuesta POST</title>
            </head>
            <body>

              <h2>Request headers:</h2>
              <pre>${JSON.stringify(headers, null, 2)}</pre>

              <h2>Método: ${method}</h2>

              <h2>URL: ${fullUrl}</h2>

              <h2>Datos Enviados: Campo1=${campo1},Campo2=${campo2}</h2>



            </body>
          </html>
        `;
        res.statusCode = 200;
        res.end(htmlResponse);
      });
    } else {
      res.statusCode = 404;
      res.end('<h1>Recurso no encontrado</h1>');
    }
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});