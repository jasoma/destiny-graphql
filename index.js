const { graphql, buildSchema } = require('graphql');
const _ = require('lodash');
const fs = require('fs');
const Query = require('./lib/query');

let schema = buildSchema(fs.readFileSync('schema.gql', 'utf-8'));


// let DestinyApi = require('destiny-api-client');
// let destiny = new DestinyApi(process.env.DESTINY_API_KEY);
// destiny.searchPlayer({
//     membershipType: 2,
//     displayName: 'strombane'
// })
// .then(r => destiny.accountSummary({
//     membershipType: 2,
//     destinyMembershipId: r[0].membershipId
// }))
// // .then(r => {

// //     return destiny.characterSummary({
// //         destinyMembershipId: r.data.characters[0].characterBase.membershipId,
// //         membershipType: r.data.characters[0].characterBase.membershipType,
// //         characterId: r.data.characters[0].characterBase.characterId
// //     });
// // })
// .then(r => console.log(JSON.stringify(r, null, 2)))
// .catch(e => console.log(e));

graphql(schema, `{
    player(username: "strombane", platform: PSN) {
        id
        username
        platform
        grimoireScore
        characters {
            id
            class
            race
            gender
            level
            light
            playTime
        }
    }
}`, new Query()).then(r => console.log(JSON.stringify(r,null,2)));
