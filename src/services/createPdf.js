import {selectCamp, selectTransactionsForPdf} from "./storeNewTransaction"

async function createPdf(){

    const camp = await selectCamp();
    console.log(camp.rows.item(0));
    const {name, soldeInitial} = camp.rows.item(0);

    const transactions = await selectTransactionsForPdf();
    //console.log(transactions);
    let html = `<style>
    @page {
      margin: 20px;
    }
    .transa {
        display: flex;
        flex-direction:row;
        height:300px
    }
    .box {
        flex:1
      }
      .boxImage {
        flex:1;
        margin:auto;
      }
    .title {

    }
    .pres {
        height:205px;
        padding-top:50px;
        text-align: center;
    }
    </style>
    <html>
    <div class="pres">
        <h1>Nom du camp: ${name}</h1>
        <h2>Solde initial: ${soldeInitial}</h2>
    </div> 
    `
    
    
    for(let i =0;i<transactions.length;i++){

        const dateFormat = new Date(transactions[i].date).toLocaleDateString();
        console.log(transactions[i].name);
        let transa = `
                <div class="transa">
                    <div class="box">
                        <h3>${transactions[i].name}<h3>
                        <p>Date transaction: ${dateFormat} </p>
                        <p>Montant: ${transactions[i].typeTransaction === 0 ? 'Débit' : 'Crédit'} de ${transactions[i].montant} CHF</p>
                    </div>
                    <div class="boxImage">
                        <img style="height:250px" src="data:image/png;base64, ${transactions[i].image}" />
                    </div>
                </div>
            `
        html = html + transa;
    }

    html.concat('', '</html>')
    
    return html;

}


export {createPdf}