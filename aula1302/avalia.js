const chalk = require("chalk")
module.exports = {
    mensagem(aluno){

        if(aluno >=6){
            console.log(chalk.green("O aluno foi Aprovado")+chalk.black.bgGreen(aluno))

        }else if(aluno >=5){
            console.log(chalk.yellow("O aluno esta de recuperação")+chalk.black.bgYellow(aluno))

        }else{
            console.log(chalk.red("O aluno esta de recuperação")+chalk.black.bgRed(aluno))
        }
    }
}