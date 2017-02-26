const { upperFirst, camelCase } = require('lodash');

const EquipmentTypeSchema = `
    enum EquipmentType {
        PrimaryWeapons
        SpecialWeapons
        HeavyWeapons
        Ghost
        Helmet
        Gauntlets
        ChestArmor
        LegArmor
        ClassArmor
        Artifacts
        Emblems
        Shaders
        Sparrow
        SparrowHorn
        Ships
        Emotes
        Subclass
    }
`;

function pascalCase(name) {
    return upperFirst(camelCase(name));
}

/**
 * Resolve a bucketHash or bucketTypeHash to a EquipmentType name from the schema.
 * Note that this function will always search the manifest in english so the found
 * names match the schema.
 *
 * @param {ManifestAccessor} manifest - the manifest accessor.
 * @param {number} bucketHash - the hash id of the inventory bucket to convert to an equipment type.
 * @returns {Promise}
 */
function resolve(manifest, bucketHash) {
    return manifest.get('DestinyInventoryBucketDefinition', bucketHash, 'en')
        .then(definition => pascalCase(definition.bucketName))
        .then(name => name == 'Vehicle' ? 'Sparrow' : name);
}

module.exports = { EquipmentTypeSchema, resolve };
