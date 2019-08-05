const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        password: String!
        createdAt: String!
        updatedAt: String!
    }

    type AuthData {
        userId: String!
        token: String!
    }

    input UserInputData {
        email: String!
        password: String!
    }

    type RootQuery  {
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createUser( userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);