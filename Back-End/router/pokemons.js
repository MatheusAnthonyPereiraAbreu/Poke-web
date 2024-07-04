const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Pokemon = require("../models/Pokemon.js");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: path.resolve(__dirname, "../env/.env") });

const filePath = path.join(__dirname, "..", "db", "pokemons-capturados.json");

const baseUrl = "https://pokeapi.co/api/v2";

//Rota para pegar todos os pokemons. rota para pegar (/pokemons/pokemon-api)
router.post("/pokemon-api", autenticarToken, async (req, res) => {
  const listaDePokemons = [];
  const { generation } = req.body;
  const user = res.locals.user;
  try {
    // Obtém as espécies de Pokémon para a geração especificada
    const response = await axios.get(`${baseUrl}/generation/${generation}`);
    const especiesPokemons = response.data.pokemon_species;

    for (const especie of especiesPokemons) {
      // Extrai o ID da URL da espécie
      const urlAux = especie.url;
      const id = urlAux.match(/\/(\d+)\/$/)[1];

      // Obtém os dados do formulário do Pokémon usando o ID extraído
      const responseAux = await axios.get(`${baseUrl}/pokemon-form/${id}`);
      listaDePokemons.push(responseAux.data);
    }

    return res
      .status(200)
      .json({ listaDePokemons: listaDePokemons, username: user.username });
  } catch (error) {
    return res.status(404).send("Erro na requisição!");
  }
});

//Rota para pegar um pokemon específico. rota para pegar(/pokemons/pokemon-api-busca);
router.post("/pokemon-api-busca", autenticarToken, async (req, res) => {
  const { pokemonName } = req.body;
  try {
    const response = await axios.get(`${baseUrl}/pokemon/${pokemonName}`);
    return res.status(200).send(response.data);
  } catch (error) {
    return res.status(404).send("Pokemon não econtrado!");
  }
});

//Rota para pegar a lista de pokemons capturados. rota para pegar a lista(/pokemons/pokemon-api-capturado);
router.get("/pokemon-api-capturado", autenticarToken, (req, res) => {
  const user = res.locals.user;
  let listaCapturados;
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Erro no servidor!");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
      listaCapturados = jsonData.capturados.filter((element) => {
        return element.email === user.email;
      });
      return res.status(200).send(listaCapturados);
    } catch (parseErr) {
      return res.status(500).send("Erro ao analisar a lista de capturados.");
    }
  });
});

//Rota para adicionar um pokemon a lista de pokemons capturados. rota para capturar(/pokemons/pokemon-api-adicionar-capturado);
router.post("/pokemon-api-adicionar-capturado", autenticarToken, async (req, res) => {
  const { currentPokemon } = req.body;
  const user = res.locals.user;

  try {
    // Leitura do arquivo JSON de forma assíncrona
    fs.readFile(filePath, "utf8", (err, data) => {
      
      let jsonData = JSON.parse(data);
      
      // Filtragem dos pokémons capturados pelo usuário atual
      const pokemonsCapturados = jsonData.capturados.filter((element) => element.email === user.email);
      
      // Encontrando o maior número entre os pokémons capturados
      const maiorNumero = pokemonsCapturados.reduce((max, pokemon) => Math.max(max, pokemon.number), 0) + 1;
      
      // Criando o novo objeto Pokemon
      const pokemonNovo = {
        id: currentPokemon.id,
        username: currentPokemon.username,
        img: currentPokemon.img,
        number: maiorNumero,
        email: user.email,
      };
      // Adicionando o novo pokémon à lista de capturados
      pokemonsCapturados.push(pokemonNovo);
      jsonData.capturados.push(pokemonNovo);
      
      // Escrevendo no arquivo JSON de forma assíncrona
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          return res.status(500).send("Erro ao deletar o pokemon!");
        }
        
        // Respondendo ao cliente com sucesso e a lista atualizada de pokémons capturados
        res.status(200).json({
          message: "Pokémon capturado!",
          capturedPokemons: pokemonsCapturados,
        });
      })
        
    })
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      res.status(500).send("Erro ao capturar o Pokémon!");
    }
  });
  
//Rota para remover um pokemon da lista de capturados, rota para pegar(/pokemons/pokemon-api-remover-capturado);
router.post(
  "/pokemon-api-remover-capturado",
  autenticarToken,
  async (req, res) => {
    const { index } = req.body;
    const user = res.locals.user;
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Erro no servidor!");
      }

      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Erro ao analisar a lista de capturados!");
      }

      // Encontrar o índice do pokémon a ser removido no array geral jsonData.capturados
      const pokemonIndex = jsonData.capturados.findIndex(
        (pokemon) => pokemon.email === user.email && pokemon.number === index
      );

      if (pokemonIndex === -1) {
        return res.status(404).send("Pokémon não foi capturado!");
      }

      // Remover o pokémon do array geral jsonData.capturados
      jsonData.capturados.splice(pokemonIndex, 1);

      // Filtrar novamente os pokémons capturados pelo usuário para enviar de volta ao frontend
      const pokemonsCapturados = jsonData.capturados.filter(
        (pokemon) => pokemon.email === user.email
      );

      // Escrever o novo conteúdo no arquivo JSON
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          return res.status(500).send("Erro ao deletar o pokémon!");
        }

        res.status(200).json({
          message: "Pokémon solto!",
          capturedPokemons: pokemonsCapturados,
        });
      });
    });
  }
);


function autenticarToken(req, res, next) {
  const authH = req.headers["authorization"];
  const token = authH && authH.split(" ")[1];
  if (!token) return res.status(401).send("Token não encontrado");

  // Verificando o token
  try {
    const user = jwt.verify(token, process.env.TOKEN);
    req.user = user;
    res.locals.user = user;
    next(); // Se o token é válido, avança chamando next()
  } catch (error) {
    res.status(403).send("Token inválido");
  }
}

module.exports = router;
