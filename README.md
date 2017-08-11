# JS Lisp Terminal
This is a basic lisp interpreter in JavaScript. Currently only supports the following features:

* Lists, numbers, strings
* Basic arithmetic operations (Add, Subtract, Multiply, Divide, Greater/Less/Equals)
* List operations:
    * first/car
    * rest/cdr
* Special Forms:
    * Let*
    * If
    * Define

## Running the application
This is a *Node.js* based application. On a system which has it installed, execute:
```
npm install
npm run start
```
and visit localhost:3000/ to view it.
Tests can be run using:
```
npm test
```
## Known issues/limitations

* Uses basic JavaScript data types, thus it doesn't support large numbers that lisp supports using bignum.
* Doesn't support strings with spaces as of now.
* Doesn't support quote.

## Demo
Demo link: https://jslispterm.herokuapp.com/
