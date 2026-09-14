import * as readline from "node:readline";

const message: string = "Oh right, I know how to do this.";

console.log(message);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function printSomething(input: string): void {
    console.log("You said: " + input);
}

rl.question("Say something: ", (answer: string) => {
    printSomething(answer);
    rl.close();
})