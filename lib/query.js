const _ = require('lodash');
const Platform = require('./types/platform');
const Account = require('./types/account');
const DestinyApi = require('destiny-api-client');

class Query {

    player(source, args, context) {
        return context.destiny.searchPlayer({
            displayName: source.username,
            membershipType: (source.platform) ? Platform.platformToMembership(source.platform) : Platform.ALL
        })
        .then(response => {
            return (response.length == 1)
                ? new Account(response[0], context.destiny)
                : null;
        })
    }

}

module.exports = Query;
