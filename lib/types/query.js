const _ = require('lodash');
const DestinyApi = require('destiny-api-client');
const { convert } = require('./platform');

const QuerySchema = `
    type Query {
        player(username: String!, platform: Platform) : Account
    }
`;

const QueryResolver = {
    Query: {
        player(source, { username, platform }, context) {
            return context.destiny.searchPlayer({
                displayName: username,
                membershipType: platform ? convert(platform) : 'ALL'
            })
            .then(response => {
                if (response.length != 1) {
                    return null;
                }
                return context.destiny.accountSummary({
                    membershipType: response[0].membershipType,
                    destinyMembershipId: response[0].membershipId
                });
            })
            .then(response => _.merge(response.data, { username }));
        }
    }
};

module.exports = { QuerySchema, QueryResolver };
