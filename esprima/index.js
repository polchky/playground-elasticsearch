var esprima = require('esprima');
var fs = require('fs');

var code = fs.readFileSync('businessObjectSpec.js');
var ast = esprima.parse(code);

function traverse(node, func) {
    func(node);//1
    for (var key in node) { //2
        if (node.hasOwnProperty(key)) { //3
            var child = node[key];
            if (typeof child === 'object' && child !== null) { //4

                if (Array.isArray(child)) {
                    child.forEach(function(node) { //5
                        traverse(node, func);
                    });
                } else {
                    traverse(child, func); //6
                }
            }
        }
    }
}

traverse(ast, function(node) {
    //console.log(node.type);
		if (/CallExpression/.test(node.type)) {
			if (node.callee.name === 'describe') {
				console.log("describe" + " " + node.arguments[0].raw);
			}
		}
});