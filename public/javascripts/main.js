(function () {
    var _lisp = new JsLisp();
    var _errorColorString = "[[;#e55812;]";
    var _outputColorString = "[[;#efe7da;]";

    jQuery(function($, undefined) {
        // Attach terminal to #terminalContainer
        $('#terminalContainer').terminal(function(command) {
            if (command !== '') {
                try {
                    var parsedExpr = _lisp.parse(command);
                    var result = _lisp.evaluate(parsedExpr);
                    if (result !== undefined) {
                        if ((typeof result === "string") && (result.match(/^(ERR: )/))) {
                            // Error messages start with ERR:
                            this.echo(new String(_errorColorString + result + "]"));
                        } else {
                            // Output
                            this.echo(new String(_outputColorString + result + "]"));
                        }
                    }
                } catch(e) {
                    this.error(new String(e));
                }
            } else {
               this.echo('');
            }
        }, {
            greetings: "[[b;white;]Lisp Interpreter\n\n]",
            name: 'JsLispTerm',
            height: window.innerHeight,
            prompt: 'lisp> '
        });
    });
})();
