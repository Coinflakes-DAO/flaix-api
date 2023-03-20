// Start apollo graphql server
import { ApolloServer } from '@apollo/server';
import fs from 'fs';

import { startStandaloneServer } from '@apollo/server/standalone';
import { db } from '../lib/db';

const typeDefs = '' + fs.readFileSync('src/schema.graphql');

const resolvers = {
  CallOption: {
    underlying: async (parent: any) => {
      return db.erc20Token.findUnique({
        where: { address: parent.underlying }
      });
    }
  },
  Query: {
    callOptions: () =>
      db.callOption.findMany({
        orderBy: { maturityTimestamp: 'desc' }
      })
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });
  console.log(`🚀  FLAIX API ready at: ${url}`);
}
main();
