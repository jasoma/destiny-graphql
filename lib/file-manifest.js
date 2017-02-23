const _ = require('lodash');
const fs = require('fs');
const fsp = require('fs-promise');
const lru = require('lru-cache');
const rimraf = require('rimraf');
const extract = require('destiny-manifest-extractor');
const fileTree = require('destiny-manifest-extractor/file-tree');
const DestinyApi = require('destiny-api-client');

const defaultOptions = {
    langs: ['en'],
    path: 'data/destiny-manifest',
    apiKey: process.env.DESTINY_API_KEY,
    cacheSize: 3000
};

/**
 * Download and extract a manifest.
 *
 * @param {string} lang - the language code of the manifest content to download.
 * @param {string} path - the root path to extract the manifest to.
 * @param {string} apiKey - the api key for the destiny api.
 * @param {object} manifest - the manifest description from the api.
 */
function download(lang, path, apiKey, manifest) {
    let tree = fileTree(path, 1000);
    return manifest.then(m => extract({
        langs: [lang],
        path: path,
        apiKey: apiKey,
        processor: tree.processor
    }, m))
    .then(() => { return tree.waitDone() })
    .then(() => { return path });
}

/**
 * Check if a file exists.
 *
 * @param {string} path - the path to check the existence of.
 * @returns {Promise} - true if the path exists, false otherwise.
 */
function exists(path) {
    return fsp.exists(path, fs.constants.R_OK);
}

/**
 * Generate a cache key for a manifest item.
 *
 * @param {string} table - the name of the table the item is from.
 * @param {number|string} id - the id of the item.
 * @param {string} lang - the language code of the item content.
 */
function cacheKey(table, id, lang) {
    return [lang, table, id].join('.');
}

/**
 * A manifest accessor based on the destiny-manifest-extractor package that will
 * download the manifest database onto the local file system and expand it into
 * individual JSON files. When an item is requested from the manifest the corresponding
 * file is loaded into memory.
 */
class FileManifest {

    /**
     * @param {object} options
     * @param {string[]} [options.langs=['en']] - languages to preload.
     * @param {string} [options.path=data/destiny-manifest] - root path to extract files to.
     * @param {string} [options.apiKey=process.env.DESTINY_API_KEY] - api key for the destiny api.
     * @param {string} [options.cacheSize=3000] - How many individual items to maintain in memory.
     */
    constructor(options) {
        options = _.defaults(options, defaultOptions);
        options.processor = require('destiny-manifest-extractor/file-tree')(options.path);
        this.options = options;
        _.each(options.langs, l => this.manifest(l));
        this.cache = lru(options.cacheSize);
        this.destiny = new DestinyApi(options.apiKey);
    }

    /**
     * Download the latest manifest from the destiny api.
     *
     * @returns {object} - the api manifest description.
     */
    apiManifest() {
        if (!this._apiManifest) {
            this._apiManifest = this.destiny.manifest();
        }
        return this._apiManifest;
    }

    /**
     * Gets the root path to the expanded file tree of a manifest for a specific language.
     *
     * @param {string} lang - the language code of the manifest content to retrieve.
     * @returns {string} - the root path of the manifest files.
     */
    manifestPath(lang) {
        return this.options.path + '/' + lang;
    }

    /**
     * Download the manifest for a language if necessary.
     *
     * @param {string} lang - the language code of the manifest content to retrieve.
     * @returns {Promise} - the root path of the manifest files.
     */
    manifest(lang) {
        let path = this.manifestPath(lang);
        return exists(path)
            .then(exists => {
                return exists ? path : download(lang, this.options.path, this.options.apiKey, this.apiManifest());
            });
    }

    /**
     * Load an item from the manifest and store it in the local cache.
     *
     * @param {string} table - the name of the table the item is in.
     * @param {number|string} id - the id of the item in the table.
     * @param {string} lang - the language code of the manifest content to retrieve.
     * @param {string} key - the cache key to store the item in.
     * @returns {Promise} - the loaded item.
     */
    load(table, id, lang, key) {
        return this.manifest(lang)
            .then(dir => fsp.readFile(`${dir}/${lang}/${table}/${id}.json`, 'utf-8'))
            .then(content => {
                let data = JSON.parse(content);
                this.cache.set(key, data);
                return data;
            });
    }

    /**
     * Get a manifest item. First checks the cache loading the item from disk only if
     * there is a cache miss.
     *
     * @param {string} table - the name of the table the item is in.
     * @param {number|string} id - the id of the item in the table.
     * @param {string} lang - the language code of the manifest content to retrieve.
     * @returns {Promise} - the item.
     */
    get(table, id, lang = 'en') {
        let key = cacheKey(table, id, lang);
        let existing = this.cache.get(key);
        return existing
            ? Promise.resolve(existing)
            : this.load(table, id, lang, key);
    }

    /**
     * Reset the internal cache and delete all files on disk. This will force a new
     * manifest to be downloaded on the next access.
     */
    reset() {
        delete this._apiManifest;
        this.cache.reset();
        let fileClean = _.map(this.options.langs, l => rimraf(this.manfestPath(l)));
        return Promise.all(fileClean);
    }

}

module.exports = FileManifest;
