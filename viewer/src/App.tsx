import POKEMON_ALL from "@motemen/pokemon-data";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FaNpm } from "react-icons/fa6";

function App() {
  return (
    <>
      <div className="p-6">
        <header className="mb-5 text-slate-900 dark:text-slate-300">
          <h1 className="font-bold text-2xl leading-8">
            POKEMON_ALL
            <a
              href="https://www.npmjs.com/package/@motemen/pokemon-data"
              className="ml-2 h-full inline-block align-text-bottom"
            >
              <FaNpm className="w-6 h-6 inline-block text-slate-800 dark:text-slate-400" />
            </a>
            <a
              href="https://github.com/motemen/pokemon-data"
              className="ml-2 h-full inline-block align-text-bottom"
            >
              <GitHubLogoIcon className="w-6 h-6 inline-block text-slate-800 dark:text-slate-400" />
            </a>
          </h1>
          <p>
            <small className="font-normal font-sm">
              A table of Pokémon ID correspondences across multiple sites
            </small>
          </p>
        </header>
        <table className="table-auto border-collapse w-full">
          <thead className="sticky top-0">
            <tr className="border-b bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 font-bold">
              <th className="p-2">yakkuncom_id</th>
              <th className="p-2">yakkuncom_name</th>
              <th className="p-2">pokeapi_id</th>
              <th className="p-2">pokeapi_name</th>
              <th className="p-2">pokeapi_species_name_ja</th>
              <th className="p-2">pokeapi_form_name_ja</th>
              <th className="p-2">pokedbtokyo_id</th>
            </tr>
          </thead>
          <tbody>
            {POKEMON_ALL.map((pokemon, i) => (
              <tr
                className="border-b dark:border-none odd:bg-slate-50 even:bg-white dark:odd:bg-slate-700 dark:even:bg-slate-800 dark:text-slate-300"
                key={i}
              >
                <td className="p-2 px-4 text-right">
                  <a
                    className="text-blue-500 underline hover:text-blue-700"
                    href={`https://yakkun.com/sv/zukan/${pokemon.yakkuncom_id}`}
                  >
                    {pokemon.yakkuncom_id}
                  </a>
                </td>
                <td className="p-2 px-4 text-left">{pokemon.yakkuncom_name}</td>
                <td className="p-2 px-4 text-right">
                  <a
                    className="text-blue-500 underline hover:text-blue-700"
                    href={`https://pokeapi.co/api/v2/pokemon/${pokemon.pokeapi_id}`}
                  >
                    {pokemon.pokeapi_id}
                  </a>
                </td>
                <td className="p-2 px-4 text-left">{pokemon.pokeapi_name}</td>
                <td className="p-2 px-4 text-left">
                  {pokemon.pokeapi_species_name_ja}
                </td>
                <td className="p-2 px-4 text-left">
                  {pokemon.pokeapi_form_name_ja}
                </td>
                <td className="p-2 px-4 text-right">
                  <a
                    className="text-blue-500 underline hover:text-blue-700"
                    href={`https://sv.pokedb.tokyo/pokemon/show/${pokemon.pokedbtokyo_id}`}
                  >
                    {pokemon.pokedbtokyo_id}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
