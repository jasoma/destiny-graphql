const _ = require('lodash');
const DestinyApi = require('destiny-api-client');

const PlatformSchema = `
    enum Platform {
        PSN
        XBOX
    }
`;

function convert(value) {
    if (_.isString(value)) {
        switch (value) {
            case 'XBOX': return DestinyApi.xbox;
            case 'PSN': return DestinyApi.psn;
            default:
                throw new Error('Platform ' + platform + ' is not in the schema');
        }
    }
    switch (value) {
        case DestinyApi.xbox: return 'XBOX';
        case DestinyApi.psn: return 'PSN';
        default:
            throw new Error('Cannot convert unknown membership type ' + membershipType);
    }
}

module.exports = { PlatformSchema, convert };
