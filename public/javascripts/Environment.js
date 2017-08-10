/**
 * Represents a symbol type.
 * @class
 */
var Symbol = function (value) {
    this.name = value;
};

/**
 * Represents an Environment/context variable
 * @class
 * @param {Object} [parent=null] - Parent for the environment object being created
 */
var Environment = function (parent) {
    this.data = {};
    this.parent = parent || null;
};

/**
 * Recursively find if a Symbol is present in the environment or its
 * parent and return the context if it is found
 * @param {Symbol} - Object to search for
 * @returns {Object} Context for the key
 * @function
 * @public
 */
Environment.prototype.find = function (key) {
    if (key.name in this.data) {
        return this;
    } else if(this.parent)  {
        return this.parent.find(key);
    } else {
        return null;
    }
};

/**
 * Save a symbol and it's corresponding function in the environment
 * @param {Symbol} - Object to save in the environment
 * @param {Function} - Corresponding Function
 * @returns {Function} Returns the same function that was passed in
 * @function
 * @public
 */
Environment.prototype.set = function (key, value) {
    this.data[key.name] = value;
    return value;
};

/**
 * Get the corresponding function for a given Symbol
 * @param {Symbol} - Object to get
 * @param {Function} - Corresponding function for the given object
 * @function
 * @public
 */
Environment.prototype.get = function (key) {
    var env = this.find(key);
    if (!env) {
        return ("ERR: Unable to find command " + key.name + "\n");
    } else {
        return env.data[key.name];
    }
};
