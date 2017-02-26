const { merge } = require('lodash');
const { EquipmentSchema } = require('./equipment');

const classes = ['Titan', 'Hunter', 'Warlock'];
const genders = ['Male', 'Female'];
const races = {
    2803282938: 'Awoken',
    3887404748: 'Human',
    898834093: 'Exo'
};

function resolveItem(manifest, inventoryItem, lang) {
    return manifest.get('DestinyInventoryItemDefinition', inventoryItem.itemHash, lang)
        .then(definition => merge(inventoryItem, definition));
}

const CharacterSchema = `
    enum Race {
        Human,
        Awoken,
        Exo
    }

    enum Gender {
        Male,
        Female
    }

    enum Class {
        Titan
        Warlock
        Hunter
    }

    type CharacterStats {
        armor: Int!
        recovery: Int!
        agility: Int!
        intellect: Int!
        discipline: Int!
        strength: Int!
    }

    type Character {
        id: ID!
        class: Class!
        stats: CharacterStats!
        race: Race!
        gender: Gender!
        level: Int!
        light: Int!
        playTime: Int!
        equipment: [Equipment!]!
    }
`;

const CharacterResolver = {
    Character: {
        id({ characterBase }) {
            return characterBase.characterId;
        },
        class({ characterBase }) {
            return classes[characterBase.classType];
        },
        stats({ characterBase: { stats } }) {
            return {
                agility: stats.STAT_AGILITY.value,
                armor: stats.STAT_ARMOR.value,
                recovery: stats.STAT_RECOVERY.value,
                intellect: stats.STAT_INTELLECT.value,
                discipline: stats.STAT_DISCIPLINE.value,
                strength: stats.STAT_STRENGTH.value
            };
        },
        race({ characterBase }) {
            return races[characterBase.raceHash];
        },
        gender({ characterBase }) {
            return genders[characterBase.genderType];
        },
        level({ characterLevel }) {
            return characterLevel;
        },
        light({ characterBase }) {
            return characterBase.powerLevel;
        },
        playTime({ characterBase }) {
            return characterBase.minutesPlayedTotal;
        },
        equipment({ characterBase: { membershipId, membershipType, characterId }}, _, context) {
            return context.destiny.characterInventory({
                membershipType,
                destinyMembershipId: membershipId,
                characterId
            })
            .then(response => response.data.items.map(item => resolveItem(context.manifest, item, context.lang)));
        }
    }
}

module.exports = { CharacterSchema: () => [CharacterSchema, EquipmentSchema], CharacterResolver };
