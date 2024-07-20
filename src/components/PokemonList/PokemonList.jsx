import { useEffect, useState } from "react"
import axios from 'axios'
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";
function PokemonList() {

    // useEffect(() => {
    //     console.log('Effect Called')
    // },[])

    // const [x,setX] = useState(0);
    // const [y,setY] = useState(0);

    const [pokemonList,setpokemonList] = useState([]);
    const [isLoading,setIsLoading] = useState(true)

    const POKEDEX_URL = "https://pokeapi.co/api/v2/pokemon"


    async function downloadPokemons() {
        const response = await axios.get(POKEDEX_URL)//this downloads list of 20 pokemons
        const pokemonResults = response.data.results;//We get the array of pokemons from result
        console.log(pokemonResults)
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url)) //Iterating over the array of pokemons and using their URL to create an array of promises that will download those 20 pokemons
        const pokemonData = await axios.all(pokemonResultPromise) // Passing that promise array to axios.all
        console.log(pokemonData) //Array of 20 pokemon detailed data

        //Iterate on the data of each pokemon and extracxt id,name,image and type
        const pokeListResult = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data
            return {
                id:pokemon.id,
                name:pokemon.name,
                image:(pokemon.sprites.front_default) ? pokemon.sprites.front_default : pokemon.sprites.front_shiny,
                types:pokemon.types
            }
        });
        console.log(pokeListResult)
        setpokemonList(pokeListResult)
        setIsLoading(false);
    }

    useEffect(() => {
        downloadPokemons();
    },[])

    return (
        <>
            {/* <div>
                X : {x} <button onClick={() => setX(x+1)}>Inc</button>
            </div>
            <div>
                Y : {y} <button onClick={() => setY(y+1)}>Inc</button>
            </div> */}

            <div className="pokemon-list-wrapper">

                <div className="pokemon-wrapper">
                    {isLoading ? 'Loading...':
                        pokemonList.map((p) => <Pokemon name={p.name} image = {p.image} key={p.id} />)
                    }
                </div> 
                <div className="controls">
                    <button>Prev</button>
                    <button>Next</button>
                </div>
            </div>
        </>
    )
}
export default PokemonList