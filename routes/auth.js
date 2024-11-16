const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();
require("dotenv").config();

// Registro de usuarios
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Verificar si el usuario ya existe
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error en el servidor.");
    }

    if (row) {
      // Usuario ya registrado
      return res.render("register", {
        error: "El usuario ya está registrado.",
      });
    }

    // Si el usuario no existe, registrar
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error al registrar el usuario.");
        }

        // Redirigir al login tras registro exitoso
        res.redirect("/auth/login");
      }
    );
  });
});

module.exports = router;

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error en el servidor.");
    }

    if (!user) {
      return res.render("login", {
        error: "Usuario o contraseña incorrectos.",
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.render("login", {
        error: "Usuario o contraseña incorrectos.",
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Guardar el token en una cookie
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/chat"); // Redirigir a la vista de chat
  });
});

router.get("/login", (req, res) => res.render("login"));

router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

router.get("/logout", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).render("unauthorized");
  }

  res.clearCookie("token");
  res.redirect("/auth/login");
});

module.exports = router;
