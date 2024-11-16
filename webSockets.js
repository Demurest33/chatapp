const WebSocket = require("ws");

// Crear los servidores WebSocket
const server1 = new WebSocket.Server({ noServer: true });
const server2 = new WebSocket.Server({ noServer: true });

const validateToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
  } catch (error) {
    return null; // Si el token no es válido, retorna null
  }
};

// Manejar conexiones y mensajes para el servidor 1
server1.on("connection", (ws) => {
  console.log("Cliente conectado al Servidor 1");
  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    const response = `Hola ${parsedMessage.username}!`;
    ws.send(`Server 1: ${response}`);
  });
});

// Manejar conexiones y mensajes para el servidor 2
server2.on("connection", (ws) => {
  console.log("Cliente conectado al Servidor 2");
  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    const response = `Hola ${parsedMessage.username}!`;
    ws.send(`Server 2: ${response}`);
  });
});

module.exports = { server1, server2, validateToken };
