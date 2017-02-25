const { graphql } = require('graphql');
const FileManifest = require('./lib/file-manifest');
const DestinyApi = require('destiny-api-client');
const schema = require('./lib/schema');

let manifest = new FileManifest();
let destiny = new DestinyApi(process.env.DESTINY_API_KEY);

module.exports = function(query) {
    return graphql(schema, query, null, { destiny, manifest });
}
