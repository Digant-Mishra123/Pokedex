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

    // const [pokemonList,setpokemonList] = useState([]);
    // const [isLoading,setIsLoading] = useState(true)

    // const [pokedexUrl,setPokedexUrl] = useState("https://pokeapi.co/api/v2/pokemon")

    // const [nextUrl, setNextUrl] = useState('')
    // const [prevUrl,setPrevUrl] = useState('')

    const [pokemonListState,setPokemonListState] = useState({
        pokemonList:[],
        isLoading:true,
        pokedexUrl:'https://pokeapi.co/api/v2/pokemon',
        nextUrl:'',
        prevUrl:''
    })


    async function downloadPokemons() {
        // setIsLoading(true)
        setPokemonListState((state) => ({...state,isLoading:true}));

        const response = await axios.get(pokemonListState.pokedexUrl)//this downloads list of 20 pokemons
        const pokemonResults = response.data.results;//We get the array of pokemons from result
        console.log(pokemonResults)

        setPokemonListState((state) => ({
            ...state,
            nextUrl:response.data.next,
            prevUrl:response.data.previous
        }));

        // setPrevUrl(response.data.previous)

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
        setPokemonListState((state) => ({
            ...state,
            pokemonList:pokeListResult, 
            isLoading:false
        }));

        // setIsLoading(false);
    }

    useEffect(() => {
        downloadPokemons();
    },[pokemonListState.pokedexUrl])

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
                    {pokemonListState.isLoading ? 'Loading...':
                        pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image = {p.image} key={p.id} id={p.id} />)
                    }
                </div> 
                <div className="controls">
                    <button disabled={pokemonListState.prevUrl == null} onClick={() => {
                        const urlToSet = pokemonListState.prevUrl;
                        setPokemonListState({ ...pokemonListState, pokedexUrl: urlToSet})
                    }}>Prev</button>
                    <button disabled={pokemonListState.nextUrl == null} onClick={() => {
                        console.log(pokemonListState)
                        const urlToSet = pokemonListState.nextUrl;
                        setPokemonListState({ ...pokemonListState, pokedexUrl: urlToSet})
                    }}>Next</button>
                </div>
            </div>
        </>
    )
}
export default PokemonList