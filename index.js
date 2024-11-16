const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require("path");
const { server1, server2 } = require("./webSockets");
const app = express();
const server = http.createServer(app); //servidor http
const PORT = 3000;

// Configuración del motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

app.use((req, res) => {
  res.status(404).render("404");
});

server.on("upgrade", (req, socket, head) => {
  if (req.url === "/ws/server1") {
    server1.handleUpgrade(req, socket, head, (ws) => {
      server1.emit("connection", ws, req);
    });
  } else if (req.url === "/ws/server2") {
    server2.handleUpgrade(req, socket, head, (ws) => {
      server2.emit("connection", ws, req);
    });
  } else {
    socket.destroy(); // Si la URL no es válida, cerrar la conexión
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
