"use strict";

const _ = require('lodash');
const fsp = require('fs-promise');
const promiseRetry = require('promise-retry');
const rimraf = require('rimraf');
const assert = require('assert');
const FileManifest = require('../lib/file-manifest');

let contentRoot = 'test-content/FileManifest';

/**
 * Build an options object to pass to the FileManifest constructor.
 */
function options(path, overrides) {
    return _.defaults(overrides, {
        langs: ['en'],
        path: contentRoot + path,
        apiKey: process.env.DESTINY_API_KEY
    });
}

/**
 * Retry a function returning a promise forever (until the test timeout stops us)
 * until the promise resolves without an error.
 */
function check(fn) {
    return promiseRetry((retry, attempt) => {
        return fn().catch(retry);
    }, {forever: true, minTimeout: 10, maxTimeout: 500});
}

/**
 * Check for the eventual existence of a file.
 */
function checkFileExists(path) {
    return check(() => {
        return fsp.exists(path)
            .then(result => {
                if (!result) throw new Error(path + ' was not found');
            });
    })
}

function globp(pattern) {
    return new Promise((resolve, reject) => {
        glob(pattern, (err, files) => {
            if (err) reject(err);
            else resolve(files);
        });
    });
}


describe('FileManifest', function() {

    before(() => {
        rimraf.sync(contentRoot);
    });

    it('should preload any languages passed in the constructor', () => {
        let opts = options('/preload-test');
        let manifest = new FileManifest(opts);
        return checkFileExists(opts.path + '/en.content.sqlite');
    });

    it('should download the manifest on demand', () => {
        let opts = options('/demand-test', {langs: []});
        let manifest = new FileManifest(opts);
        return manifest.get('DestinyActivityCategoryDefinition', 1025694749, 'en')
            .then(entry => assert.equal(1025694749, entry.hash));
    });

    it('should reuse existing manifest files', () => {
        let opts = options('/demand-test', {langs: []});
        let manifest = new FileManifest(opts);
        return fsp.exists(opts.path + '/en/raw/DestinyActivityCategoryDefinition/1025694749.json');
    });

    it('should fail if a bad table name is passed', done => {
        let opts = options('/demand-test', {langs: []});
        let manifest = new FileManifest(opts);
        manifest.get('NotATable', 777, 'en')
            .then(ok => done(new Error('returned ok for a bad table name')))
            .catch(err => done());
    });

    it('should fail if a bad id is passed', done => {
        let opts = options('/demand-test', {langs: []});
        let manifest = new FileManifest(opts);
        manifest.get('DestinyActivityCategoryDefinition', 777, 'en')
            .then(ok => done(new Error('returned ok for a bad id')))
            .catch(err => done());
    });

});
