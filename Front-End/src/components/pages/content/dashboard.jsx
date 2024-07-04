import React, { useState, useEffect } from 'react';
import '../../../styles/dashboard.css';
import pokedexImage from '../../../assets/pokedex.png';
import loadingImage from '../../../assets/loading-image.gif';
import fundoBranco from '../../../assets/fundobranco.png';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
  let [pokemons, setPokemons] = useState([]);
  const [currentPokemonIndex, setCurrentPokemonIndex] = useState(0);
  const [generation, setGeneration] = useState(1);
  const [loading, setLoading] = useState(true);
  let [pokemonDetails, setPokemonDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [capturedPokemons, setCapturedPokemons] = useState([]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const fetchPokemons = async (generation) => {
    setLoading(true); // Define o estado de carregamento como verdadeiro
    try {
      const response = await axios.post(`http://localhost:3000/pokemons/pokemon-api`, { generation });
      setPokemons(response.data);
      setCurrentPokemonIndex(0); // Reiniciar o índice do Pokémon ao mudar a geração
      setLoading(false); // Define o estado de carregamento como falso
    } catch (error) {
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
    setShowDetails(false);
    buscaPokemon();
  };

  const previousPokemon = () => {
    if (pokemons.length === 0) return;
    const newIndex = (currentPokemonIndex - 1 + pokemons.length) % pokemons.length;
    setCurrentPokemonIndex(newIndex);
    setShowDetails(false);
    buscaPokemon();
  };

  const handleGenerationChange = (event) => {
    setGeneration(parseInt(event.target.value, 10));
  };

  const toggleDetails = () => {
    setShowDetails(prevShowDetails => !prevShowDetails);
    buscaPokemon();
  };

  const buscaPokemon = async () => {
    try {
      const pokemonName = pokemons[currentPokemonIndex]?.name;
      const response = await axios.post("http://localhost:3000/pokemons/pokemon-api-busca", { pokemonName });
      console.log(response.data);
      setPokemonDetails(response.data);
    } catch (error) {
      setLoading(false);
    }
  }

  const capturePokemon = async () => {
    if (loading) return; // Não permitir capturar se estiver carregando
    try {
      const currentPokemon = {
        id: pokemons[currentPokemonIndex].id,
        username: pokemons[currentPokemonIndex].name,
        img: pokemons[currentPokemonIndex].sprites.front_default,
      };
      const response = await axios.post(`http://localhost:3000/pokemons/pokemon-api-adicionar-capturado`, { currentPokemon });
      setCapturedPokemons(response.data.capturedPokemons);
    } catch (error) {
      console.error('Erro ao capturar Pokémon:', error);
      // Trate o erro de acordo com sua lógica, por exemplo:
      // exibir uma mensagem de erro para o usuário ou lidar com o estado de erro de outra forma
    } finally {

    }
  };

  const removePokemon = async (index) => {
    const response = await axios.post(`http://localhost:3000/pokemons/pokemon-api-remover-capturado`,{index});
    console.log(response);
    setCapturedPokemons(response.data.capturedPokemons);
  };

  useEffect(() => {
    const fetchCapturedPokemons = async () => {
      try {
        const response = await axios.get('http://localhost:3000/pokemons/pokemon-api-capturado');
        setCapturedPokemons(response.data);
      } catch (error) {
        console.error('Erro ao carregar Pokémon capturados:', error);
        // Trate o erro de acordo com sua lógica
      }
    };

    fetchCapturedPokemons();
  }, []);

  return (
    <div className="container-layout">
      <div className="layout">
        <section className="pokedex">
          <div id="pokemons">
            <img className="pokemon-img" src={img} alt={desc} />
            <p className="pokemon-name">{desc}</p>
          </div>
          <figure>
            <img id="img-fundobranco" src={fundoBranco} alt="fundo branco" />
            <img id="img-pokedex" src={pokedexImage} alt="Descrição da Pokédex" />
          </figure>
          <div className="generation-select">
            <label htmlFor="generation">Selecione a Geração</label>
            <select id="generation" value={generation} onChange={handleGenerationChange}>
              {[...Array(9).keys()].map(i => (
                <option key={i + 1} value={i + 1}>Geração {i + 1}</option>
              ))}
            </select>
          </div>
        </section>
        <button className="next-button" onClick={nextPokemon}><FontAwesomeIcon icon={faArrowRight} /></button>
        <button className="previous-button" onClick={previousPokemon}><FontAwesomeIcon icon={faArrowLeft} /></button>

        <button className="details-button" onClick={toggleDetails}>Detalhes</button>
        {showDetails && (
          <div className="pokemon-details">
            {/* Detalhes do Pokémon podem ser adicionados aqui /}
          {/ Exemplos de detalhes */}
            {pokemonDetails && (
              <>
                {pokemonDetails.types.length > 0 && (
                  <p className="pokemon-types">Tipos: {pokemonDetails.types.map(type => type.type.name).join(', ')}</p>
                )}
                <p>Altura: {pokemonDetails.height}</p>
                <p>Peso: {pokemonDetails.weight}</p>
                <span>
                  <p>Hp: {pokemonDetails.stats[0].base_stat}</p>
                  <p>Attack: {pokemonDetails.stats[1].base_stat}</p>
                  <p>Defense: {pokemonDetails.stats[2].base_stat}</p>
                  <p>Special-Attack: {pokemonDetails.stats[3].base_stat}</p>
                  <p>Special-Defense: {pokemonDetails.stats[4].base_stat}</p>
                  <p>Speed: {pokemonDetails.stats[5].base_stat}</p>
                </span>
              </>
            )}
          </div>
        )}
        <button className="capture-button" onClick={capturePokemon} disabled={loading}>Capturar</button>
        <div className="captured-pokemons">
          <ul>
            {capturedPokemons.map(pokemon => (
              <li key={pokemon.id}>
                <span>{capitalizeFirstLetter(pokemon.username)}</span>
                <button onClick={() => removePokemon(pokemon.number)}>Soltar Pokémon</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}