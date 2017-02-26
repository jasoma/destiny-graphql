const _ = require('lodash');

const rarities = {
    1: 'Basic',
    2: 'Common',
    3: 'Uncommon',
    4: 'Rare',
    5: 'Legendary',
    6: 'Exotic'
};

function pascalCase(name) {
    return _.upperFirst(_.camelCase(name));
}

function equipmentType(manifest, bucketHash, lang) {
    return manifest.get('DestinyInventoryBucketDefinition', bucketHash, lang)
        .then(definition => pascalCase(definition.bucketName));
}

const EquipmentSchema = `
    enum Rarity {
        Basic
        Common
        Uncommon
        Rare
        Legendary
        Exotic
    }

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

    type Equipment {
        # the instance id of the item, the unique identifier for the item owned by this character
        id: ID!
        # the reference id of the item (it's hash) for looking up the base item in the manifest
        ref: ID!
        type: EquipmentType!
        name: String!
        description: String
        iconPath: String
    }
`;

const EquipmentResolver = {
    Equipment: {
        id({ itemHash }) {
            return itemHash;
        },
        ref({ itemId }) {
            return itemId;
        },
        type({ bucketHash }, _, context) {
            return equipmentType(context.manifest, bucketHash, context.lang)
                .then(name => name == 'Vehicle' ? 'Sparrow' : name);
        },
        name({ itemName }) {
            return itemName;
        },
        description({ itemDescription }) {
            return itemDescription;
        },
        iconPath({ icon, hasIcon }) {
            return hasIcon ? icon : null;
        }
    }
};

module.exports = { EquipmentSchema: () => [EquipmentSchema], EquipmentResolver };
