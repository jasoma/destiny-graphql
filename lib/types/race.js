"use strict";

// TODO: power this by the manifest instead of hard coding

const _ = require('lodash');

const races = [
    {hash: 2803282938, name: 'Awoken'},
    {hash: 3887404748, name: 'Human'},
    {hash: 898834093, name: 'Exo'}
];

function nameForHash(hash) {
    let race = _.find(races, r => r.hash == hash);
    return race ? race.name : null;
}

function hashForName(name) {
    let race = _.find(races, r => r.name == name);
    return race ? race.hash : null;
}

function race(value) {
    if (_.isString(value)) {
        return hashForName(value);
    }
    return nameForHash(value);
}

module.exports = race;
