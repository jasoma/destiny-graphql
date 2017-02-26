const _ = require('lodash');

const classes = ['Titan', 'Hunter', 'Warlock'];
const genders = ['Male', 'Female'];
const races = {
    2803282938: 'Awoken',
    3887404748: 'Human',
    898834093: 'Exo'
};

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
        #equipment: [Equipment!]!
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
        stats({ characterBase }) {
            return {
                agility: characterBase.stats.STAT_AGILITY.value,
                armor: characterBase.stats.STAT_ARMOR.value,
                recovery: characterBase.stats.STAT_RECOVERY.value,
                intellect: characterBase.stats.STAT_INTELLECT.value,
                discipline: characterBase.stats.STAT_DISCIPLINE.value,
                strength: characterBase.stats.STAT_STRENGTH.value
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
        }
    }
}

module.exports = { CharacterSchema: () => [CharacterSchema], CharacterResolver };
