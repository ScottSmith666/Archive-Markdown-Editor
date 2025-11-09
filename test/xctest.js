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

let out = runCommand(`/Volumes/Execute/Files/project/archive_markdown_editor/libs/third_party/7-Zip/arm64/darwin/7zz x /Users/scottsmith/Desktop/tst/Large12.mdz -r -o/Users/scottsmith/Desktop/tst/._mdz_content.Large12 -p12 -mmt=4 -y`, () => 0);
console.log(out);
