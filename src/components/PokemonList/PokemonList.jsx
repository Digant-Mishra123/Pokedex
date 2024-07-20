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

    async function downloadPokemons() {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon")
        const pokemonResults = response.data.results;
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url))
        const pokemonData = await axios.all(pokemonResultPromise)
        console.log(pokemonData)
        setpokemonList(pokemonData.map())
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
                <div>Pokemon List</div>
                {(isLoading) ? 'Loading...':
                        pokemonList.map((p) => <Pokemon name={p.name} image = {p.image} key={p.id}/>)
                }
            </div>
        </>
    )
}
export default PokemonList