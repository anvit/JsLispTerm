var assert = require('assert');
var fs = require('fs');
var vm = require('vm');
var path = './public/javascripts/Environment.js';
var code = fs.readFileSync(path);
vm.runInThisContext(code);
path = './public/javascripts/JsLisp.js';
code = fs.readFileSync(path);
vm.runInThisContext(code);
var env = new Environment();
var lisp = new JsLisp();


describe('Environment', function() {
    describe('Symbol', function() {
        it('symbol should store value correctly', function() {
            var t = new Symbol("true");
            assert.equal("true", t.name);
        });
    });

    describe('Environment get and set', function() {
        it('Environment should be able to set and get values correctly', function() {
            var t = new Symbol("true");
            var f = new Symbol("nil");
            env.set(t,"This is true")
            env.set(f,"This is nil")
            assert.equal("This is true", env.get(t));
            assert.equal("This is nil", env.get(f));
        });
    });

    describe('Environment find', function() {
        it('Environment should be able to find values in parent', function() {
            var t = new Symbol("true");
            env.set(t,"This is true")
            var newEnv = new Environment(env);
            var anotherEnv = new Environment(newEnv);
            assert.equal("This is true", env.get(t));
            assert.equal("This is true", newEnv.get(t));
            assert.equal("This is true", anotherEnv.get(t));
        });
    });
});

describe('JsLisp', function() {
    describe('Numeric prefix operations', function() {
        it('(+ 2 4) should output 6', function() {
            var output = lisp.evaluate(lisp.parse("(+ 2 4)"));
            assert.equal(6, output);
        });
        it('(- 7 2) should output 5', function() {
            var output = lisp.evaluate(lisp.parse("(- 7 2)"));
            assert.equal(5, output);
        });
        it('(* 50 2) should output 100', function() {
            var output = lisp.evaluate(lisp.parse("(* 50 2)"));
            assert.equal(100, output);
        });
        it('(/ 50 2) should output 25`', function() {
            var output = lisp.evaluate(lisp.parse("(/ 50 2)"));
            assert.equal(25, output);
        });
        it('(+ (/ 10 2)(* 3 (- 8 4))) should output 17', function() {
            var output = lisp.evaluate(lisp.parse("(+ (/ 10 2)(* 3 (- 8 4)))"));
            assert.equal(17, output);
        });
    });

    describe('List operations', function() {
        it('(first ("a" "b" "c")) should output a', function() {
            var output = lisp.evaluate(lisp.parse("(first (\"a\" \"b\" \"c\"))"));
            assert.equal("a", output);
        });
        it('(rest ("a" "b" "c")) should output b,c', function() {
            var output = lisp.evaluate(lisp.parse("(rest (\"a\" \"b\" \"c\"))"));
            assert.equal("b,c", output);
        });
        it('(+ (/ 10 (car (2 3 4))) (* 2 3)) should output 11', function() {
            var output = lisp.evaluate(lisp.parse("(+ (/ 10 (car (2 3 4))) (* 2 3))"));
            assert.equal(11, output);
        });
    });

    describe('Special forms', function() {
        it('(let* (x 25) x) should output 25', function() {
            var output = lisp.evaluate(lisp.parse("(let* (x 25) x)"));
            assert.equal(25, output);
        });
        it('(if t "Hello" "How_Low") should output Hello', function() {
            var output = lisp.evaluate(lisp.parse("(if t \"Hello\" \"How_Low\")"));
            assert.equal("Hello", output);
        });
        it('(define be "Happy") should define be as Happy', function() {
            lisp.evaluate(lisp.parse("(define be \"Happy\")"));
            var output = lisp.evaluate(lisp.parse("be"));
            assert.equal("Happy", output);
        });
    });
});
