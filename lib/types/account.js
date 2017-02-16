const _ = require('lodash');
const Platform = require('./platform');
const Character = require('./character');

class Account {

    constructor(apiData) {
        this.apiData = apiData;
    }

    get username() { return this.apiData.displayName; }

    get platform() { return Platform.membershipToPlatform(this.apiData.membershipType); }

    get id() { return this.apiData.membershipId; }

    get grimoireScore() { return this.apiData.grimoireScore; }

    characters(source, args, context) {
        return _.map(this.apiData.characters, data => new Character(data));
    }
}


module.exports = Account;
