const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Pokemon = require("../models/Pokemon.js");

const filePath = path.join(__dirname, "..", "db", "pokemons-capturados.json");

const baseUrl = "https://pokeapi.co/api/v2";

//Rota para pegar todos os pokemons. rota para pegar (/pokemons/pokemon-api)
router.get("/pokemon-api", async (req, res) => {
  const listaDePokemons = [];
  const generation = req.body; // Definido como 1 para este exemplo, pode ser alterado conforme necessário

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

    return res.status(200).send(listaDePokemons);
  } catch (error) {
    console.error(error);
    return res.status(404).send("Erro na requisição!");
  }
});
//Rota para pegar um pokemon específico. rota para pegar(/pokemons/pokemon-api-busca);
router.post("/pokemon-api-busca", async (req, res) => {
  const pokemon = req.body;
  try {
    const response = await axios.get(`${baseUrl}/pokemon/${pokemon.pokemon}`);
    return res.status(200).send(response.data);
  } catch (error) {
    return res.status(404).send("Pokemon não econtrado!");
  }
});

//Rota para pegar a lista de pokemons capturados. rota para pegar a lista(/pokemons/pokemon-api-capturado);
router.get("/pokemon-api-capturado", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Erro no servidor!");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
      return res.status(200).send(jsonData.capturados);
    } catch (parseErr) {
      return res.status(500).send("Erro ao analisar a lista de capturados.");
    }
  });
});

//Rota para adicionar um pokemon a lista de pokemons capturados. rota para capturar(/pokemons/pokemon-api-adicionar-capturado);
router.post("/pokemon-api-adicionar-capturado", async (req, res) => {
  const pokemon = req.body;
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
    const pokemonsCapturados = jsonData.capturados;

    const pokemonEncontrado = pokemonsCapturados.find((pokemonDb) => {
      pokemonDb.username === pokemon.username;
    });
    if (pokemonEncontrado) {
      return res.status(404).send("Pokemon já capturado !");
    }

    const pokemonNovo = new Pokemon(pokemon.id, pokemon.username, pokemon.img);

    pokemonsCapturados.push(pokemonNovo);
    jsonData.capturados = pokemonsCapturados;

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Erro ao capturar o pokemon !");
      }

      res.status(200).send("Pokemon capturado!!");
    });
  });
});
//Rota para remover um pokemon da lista de capturados, rota para pegar(/pokemons/pokemon-api-remover-capturado);
router.post("/pokemon-api-remover-capturado", async (req, res) => {
    const pokemon = req.body;
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
  
      const pokemonsCapturados = jsonData.capturados;
      const pokemonIndex = pokemonsCapturados.findIndex((pokemonDb) => {
        return pokemonDb.username === pokemon.username;
      });
  
      if (pokemonIndex === -1) {
        return res.status(404).send("Pokemon não foi capturado!");
      }
  
      pokemonsCapturados.splice(pokemonIndex, 1);
      jsonData.capturados = pokemonsCapturados;
  
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          return res.status(500).send("Erro ao deletar o pokemon!");
        }
  
        res.status(200).send("Pokemon solto!!");
    });
  });
});

module.exports = router;
