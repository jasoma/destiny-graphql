const _ = require('lodash');
const Promise = require('bluebird');
const Platform = require('./platform');
const Character = require('./character');

class Account {

    constructor(apiData, destinyClient) {
        this.apiData = apiData;
        this.destiny = destinyClient;
    }

    fetchSummary() {
        if (_.isUndefined(this.summary)) {
            this.summary = this.destiny.accountSummary({
                membershipType: this.apiData.membershipType,
                destinyMembershipId: this.apiData.membershipId
            })
            .then(response => _.merge(this.apiData, response.data));
        }
        return this.summary;
    }

    get(property) {
        let value = _.get(this.apiData, property);
        if (_.isUndefined(value)) {
            return this.fetchSummary()
                .then(() => this.get(property));

        }
        return value;
    }

    get username() { return this.get('displayName'); }

    get platform() { return Platform.membershipToPlatform(this.get('membershipType')); }

    get id() { return this.get('membershipId'); }

    get grimoireScore() { return this.get('grimoireScore'); }

    characters(source, args, context) {
        return Promise.resolve(this.get('characters'))
            .then(characters => _.map(characters, c => new Character(c, this.destiny)));
    }
}


module.exports = Account;
