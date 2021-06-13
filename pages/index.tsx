import React from "react";
import { request, gql } from "graphql-request";
import { Query } from "../src/generated/graphql";

interface IIndexPageProps {}

const IndexPage: React.FC<IIndexPageProps> = () => {
  const [pokemonList, setPokemonList] = React.useState<any>([]);

  React.useEffect(() => {
    const query = gql`
      {
        pokemonList {
          id
          name
          attacks {
            id
            name
          }
        }
      }
    `;
    request<Query>("/api/graphql", query).then(({ pokemonList: response }) => {
      setPokemonList(response);
    });
  }, []);
  return (
    <ul className="IndexPage">
      {pokemonList.map((pokemon) => (
        <li key={pokemon.id}>
          {pokemon.name} - {JSON.stringify(pokemon.attacks)}
        </li>
      ))}
    </ul>
  );
};

export default IndexPage;
