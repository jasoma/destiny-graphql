const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const { PlatformSchema } = require('./types/platform');
const { AccountSchema, AccountResolver } = require('./types/account');
const { CharacterSchema, CharacterResolver } = require('./types/character');
const { QuerySchema, QueryResolver } = require('./types/query');

let Schema = `
    schema {
        query: Query
    }
`;

let schema = makeExecutableSchema({
    typeDefs: [Schema, QuerySchema, AccountSchema, CharacterSchema],
    resolvers: merge(QueryResolver, AccountResolver, CharacterResolver)
});

module.exports = schema;

