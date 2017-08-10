/**
 * JsLisp
 * @class
 */
function JsLisp() {

    // Private var for storing the initial default environment
    var _defaultEnv = null;

    /**
     * JS implementation for a few lisp special form methods
     */
    var _specialForms = {
        /**
         * let* lisp special form
         * @param {String[]} - Abstract Syntax Tree
         * @param {Environment} - Environment object
         */
        'let*': function (ast, env) {
            var letEnv = new Environment(env);
            var firstElem = ast[1];
            for (var i = 0; i < firstElem.length; i+=2) {
                letEnv.set(firstElem[i], this.evaluate(firstElem[i+1], letEnv));
            }
            return this.evaluate(ast[2], letEnv);
        },

        /**
         * define lisp special form
         * @param {String[]} - Abstract Syntax Tree
         * @param {Environment} - Environment object
         */
        'define': function (ast, env) {
            return env.set(ast[1], this.evaluate(ast[2], env));
        },

        /**
         * if lisp special form
         * @param {String[]} - Abstract Syntax Tree
         * @param {Environment} - Environment object
         */
        'if': function (ast, env) {
            return this.evaluate(ast[1], env) ? this.evaluate(ast[2], env) : this.evaluate(ast[3], env);
        }
    };

    /**
     * Parses a lisp statement and returns the result of tokenizing and parsing
     * @param input String to be parsed
     * @returns {String[]} Abstract Syntax Tree Array for the given statement
     * @function
     * @public
     */
    this.parse = function (input) {
        var tokenizedString = input.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(/\s+/);
        if(tokenizedString.length === 0) {
            return ("ERR: Invalid command\n");
        } else {
            return _parseTokens(tokenizedString);
        }
    }

    /**
     * Evaluates a given abstract syntax tree and returns the result
     * @param {String[]} - Abstract Syntax Tree
     * @param {Environment} [env=default environment] - Environment object
     * @returns {Object} Output
     * @function
     * @public
     */
    this.evaluate = function (ast, env) {
        if (!env) {
            env = _defaultEnv;
        }
        if(Array.isArray(ast)) {
            return _evaluateList.call(this, ast, env);
        } else if(ast instanceof Symbol) {
            return env.get(ast);
        } else {
            return ast;
        }
    }

    /**
     * Evaluates a given list and returns the result
     * @param {String[]} - Abstract Syntaxt Tree for the List
     * @param {Environment} - Environment object
     * @returns {Object} Result of evaluation
     * @function
     * @private
     */
    var _evaluateList = function (ast, env) {
        if (ast.length > 0 && ast[0].name in _specialForms) {
            return _specialForms[ast[0].name].call(this, ast, env);
        } else {
            var self = this;
            var list = ast.map(function (a) {
                return self.evaluate(a, env);
            });
            var firstElem = list[0];
            if (firstElem instanceof Function) {
                return firstElem.apply(firstElem, list.slice(1));
            } else {
                return list;
            }
        }
    }

    /**
     * Read and convert atomic variables to their appropriate JS equivalents
     * @function
     * @private
     */
    var _readAtom = function (token) {
        if (!Number.isNaN(Number(token))) {
            // Number
            return Number(token);
        } else if (token.match(/^"[^"'\r\n]+"$/)) {
            // String - Starts and ends with double quotes
            return token.slice(1, -1);
        } else if (token === 't') {
            // true
            return true;
        } else if (token === 'nil') {
            // nil
            return false;
        } else {
            // If none of the above, create a symbol object to make it easy to identify later
            return new Symbol(token);
        }
    }

    /**
     * Parse tokens for the given tokenized string to create an Abstract Syntax Tree
     * @function
     * @private
     */
    var _parseTokens = function (tokens) {
        var token = tokens.shift();
        var parsedTokens = [];
        if (token === '(') {
            while (tokens[0] != ')') {
                if(!tokens[0]) {
                    return "ERR: Unexpected end of line\n";
                }
                parsedTokens.push(_parseTokens(tokens));
            }
            tokens.shift();
            return parsedTokens;
        } else if (token === ')') {
            return "ERR: Syntax error, mismatched paranthesis\n";
        } else {
            return _readAtom(token);
        }
    }

    /**
     * Initialize the default environment var, and add implementations for a basic operations
     * @function
     * @private
     */
    var _initEnv = function () {
        _defaultEnv = new Environment();
        _defaultEnv.set(new Symbol('+'), function(a, b) {
            return a + b;
        });
        _defaultEnv.set(new Symbol('-'), function(a, b) {
            return a - b;
        });
        _defaultEnv.set(new Symbol('*'), function(a, b) {
            return a * b;
        });
        _defaultEnv.set(new Symbol('/'), function(a, b) {
            return a / b;
        });
        _defaultEnv.set(new Symbol('>'), function(a, b) {
            return a > b;
        });
        _defaultEnv.set(new Symbol('<'), function(a, b) {
            return a < b;
        });
        _defaultEnv.set(new Symbol('='), function(a, b) {
            return a === b;
        });
        _defaultEnv.set(new Symbol('car'), function(a) {
            return a[0];
        });
        _defaultEnv.set(new Symbol('first'), _defaultEnv.get({name: 'car'}));
        _defaultEnv.set(new Symbol('cdr'), function(a) {
            return a.slice(1);
        });
        _defaultEnv.set(new Symbol('rest'), _defaultEnv.get({name: 'cdr'}));
    }

    // Call _initEnv the first time
    _initEnv();
}
