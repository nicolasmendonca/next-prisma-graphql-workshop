import { gql, ApolloServer } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";
import { PageConfig } from "next";
import {
  AttackResolvers,
  PokemonResolvers,
  QueryResolvers,
} from "../../src/generated/graphql";

interface Context {
  prisma: PrismaClient;
}

const typeDefs = gql`
  type Attack {
    id: Int!
    name: String!
    pokemon: Pokemon
    pokemonId: Int!
  }

  type Pokemon {
    id: Int!
    name: String!
    attacks: [Attack!]
  }

  type Query {
    pokemonList: [Pokemon!]!
  }
`;

const Query: QueryResolvers = {
  pokemonList: (parent, args, context: Context) => {
    return context.prisma.pokemon.findMany();
  },
};

const Pokemon: PokemonResolvers = {
  attacks: (pokemon, args, context: Context) => {
    return context.prisma.attack.findMany({
      where: {
        pokemonId: pokemon.id,
      },
    });
  },
};

const Attack: AttackResolvers = {
  pokemon: async (attack, args, context: Context) => {
    return context.prisma.pokemon.findUnique({
      where: {
        id: attack.pokemonId,
      },
    });
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Pokemon,
    Attack,
  },
  context: {
    prisma: new PrismaClient(),
  },
});

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
