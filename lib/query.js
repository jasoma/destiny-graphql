const _ = require('lodash');
const Platform = require('./types/platform');
const Account = require('./types/account');
const DestinyApi = require('destiny-api-client');

let destiny = new DestinyApi(process.env.API_KEY);

class Query {

    static search(args, accountFields) {
        return destiny.searchPlayer({
            displayName: args.username,
            membershipType: Platform.searchPlatform(args.platform)
        })
        .then(response => {
            return destiny.accountSummary({
                membershipType: response[0].membershipType,
                destinyMembershipId: response[0].membershipId,
            })
        })
        .then(response => {
            let account = response.data;
            account.displayName = args.username;
            return new Account(account);
        });
    }

}

module.exports = Query;
