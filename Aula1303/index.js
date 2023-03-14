//#region Modulos Externos 
const chalk = require('chalk')
const inquirer = require('inquirer')
//#endregion


//#region Modulos Internos
const fs = require('fs')
//#endregion

operation()
//#region Operaçoes Inicias
function operation(){
    inquirer.prompt([
        {
            type:'list',
            name: 'action',
            message: 'O que deseja Fazer',
            choices:[
                'Crian Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        }
    ]).then((answer) =>{
        const action = answer['action']

        if(action === 'Criar Conta'){
            console.log('Criando Sua Conta')

        }else if(action === 'Consultar Saldo'){
            console.log("Consultando Saldo")

        }else if(action === 'Depositar'){
            console.log('Depositando')

        }else if(action === 'Sacar'){
            console.log('Sacando')

        }else if(action === 'Sair'){
            console.log(chalk.bgBlue.white('Obrigado Por Ultilizar O Contas ETEC'))
            setTimeout(() => {
                process.exit()
            }, 1500);
        }




    })
}
//#endregion
