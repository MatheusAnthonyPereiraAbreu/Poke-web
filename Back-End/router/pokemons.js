const express = require("express");
const router = express.Router();
const axios = require('axios');

const baseUrl = 'https://pokeapi.co/api/v2';

//Rota para pegar todos os pokemons.
router.get("/pokemon-api" , async (req,res) =>{
    try{
        const response = await axios.get(`${baseUrl}/pokemon/?offset=0&limit=649`);
        console.log(response.data.results);
        return res.status(200).send(response.data.results);
    } catch(error){
        return res.status(404).send('Erro na requisição !');
    }
});
//Rota para pegar um pokemon específico, ainda em construção.
router.post("/pokemon-api-busca", async (req,res)=>{
    const pokemon = req.body;
    try{
        const response = await axios.get(`${baseUrl}/pokemon/${pokemon}`);
        console.log(response.data.results);
        return res.status(200).send(response.data.results);
    } catch(error){
        const response = await axios.get(`${baseUrl}/pokemon/${pokemon}`);
        console.log(pokemon);
        return res.status(404).send('Pokemon não econtrado!'); 
    }
});
module.exports = router