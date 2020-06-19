import { selectCamp, selectTransactionsForPdf } from "./storeNewTransaction"

async function createPdf() {

    const camp = await selectCamp();
    //console.log(camp.rows.item(0));
    const { name, soldeInitial, solde } = camp.rows.item(0);

    const transactions = await selectTransactionsForPdf();
    //console.log(transactions);
    let html = `<style>
    .transa {
        display: flex;
        flex-direction:row;
        height:10cm;
    }
    .box {
        flex:1;
      }
      .boxImage {
        flex:1;
        margin:auto;
      }
    .transaTitle {
        height:2cm;
        text-align: center;
    }
    .pres {
        height:3cm;
        text-align: center;
        padding-top:1.5cm
    }
    .soldeIni {
        height:2cm;
    }
    .divider {
        height:1px;
        background-color:black;
        width:100%;
        margin:auto;
        margin-top:5px
    }
    .divider2 {
        height:4px;
        background-color:black;
        width:50%;
        margin:auto;
        margin-top:60px;
        margin-bottom:60px;
    }
    .infoTransa1 {
        height:2cm;
    }
    .infoTransa2 {
        height:6cm; 
        box-sizing: border-box;
        width: 90%;
        border: solid black 1px;
        padding-left: 2cm;
        padding-top:1.6cm
     }
    .infoTransa3 {
        height:2cm;
    }
    </style>
    <html>
    <div class="pres">
        <h1>Comptabilité ${name}</h1>
    </div> 
    <div class="soldeIni">
    <table style="width: 248px;"cellpadding="3">
    <tbody>
    <tr>
    <td style="width: 127px;">Solde initial: </td>
    <td style="width: 120px;">CHF ${soldeInitial}.-</td>
    </tr>
    <tr>
    <td style="width: 127px;">Solde final: </td>
    <td style="width: 120px;">CHF ${solde} .-</td>
    </tr>
    </tbody>
    </table>
    <div class="divider"></div>
    </div>
    <div class="transaTitle"><h2>Liste des transactions</h2></div>
    `

    let soldeHisto=soldeInitial;
    for (let i = 0; i < transactions.length; i++) {
        let soldeCalc;
        if(transactions[i].typeTransaction === 1){
            soldeCalc =soldeHisto/1+transactions[i].montant/1;
        }else{
            soldeCalc =soldeHisto-transactions[i].montant;
        }
        const dateFormat = new Date(transactions[i].date).toLocaleDateString();
        
        let transa = `
                <div class="transa">
                    <div class="box">
                        <div class="infoTransa1">
                            <p>Solde actuel: ${soldeHisto}</p>
                        </div>
                        <div class="infoTransa2">
                        <table style="width: 335px;" cellpadding="3">
                            <tbody>
                            <tr>
                            <td style="width: 88px;">Description</td>
                            <td style="width: 222px;">${transactions[i].name}</td>
                            </tr>
                            <tr>
                            <td style="width: 88px;">Date</td>
                            <td style="width: 222px;">${dateFormat}</td>
                            </tr>
                            <tr>
                            <td style="width: 88px;">Montant:</td>
                            <td style="width: 222px;">${transactions[i].typeTransaction === 0 ? 'Débit' : 'Crédit'} de ${transactions[i].montant} CHF</td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                        <div class="infoTransa3">
                            <p>Solde après transaction: ${soldeCalc}</p>
                        </div>          
                    </div>
                    <div class="boxImage">
                        <img style="height:350px" src="data:image/png;base64, ${transactions[i].image}" />
                    </div>
                </div>
                <div class="divider2"></div>
            `
            soldeHisto = soldeCalc;
        html = html + transa;
    }

    html.concat('', '</html>')

    return html;

}


export { createPdf }