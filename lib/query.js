const _ = require('lodash');
const Platform = require('./types/platform');
const Account = require('./types/account');
const DestinyApi = require('destiny-api-client');

class Query {

    constructor(destinyClient) {
        this.destiny = destinyClient || new DestinyApi(process.env.DESTINY_API_KEY);
    }

    player(source, args, context) {
        return this.destiny.searchPlayer({
            displayName: source.username,
            membershipType: (source.platform) ? Platform.platformToMembership(source.platform) : Platform.ALL
        })
        .then(response => {
            return (response.length == 1)
                ? new Account(response[0], this.destiny)
                : null;
        })
    }

}

module.exports = Query;
