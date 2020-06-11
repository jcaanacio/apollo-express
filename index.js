const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

// Some fake data
const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: "J.K. Rowling",
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton",
  },
];

const users = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "test@gmail.com",
  },
  {
    id: 2,
    name: "Antonio Guevarra",
    email: "tes2t@gmail.com",
  },
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { books: [Book],users: [User], user(id: ID!,name: String!):User}
  type Book { title: String, author: String }
  type User { id: ID! ,name: String, email: String }
`;
// The resolvers
const resolvers = {
  Query: {
    books: () => books,
    users: () => users,
    user(parent, args, context, info) {
      const test = users.find((user) => {
        const { id, name } = args;
        return user.id == args.id && user.name == name;
      });
      console.log(test);
      return users.find((user) => user.id == args.id);
    },
    // userName(parent, args, context, info) {
    //   return users.find((user) => user.name == args.name);
    // },
  },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Start the server
app.listen(3000, () => {
  console.log("Go to http://localhost:3000/graphiql to run queries!");
});
