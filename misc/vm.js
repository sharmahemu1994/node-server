/**
 * this is an example vm 
 * running some arbitrary scripts
 */

const vm =  require('vm');

// define a context

const context = {
    i : 0
}

const script = new vm.Script(`
    var foo = 5 * 2;
    bar = foo + 1;
    
    i++;
`);

script.runInNewContext(context);
console.log(context);
script.runInContext(context);
console.log(context);