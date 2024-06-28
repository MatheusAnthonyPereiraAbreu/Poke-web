const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const filePath = path.join(__dirname, "db", "users.json");

const User = require('./models/User');

router.post("/login", async (req, res) => {
  const usuario = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Erro no servidor!");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data); // Convertendo os dados do arquivo JSON para objeto JavaScript
    } catch (parseErr) {
      return res.status(500).send("Erro ao analisar o arquivo JSON");
    }

    const usuarios = jsonData.users; // Acessando o array de usuários

    const usuarioEncontrado = usuarios.find(
      (userDb) => userDb.email === usuario.email
    );

    if (!usuarioEncontrado) {
      return res.status(404).send("Usuário não encontrado");
    }

    if (usuarioEncontrado.senha !== userNovo.senha) {
      return res.status(401).send("Senha incorreta");
    }

    res.status(200).send("Login com sucesso!");
  });
});

router.post("/create"), async (req,res) =>{
    const {nome,email,senha} = req.body;

    fs.readFile(filePath, "utf8", async (err, data) => {
        if (err) {
          return res.status(500).send("Erro no servidor!");
        }
    
        let jsonData;
        try {
          jsonData = JSON.parse(data); // Convertendo os dados do arquivo JSON para objeto JavaScript
        } catch (parseErr) {
          return res.status(500).send("Erro no servidor!");
        }
    
        const usuarios = jsonData.users; // Acessando o array de usuários
    
        const usuarioEncontrado = usuarios.find(
          (userDb) => userDb.email === email
        );
    
        if (usuarioEncontrado) {
          return res.status(404).send("Esse e-mail já esta sendo usado.");
        }
    
        if (!usuarioEncontrado) {

            const id = usuarios.length+1;

            const salt = await bcrypt.genSalt(10);
            const senhaCriptografada = await bcrypt.hash(senha,salt);

            const userNovo = new User(id,nome,email,senhaCriptografada);
            
            usuarios.push(userNovo);

            fs.writeFileSync(filePath,JSON.stringify(usuarios,null,2));

          return res.status(200).send("Usuário criado com sucesso!");
        }
    
      });
}
