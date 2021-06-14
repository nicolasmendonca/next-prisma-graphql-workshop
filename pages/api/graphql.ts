import { gql, ApolloServer } from "apollo-server-micro";
import { PageConfig } from "next";
import { PrismaClient } from "@prisma/client";
import { QueryResolvers, PokemonResolvers } from "../../src/generated/graphql";

// GET /users -> [ { id, name }, { id, name } ]
// GET /users/1 -> [ { id, name }, { id, name } ]
// POST /users ->
// PUT /users/2 ->
// PATCH /users/2 -> {name}

const context = { prisma: new PrismaClient() };
type ContextType = typeof context;

const typeDefs = gql`
  type Attack {
    id: Int!
    name: String!
  }

  type Pokemon {
    id: Int!
    name: String!
    attacks: [Attack!]
  }

  type Query {
    sum(a: Int!, b: Int!): Int!
    pokemonList: [Pokemon!]!
  }
`;

const Pokemon: PokemonResolvers<ContextType> = {
  attacks: (pokemon, _, { prisma }) =>
    prisma.attack.findMany({
      where: {
        pokemonId: pokemon.id,
      },
    }),
};

const Query: QueryResolvers<ContextType> = {
  sum: (_, { a, b }) => a + b,
  pokemonList: (_parent, _args, { prisma }) => prisma.pokemon.findMany(),
};

const apolloServer = new ApolloServer({
  context,
  typeDefs,
  resolvers: {
    Query,
    Pokemon,
  },
});

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: "/api/graphql",
});
