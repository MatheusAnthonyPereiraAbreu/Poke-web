import React, { useState, useEffect } from 'react';
import '../../../styles/dashboard.css';
import pokedexImage from '../../../assets/pokedex.png';
import loadingImage from '../../../assets/loading-image.gif';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight,  } from '@fortawesome/free-solid-svg-icons'
<FontAwesomeIcon icon="fa-solid fa-arrow-right" />


export default function Dashboard() {
  let [pokemons, setPokemons] = useState([]);
  const [currentPokemonIndex, setCurrentPokemonIndex] = useState(0);
  const [generation, setGeneration] = useState(1);
  const [loading, setLoading] = useState(true);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  const fetchPokemons = async (generation) => {
    setLoading(true); // Define o estado de carregamento como verdadeiro
    try {
      const response = await axios.post(`http://localhost:3000/pokemons/pokemon-api`, { generation });
      console.log(response);
      setPokemons(response.data);
      setCurrentPokemonIndex(0); // Reiniciar o índice do Pokémon ao mudar a geração
      setLoading(false); // Define o estado de carregamento como falso
    } catch (error) {
      console.error('Erro ao buscar pokémons:', error);
      setLoading(false); // Define o estado de carregamento como falso, mesmo em caso de erro
    }
  };

  useEffect(() => {
    fetchPokemons(generation);
  }, [generation]);

  // Definição da imagem e descrição com base no estado de carregamento e dados dos pokémons
  const img = loading ? loadingImage : pokemons[currentPokemonIndex]?.sprites?.front_default;
  const desc = loading ? 'Carregando...' : capitalizeFirstLetter(pokemons[currentPokemonIndex]?.name || '');

  const nextPokemon = () => {
    if (pokemons.length === 0) return;
    const newIndex = (currentPokemonIndex + 1) % pokemons.length;
    setCurrentPokemonIndex(newIndex);
  };

  const previousPokemon = () => {
    if (pokemons.length === 0) return;
    const newIndex = (currentPokemonIndex - 1 + pokemons.length) % pokemons.length;
    setCurrentPokemonIndex(newIndex);
  };

  const handleGenerationChange = (event) => {
    setGeneration(parseInt(event.target.value, 10));
  };


  console.log(pokemons[currentPokemonIndex])
  return (
    <div className="container-layout">
      <div className="layout">
        <section className="pokedex">
          <div id="pokemons">
            <img className="pokemon-img" src={img} alt={desc} />
            <p className="pokemon-name">{desc}</p>  
          </div>
          <figure>
            <img id="img-pokedex" src={pokedexImage} alt="Descrição da Pokédex" />
          </figure>
        </section>
        <button className="next-button" onClick={nextPokemon}><FontAwesomeIcon icon={faArrowRight} /></button>
        <button className="previous-button" onClick={previousPokemon}><FontAwesomeIcon icon={faArrowLeft} /></button>
        <div className="generation-select">
          <label htmlFor="generation">Selecione a Geração</label>
          <select id="generation" value={generation} onChange={handleGenerationChange}>
            {[...Array(9).keys()].map(i => (
              <option key={i + 1} value={i + 1}>Geração {i + 1}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}