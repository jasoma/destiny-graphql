const { graphql, buildSchema } = require('graphql');
const _ = require('lodash');
const fs = require('fs');
const Query = require('./lib/query');
const DestinyApi = require('destiny-api-client');

let schema = buildSchema(fs.readFileSync('schema.gql', 'utf-8'));
let destiny = new DestinyApi(process.env.API_KEY);

let root = {
    search(source, args, context) {
        let selections = context.fieldNodes[0].selectionSet.selections;
        let accountFields = _.map(selections, 'name.value');
        return Query.search(source, accountFields);
    },
    account(source, args, context) {
        console.log(args);
        return { username: 'strombane' };
    }
}

graphql(schema, `{
    search(username: "strombane", platform: PSN) {
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
}`, root).then(r => console.log(JSON.stringify(r,null,2)));
