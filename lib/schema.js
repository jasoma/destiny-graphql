const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const { PlatformSchema } = require('./types/platform');
const { AccountSchema, AccountResolver } = require('./types/account');
const { QuerySchema, QueryResolver } = require('./types/query');

let Schema = `
    schema {
        query: Query
    }
`;

let schema = makeExecutableSchema({
    typeDefs: [Schema, PlatformSchema, AccountSchema, QuerySchema],
    resolvers: merge(QueryResolver, AccountResolver)
});

module.exports = schema;

