import React from "react";
import { request } from "graphql-request";
import { GetServerSideProps } from "next";
import { Query } from "../src/generated/graphql";
interface HomePage {
  purchases: Number;
  payments: Number;
  pokemonList: Query["pokemonList"];
}

export default function Home() {
  const [data, setData] = React.useState<HomePage | string>("");
  React.useEffect(() => {
    request<HomePage>(
      "/api/graphql",
      `
        query HomePage {
          purchases: sum(a: 2, b: 7)
          payments: sum(a: 255, b: 234)
          pokemonList {
            id
            name
            attacks {
              id
              name
            }
          }
        }
        `
    ).then(setData);
  }, []);

  return (
    <div>
      <h2>Hola: {JSON.stringify(data)}</h2>
    </div>
  );
}
