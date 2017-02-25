const _ = require('lodash');

function pascalCase(name) {
    return _.upperFirst(_.camelCase(name));
}

class Equipment {

    constructor(apiData) {
        this.apiData = apiData;
    }

    item(manifest, lang) {
        if (!this.apiData.itemName) {
            return manifest.get('DestinyInventoryItemDefinition', this.ref, lang)
                .then(data => _.merge(this.apiData, data));
        }
        return Promise.resolve(this.apiData);
    }

    bucket(manifest, lang) {
        if (!this.bucket) {
            return manifest.get('DestinyInventoryBucketDefinition', this.apiData.bucketTypeHash, lang)
                .then(data => {
                    this.bucket = data;
                    return data
                });
        }
        return Promise.resolve(this.bucket);
    }

    get id() { return this.apiData.itemId; }

    get ref() { return this.apiData.itemHash; }

    name(source, args, context) {
        return item(context.manifest, context.lang);
    }

    type(source, args, context) {
        return item(context.manifest, context.lang)
            .then(item => bucket(context.manifest, context.lang))
            .then(bucket => pascalCase(bucket.bucketName))
    }

}

module.exports = Equipment;
