const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

const filePath = path.join(__dirname, "..", "db", "users.json");

require('dotenv').config({ path: path.resolve(__dirname, '../env/.env') });

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Erro no servidor!");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send("Erro ao analisar o arquivo JSON");
    }

    const usuarios = jsonData.users;
    const usuarioEncontrado = usuarios.find((userDb) => userDb.email === email);

    if (!usuarioEncontrado) {
      return res.status(404).send("Usuário não encontrado");
    }

    bcrypt.compare(password, usuarioEncontrado.password, (err, result) => {
      if (err || !result) {
        return res.status(401).send("Senha incorreta");
      }
      const token = jwt.sign(usuarioEncontrado,process.env.TOKEN);

      res.status(200).json({message: "Login com sucesso!" , token: token });
    });
  });
});

// Create user route
router.post("/create", async (req, res) => {
  const { username, email, password} = req.body;

  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      return res.status(500).send("Erro no servidor!");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send("Erro ao analisar o arquivo JSON");
    }

    const usuarios = jsonData.users;
    const usuarioEncontrado = usuarios.find((userDb) => userDb.email === email);

    if (usuarioEncontrado) {
      return res.status(400).send("Esse e-mail já está sendo usado.");
    }

    const id = usuarios.length + 1;
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(password, salt);

    const userNovo = new User(id, username, email, senhaCriptografada);
    usuarios.push(userNovo);

    jsonData.users = usuarios;
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Erro ao salvar o usuário");
      }

      res.status(200).send("Usuário criado com sucesso!");
    });
  });
});

module.exports = router;
