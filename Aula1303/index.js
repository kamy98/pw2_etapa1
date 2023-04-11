//#region Modulos Externos
const chalk = require('chalk')
const inquirer = require('inquirer')
//#endregion

//#region Modulos Internos
const fs = require('fs')
//#endregion

operation()

//#region Operações Iniciais
function operation(){
    inquirer.prompt([
        {
            type:'list',
            name:'action',
            message:'O que deseja fazer?',
            choices:[
                'Criar conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        }
    ]).then((answer) =>{
        const action = answer['action']
        if(action === 'Criar conta'){
            console.log('Criando sua conta')
            createAccount()
        }else if(action === 'Consultar Saldo'){
            console.log('Consultando saldo')
            accountBalance()
        }else if(action === 'Depositar'){
            console.log('Depositando')
            deposit()
        }else if(action === 'Sacar'){
            console.log('Sacando')
            withdraw()
        }else if(action === 'Sair'){
            console.log(chalk.bgBlue.black('Obrigado por utilizar o Contas ETEC.'))
            setTimeout(() => {
                process.exit()
            }, 1500);
        }
    })
}
//#endregion

//#region Criação de Contas
function createAccount(){
    console.log(chalk.bgGreen.black('Parabéns por escolher o Banco ETEC'))
    console.log(chalk.green('Escolha as opções de conta:'))

    buildAccount()
}
function buildAccount(){
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
            buildAccount(accountName)
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`,
            '{"balance":0, "limit":1000}',
            function (err){
                console.error(err)
            }
        )

        console.info(chalk.green('Parabéns, sua conta está pronta!'))
        operation()
    })
}
//#endregion

//#region Depositar na Conta
function deposit(){
    inquirer.prompt([
        {
            name:'accountName',
            message:'Para qual conta irá o depósito?'
        }
    ]).then((answer) => {
        const accountName =answer['accountName']
        if(!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name:'amount',
                message: 'Quanto você deseja depositar?'
            }
        ]).then((answer) =>{
            const amount = answer['amount']
            addAmount(accountName, amount)
            console.log(chalk.bgYellow.green('Sucesso! Seu montante foi depositado.'))
            setTimeout(() => {
                operation()
            }, 1000);
        })
    })
}
function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não existe.'))
        return false
    }
    return true
}
function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Erro de montante!'))
        return deposit()
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
}
function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,
    {
        encoding:'utf8',
        flag:'r'
    })
    return JSON.parse(accountJSON)
}
//#endregion

//#region Consultar Saldo
function accountBalance(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual conta deseja verificar o saldo?'
        }
    ]).then((answer) =>{
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return accountBalance()
        }
        const accountData = getAccount(accountName)
        if(accountData.balance>0){
            console.log(chalk.green(`O saldo da conta: R$ ${accountData.balance}.`))
        }else{
            console.log(chalk.red(`O saldo da conta: R$ ${accountData.balance}.`))
        }
        setTimeout(() => {
           operation() 
        }, 1000)
    })
}
//#endregion

//#region Saque na Conta
function withdraw(){
    inquirer.prompt([
        {
            name:'accountName',
            message: 'Qual conta efetuará o saque?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto deseja sacar?'
            }
        ]).then((answer) =>{
            const amount = answer['amount']

            removeAmount(accountName, amount)
            operation()
        })
    })
}

function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('O valor precisa ser informado!'))
        return withdraw()
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
}
//#endregion
