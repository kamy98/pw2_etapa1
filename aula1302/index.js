const chalk = require("chalk")
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
})
readline.question("Qaul sua linguagem em mano?: ", (linguagem) => {
    console.log(chalk.magentaBright("Já sei, a sua é: ") + linguagem)
    readline.close()
}) 
