const chalk = require("chalk")
const calculadora = require("./calculadora")
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
})
var aluno = calculadora.media(7, 7, 8, 10)
if (aluno >= 6) {
    console.log(chalk.green("O aluno foi aprovado") + chalk.black.bgGreen(aluno))

} else if (aluno >= 5) {
    console.log(chalk.yellow("O aluno esta de recuperação") + chalk.black.bgYellow(aluno))

} else {
    console.log(chalk.red("O aluno foi reprovado") + chalk.black.bgRed(aluno))
}