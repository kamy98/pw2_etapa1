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
    },

     deposit(){
        inquirer.prompt([
            {
                name:'accountName',
                message:'Para qual conta irá o depósito?'
            }
        ]).then((answer) => {
            const accountName =answer['accountName']
            if(!this.checkAccount(accountName)){
                return this.deposit()
            }
    
            inquirer.prompt([
                {
                    name:'amount',
                    message: 'Quanto você deseja depositar?'
                }
            ]).then((answer) =>{
                const amount = answer['amount']
                this.addAmount(accountName, amount)
                console.log(chalk.bgYellow.green('Sucesso! Seu montante foi depositado.'))
                setTimeout(() => {
                    this.operation()
                }, 1000);
            })
        })
    },

    checkAccount(accountName){
        if(!fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black('Esta conta não existe.'))
            return false
        }
        return true
    },

     addAmount(accountName, amount){
        const accountData = this.getAccount(accountName)
    
        if(!amount){
            console.log(chalk.bgRed.black('Erro de montante!'))
            return this.deposit()
        }
    
        accountData.balance = parseFloat(amount)+parseFloat(accountData.balance)
    
        fs.writeFileSync(
            `accounts/${accountName}.json`,
            JSON.stringify(accountData),
            function (err){
                console.log(err)
            }
        )
        console.log(chalk.green('Seu valor foi depositado!'))
    },

     getAccount(accountName){
        const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,
        {
            encoding:'utf8',
            flag:'r'
        })
        return JSON.parse(accountJSON)
    },

    accountBalance(){
        inquirer.prompt([
            {
                name: 'accountName',
                message: 'Qual conta deseja verificar o saldo?'
            }
        ]).then((answer) =>{
            const accountName = answer['accountName']
    
            if(!this.checkAccount(accountName)){
                return this.accountBalance()
            }
            const accountData = this.getAccount(accountName)
            if(accountData.balance>0){
                console.log(chalk.green(`O saldo da conta: R$ ${accountData.balance}.`))
            }else{
                console.log(chalk.red(`O saldo da conta: R$ ${accountData.balance}.`))
            }
            setTimeout(() => {
               this.operation() 
            }, 1000)
        })
    },

    withdraw(){
        inquirer.prompt([
            {
                name:'accountName',
                message: 'Qual conta efetuará o saque?'
            }
        ]).then((answer) => {
            const accountName = answer['accountName']
    
            if(!this.checkAccount(accountName)){
                return this.withdraw()
            }
    
            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Quanto deseja sacar?'
                }
            ]).then((answer) =>{
                const amount = answer['amount']
    
                this.removeAmount(accountName, amount)
                this.operation()
            })
        })
    },

     removeAmount(accountName, amount){
        const accountData = this.getAccount(accountName)
    
        if(!amount){
            console.log(chalk.bgRed.black('O valor precisa ser informado!'))
            return this.withdraw()
        }
        
        if(accountData.balance < amount){
            console.log(chalk.bgYellow.black('Entrou no cheque especial!'))
        }
    
        if((accountData.balance + accountData.limit)<amount){
            console.log(chalk.bgRed.black('Não há limite na conta!'))
            return
        }else{
            accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    
            fs.writeFileSync(
                `accounts/${accountName}.json`,
                JSON.stringify(accountData),
                function (err){
                    console.log(err)
                }
            )
        
            console.log(chalk.green(`Foi sacado: ${amount} da conta ${accountName}.`))
        }
    },

}
