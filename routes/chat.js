const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).render("unauthorized"); // Usuario no autenticado
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).render("unauthorized"); // Token inválido
    }

    res.render("chat", { username: decoded.username }); // Pasar datos del usuario a la vista
  });
});

module.exports = router;
