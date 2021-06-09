import { ApolloServer, gql } from 'apollo-server-micro'
import { PrismaClient } from '@prisma/client'

const typeDefs = gql`

  type Attack {
    id: String!
    name: String!
    pokemon: Pokemon!
    damage: Int
  }

  type Pokemon {
    id: String!
    name: String!
    attacks: [Attack!]!
  }

  type Query {
    pokemonList: [Pokemon!]!
  }
`

const resolvers = {
  Query: {
    pokemonList: (parent, request, context) => {
      /** @type {PrismaClient} */
      const prismaClient = context.prisma;
      return prismaClient.pokemon.findMany({
        include: {
          attacks: true
        }
      })
    }
  },
  Pokemon: {
    attacks: (parent, request, context) => {
      /** @type {PrismaClient} */
      const prismaClient = context.prisma;
      return prismaClient.attack.findMany({
        where: {
          pokemonId: parent.id
        }
      })
    }
  },
  Attack: {
    damage: (parent, request, context) => {
      return parent.damage ?? 0
    },
    pokemon: (parent, request, context) => {
      /** @type {PrismaClient} */
      const prismaClient = context.prisma;
      return prismaClient.pokemon.findUnique({
        where: {
          id: parent.id
        }
      })
    }
  }
}

const context = {
  prisma: new PrismaClient()
}

const apolloServer = new ApolloServer({ typeDefs, resolvers, context })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' })
