const { graphql, buildSchema } = require('graphql');
const _ = require('lodash');
const fs = require('fs');
const Query = require('./lib/query');

let schema = buildSchema(fs.readFileSync('schema.gql', 'utf-8'));

graphql(schema, `{
    player(username: "strombane", platform: PSN) {
        id
        username
        platform
        grimoireScore
        characters {
            id
            class
            gender
            level
            light
            playTime
        }
    }
}`, new Query()).then(r => console.log(JSON.stringify(r,null,2)));
