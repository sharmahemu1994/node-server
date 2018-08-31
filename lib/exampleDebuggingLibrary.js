/* 
*    Library that demonstrate something throwing when itsInit is called
*/

// creataing example container
const example = {};

example.init = () => {
    // error created intentionally 
    const bar = foo;
};

// exporting module
module.exports = example;