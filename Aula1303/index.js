//#region Modulos Externos 
const chalk = require('chalk')
const inquirer = require('inquirer')
//#endregion


//#region Modulos Internos
const fs = require('fs')
const {console} = require ('console')
//#endregion

operation()
//#region Operaçoes Inicias
function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que deseja Fazer',
            choices: [
                'Crian Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        }
    ]).then((answer) => {
        const action = answer['action']

        if (action === 'Criar Conta') {
            console.log('Criando Sua Conta')
            createAccount()

        } else if (action === 'Consultar Saldo') {
            console.log("Consultando Saldo")

        } else if (action === 'Depositar') {
            console.log('Depositando')

        } else if (action === 'Sacar') {
            console.log('Sacando')

        } else if (action === 'Sair') {
            console.log(chalk.bgBlue.white('Obrigado Por Ultilizar O Contas ETEC'))
            setTimeout(() => {
                process.exit()
            }, 1500);
        }
    })
}
//#endregion

//#region criacao de contas
function createAccount() {
    console.log(chalk.bgBlue.white("parabens por escolher esse banco"))
    console.log(chalk.green("escolha as opçoes de conta"))

    buildAccount()

}
function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'entre com nome da sua conta'
        }
    ]).then((answer) => {
        console.info(answer['accountName'])
        const accountName = answer['accountName']
        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }
        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(
                chalk.bgCyan.black('esta conta ja existe!')
            )
            buildAccount()
        }
        fs.writeFileSync(
            `accounts/${accountName}.json`,
            '("balance: 0")',
            function (err) {
                console.error(err)
            }

        )

        console.info(chalk.green("Parabens, sua conta esta pronta"))
        operation()
    })
}
//#endregion 