const {exec} = require("child_process");

function runCommand(command) {
    console.log(command);
    let exec = require('child_process').execSync;
    try {
        exec(command);
    } catch (err) {
        console.log(err);
        if (err.toString().includes("incorrect password")) return -1;
    }
    return 0;
}

let out = runCommand(`unzip -P "" /Users/scottsmith/Desktop/未命名.mdz -d /Users/scottsmith/Desktop`, () => 0);
console.log(out);
