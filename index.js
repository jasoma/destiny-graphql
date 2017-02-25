const { graphql, buildSchema } = require('graphql');
const _ = require('lodash');
const fs = require('fs');
const Query = require('./lib/query');
const FileManifest = require('./lib/file-manifest');
const DestinyApi = require('destiny-api-client');

let schema = buildSchema(fs.readFileSync('schema.gql', 'utf-8'));
let manifest = new FileManifest();
let destiny = new DestinyApi(process.env.DESTINY_API_KEY);
let query = new Query();

function run(ql) {
    return graphql(schema, ql, {
        player(source, args, context) {
            context.destiny = destiny;
            context.manifest = manifest;
            context.lang = 'en';
            return query.player(source, args, context);
        }
    });
}

run(`{
    player(username: "strombane", platform: PSN) {
        id
        username
        platform
        grimoireScore
        characters {
            id
            class
            stats {
                armor
                recovery
                agility
                intellect
                discipline
                strength
            }
            race
            gender
            level
            light
            playTime
            equipment {
                name
                type
            }
        }
    }
}`).then(r => console.log(JSON.stringify(r,null,2)));
