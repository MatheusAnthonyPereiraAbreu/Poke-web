import React, { useState } from 'react';
import '../../../styles/dashboard.css';
import pokedexImage from '../../../assets/pokedex.png';

const pokemons = [
  {
    "id": 1,
    "name": "Agumon",
    "href": "https://digi-api.com/api/v1/digimon/1",
    "image": "https://digi-api.com/images/digimon/w/Agumon.png"
  },
  {
    "id": 2,
    "name": "Airdramon",
    "href": "https://digi-api.com/api/v1/digimon/2",
    "image": "https://digi-api.com/images/digimon/w/Airdramon.png"
  },
  {
    "id": 3,
    "name": "Angemon",
    "href": "https://digi-api.com/api/v1/digimon/3",
    "image": "https://digi-api.com/images/digimon/w/Angemon.png"
  },
  {
    "id": 4,
    "name": "Betamon",
    "href": "https://digi-api.com/api/v1/digimon/4",
    "image": "https://digi-api.com/images/digimon/w/Betamon.png"
  },
  {
    "id": 5,
    "name": "Birdramon",
    "href": "https://digi-api.com/api/v1/digimon/5",
    "image": "https://digi-api.com/images/digimon/w/Birdramon.png"
  }
];

export default function Dashboard() {
  const [currentPokemonIndex, setCurrentPokemonIndex] = useState(0);

  const nextPokemon = () => {
    const newIndex = (currentPokemonIndex + 1) % pokemons.length;
    setCurrentPokemonIndex(newIndex);
  };

  return (
    <div className="container-layout">
      <div className="layout">
        <section className="pokedex">
          <div id="pokemons">
            <img className="pokemon-img" src={pokemons[currentPokemonIndex].image} alt={pokemons[currentPokemonIndex].name} />
            <p className="pokemon-name">{pokemons[currentPokemonIndex].name}</p>
          </div>
          <figure>
            <img id="img-pokedex" src={pokedexImage} alt="Descrição da Pokédex" /> 
          </figure>
        </section>
        <button className="next-button" onClick={nextPokemon}>Avançar</button>
      </div>
    </div>
  );
}