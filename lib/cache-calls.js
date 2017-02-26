const { uniq, reject, filter, concat, includes, isFunction, wrap } = require('lodash');

function ownProps(object) {
    return Object.getOwnPropertyNames(object);
}

function proto(object) {
    return Object.getPrototypeOf(object);
}

/**
 * Get all property names of an object.
 */
function allProps(object) {
    return concat(ownProps(object), ownProps(proto(object)));
}

/**
 * Property names to exclude when doing method searches.
 */
let excluded = concat(
    ownProps(proto(Object)),
    ownProps(proto({}))
);

/**
 * Finds all the user defined functions/methods on an object. Works for classes
 * as well as regular objects with function properties.
 *
 * @param {object} object - the object to pull methods from.
 * @returns {function[]} - an array containing the functions from the object.
 */
function methods(object) {
    let all = allProps(object);
    all = reject(all, name => includes(excluded, name));
    all = filter(all, name => isFunction(object[name]));
    return all.map(name => object[name]);
}

/**
 * Call a function only if no results exist in a cache for the function name
 * and arguments.
 *
 * @param {function} original - the function to call on a cache miss.
 * @param {object} self - the object to use as 'this' in the function call.
 * @param {array} args - an array of arguments to invoke the function with.
 * @param {object} cache - an object containing the results of previous calls.
 * @return the results from cache or from the function call.
 */
function callCached(original, self, args, cache) {
    console.log('calling cached ' + original.name);
    let key = `${original.name}(${JSON.stringify(args)})`;
    console.log('cache keyed on args: ' + key);
    let existing = cache[key];

    if (existing) {
        console.log('exists: ' + existing);
        return existing;
    }

    console.log('executing');
    let result = original.apply(self, args);
    cache[key] = result;
    return result;
}

/**
 * Wraps all functions/methods of an object with {@link callCached} and returns
 * a new object containing the cached functions.
 *
 * @param {object} object - the object whose methods should be wrapped with a cache.
 * @param {boolean} deep - whether or not to make the wrapping 'deep' by overriding 'this'
 *                         during invocations so that it points back to the cached wrapper
 *                         instead of the original object.
 */
function wrapWithCache(object, deep = false) {
    let cache = {};
    let wrapper = {};
    for (let fn of methods(object)) {
        wrapper[fn.name] = wrap(fn, function(original) {
            let self = deep ? wrapper : object;
            return callCached(original, self, [...arguments].slice(1), cache);
        });
    }
    return wrapper;
}

module.exports = { methods, allProps, wrapWithCache };
