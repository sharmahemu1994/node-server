/**
 * Cli Related Tasks
 * 
*/

// Dependencies
const readLine = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
const os = require('os');
const v8 = require('v8');
class _events extends events{};
const e = new _events();

// instantiate cli module
const cli = {};

// input handlers
e.on('man', () => {
    cli.responders.help();
});

// input handlers
e.on('help', () => {
    cli.responders.help();
});

// input handlers
e.on('exit', () => {
    process.exit(0);
});

// input handlers
e.on('stats', () => {
    cli.responders.stats();
});

// responders
cli.responders = {};

cli.responders.help = () => {
    const commands = {
        'man': 'Show the help page',
        'help': 'Alies of `man` command',
        'exit': 'kill and the rest of application',
        'stats': 'Get stats of underline operating system and resourse utlisation'
    }
    // show header for the help page
    cli.horizontalLine();
    cli.centered('cli manual');
    cli.horizontalLine();
    cli.verticalSpace(2);

    for (let key in commands) {
        if (commands.hasOwnProperty(key)) {
            const value = commands[key];
            let line = key;
            const padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
        }
    }

    cli.verticalSpace(2);
    cli.horizontalLine();
}

cli.responders.stats = () => {
    let stats = {
        'Load Average': os.loadavg().join(' '),
        'Cpu Count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size)*100),
        'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'Uptime': os.uptime()

    }
    // show header for the help page
    cli.horizontalLine();
    cli.centered('cli manual');
    cli.horizontalLine();
    cli.verticalSpace(2);

    for (let key in stats) {
        if (stats.hasOwnProperty(key)) {
            const value = stats[key];
            let line = key;
            const padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
        }
    }

    cli.verticalSpace(2);
    cli.horizontalLine();
}

cli.horizontalLine = () => {
    const width = process.stdout.columns;
    let line = ''
    for (let i = 0; i < width; i++) {
        line += '-';
    }
    console.log(line);
};

cli.centered = (str) => {
    lines = typeof (str) === 'string' && str.trim().length > 0 ? str : false;
    const width = process.stdout.columns;
    // calculate left padding
    const leftPadding = Math.floor((width - str.length) / 2);
    // put left padding before string
    let line = ''
    for (let i = 0; i < leftPadding; i++) {
        line += ' ';
    }
    line += str;
    console.log(line);
};

cli.verticalSpace = (lines) => {
    lines = typeof (lines) === 'number' && lines > 0 ? lines : false;
    if (lines) {
        for (let i = 0; i < lines; i++) {
            console.log('');
        }
    }
};

cli.inputPrcessor = (string) => {
    string = typeof (string) === 'string' && string.trim().length > 0 ? string : false;
    // only want to process input user actually has written
    if (string) {
        // codify the unique string
        const uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats'
        ]
        // check user input matches the uniqueInputs
        let matchFound = 0;
        let counter = 0;
        uniqueInputs.some((input) => {
            if (string.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // emit an input matching uniqueInputs and include full string
                e.emit(input, string);
                return true
            }
        });

        // if no match found tell the user to try again
        if (!matchFound) {
            console.log('Sorry! try again');
        }
    }
}

cli.init = () => {
    console.log('CLI is running');

    // start the interface
    const _interface = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
    });
    // create initial prompt
    _interface.prompt();

    // handle each line seprately
    _interface.on('line', (str) => {
        cli.inputPrcessor(str);
        // re initialise the prompt
        _interface.prompt();
    });

    // if the user stops the cli
    _interface.on('close', () => {
        process.exit(0);
    });
};

module.exports = cli;
