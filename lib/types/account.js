const { PlatformSchema, convert } = require('./platform');
const { CharacterSchema } = require('./character');

const AccountSchema = `
    type Account {
        id: ID!
        username: String
        platform: Platform!
        grimoireScore: Int!
        characters: [Character!]!
    }
`;

const AccountResolver = {
    Account: {
        id({ membershipId }) {
            return membershipId;
        },
        platform({ membershipType }) {
            return convert(membershipType);
        }
    }
}

module.exports = { AccountSchema: () => [AccountSchema, PlatformSchema, CharacterSchema], AccountResolver }
