const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs')

module.exports = {

    operation() {
        inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'O que deseja fazer?',
                choices: [
                    'Criar conta',
                    'Consultar Saldo',
                    'Depositar',
                    'Sacar',
                    'Sair'
                ]
            }
        ]).then((answer) => {
            const action = answer['action']
            if (action === 'Criar conta') {
                console.log('Criando sua conta')
                this.createAccount()
            } else if (action === 'Consultar Saldo') {
                console.log('Consultando saldo')
                this.accountBalance()
            } else if (action === 'Depositar') {
                console.log('Depositando')
                this.deposit()
            } else if (action === 'Sacar') {
                console.log('Sacando')
                this.withdraw()
            } else if (action === 'Sair') {
                console.log(chalk.bgBlue.black('Obrigado por utilizar o Contas ETEC.'))
                setTimeout(() => {
                    process.exit()
                }, 1500);
            }
        })
    },

    createAccount(){
        console.log(chalk.bgGreen.black('Parabéns por escolher o Banco ETEC'))
        console.log(chalk.green('Escolha as opções de conta:'))
    
        this.buildAccount()
    },

    buildAccount(){
        inquirer.prompt([
            {
                name:'accountName',
                message:'Entre com nome da sua conta:'
            }
        ]).then((answer) => {
            console.info(answer['accountName'])
            const accountName = answer['accountName']
            if(!fs.existsSync('accounts')){
                fs.mkdirSync('accounts')
            }
    
            if(fs.existsSync(`accounts/${accountName}.json`)){
                console.log(
                    chalk.bgRed.black('Esta conta já existe!')
                )
                this.buildAccount(accountName)
            }
    
            fs.writeFileSync(
                `accounts/${accountName}.json`,
                '{"balance":0, "limit":1000}',
                function (err){
                    console.error(err)
                }
            )
    
            console.info(chalk.green('Parabéns, sua conta está pronta!'))
            this.operation()
        })
    }
}
