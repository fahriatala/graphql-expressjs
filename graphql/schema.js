const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        password: String!
        createdAt: String!
        updatedAt: String!
    }

    type Product {
        _id: ID!
        name: String!
        price: Int!
        productImage: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type AuthData {
        userId: String!
        token: String!
    }

    type ProductData {
        products: [Product!]!
        totalProducts: Int!
    }

    input UserInputData {
        email: String!
        password: String!
    }

    input ProductInputData {
        name: String!
        price: Int!
        productImage: String!
    }

    type RootQuery  {
        login(email: String!, password: String!): AuthData!
        products(page: Int): ProductData!
    }

    type RootMutation {
        createUser( userInput: UserInputData): User!
        createProduct( productInput: ProductInputData): Product!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);