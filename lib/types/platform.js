const DestinyApi = require('destiny-api-client');

/**
 * Utility class for converting between Platform values in the GraphQL schema
 * and membership types in the Destiny API.
 */
class Platform {

    static get XBOX() { return 'XBOX'; }

    static get PSN() { return 'PSN'; }

    static get ALL() { return 'ALL'; }

    /**
     * Converts a platform to a membership type.
     */
    static platformToMembership(platform) {
        switch (platform) {
            case Platform.PSN: return DestinyApi.psn;
            case Platform.XBOX: return DestinyApi.xbox;
            default:
                throw new Error('Unsupported platform ' + platform);
        }
    }

    /**
     * Converts a membership type to a platform.
     */
    static membershipToPlatform(membershipType) {
        switch (membershipType) {
            case DestinyApi.psn: return Platform.PSN;
            case DestinyApi.xbox: return Platform.XBOX;
            default:
                throw new Error('Cannot convert unknown membership type ' + membershipType);
        }
    }
}

module.exports = Platform;
