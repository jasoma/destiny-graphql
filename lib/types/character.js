"use strict";
const _ = require('lodash');
const Equipment = require('./equipment');
const races = require('./race');

const classes = ['Titan', 'Hunter', 'Warlock'];
const genders = ['Male', 'Female'];

class Character {

    constructor(apiData) {
        this.apiData = apiData;
    }

    get base() {
        return this.apiData.characterBase;
    }

    get id() { return this.base.characterId; }

    get class() { return classes[this.base.classType]; }

    get stats() {
        return {
            agility: this.base.stats.STAT_AGILITY.value,
            armor: this.base.stats.STAT_ARMOR.value,
            recovery: this.base.stats.STAT_RECOVERY.value,
            intellect: this.base.stats.STAT_INTELLECT.value,
            discipline: this.base.stats.STAT_DISCIPLINE.value,
            strength: this.base.stats.STAT_STRENGTH.value
        };
    }

    get race() { return races(this.base.raceHash); }

    get gender() { return genders[this.base.genderType]; }

    get level() { return this.apiData.characterLevel; }

    get light() { return this.base.powerLevel; }

    get playTime() { return this.base.minutesPlayedTotal; }

    equipment(source, args, context) {
        console.log(context);
        return context.destiny.characterInventory({
            membershipType: this.base.membershipType,
            destinyMembershipId: this.base.membershipId,
            characterId: this.id
        })
        .then(inventory => _.map(inventory.data.items, i => new Equipment(i)));
    }
}

module.exports = Character;
