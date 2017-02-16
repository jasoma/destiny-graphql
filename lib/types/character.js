
const classes = ['Titan', 'Hunter', 'Warlock'];

const genders = ['Male', 'Female'];

class Character {

    constructor(apiData) {
        this.apiData = apiData;
    }

    get id() { return this.apiData.characterBase.characterId; }

    get class() { return classes[this.apiData.characterBase.classType]; }

    get gender() { return genders[this.apiData.characterBase.genderType]; }

    get level() { return this.apiData.characterLevel; }

    get light() { return this.apiData.characterBase.powerLevel; }

    get playTime() { return this.apiData.characterBase.minutesPlayedTotal; }

}

module.exports = Character;


// type Character {
//     id: ID!
//     class: Class!
//     # subclass: Subclass!
//     # stats: CharacterStats!
//     gender: Gender!
//     level: Int!
//     light: Int!
//     playTime: Int!
// }
