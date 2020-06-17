import { selectCamp, selectTransactionsForPdf } from "./storeNewTransaction"

async function createPdf() {

    const camp = await selectCamp();
    console.log(camp.rows.item(0));
    const { name, soldeInitial, solde } = camp.rows.item(0);

    const transactions = await selectTransactionsForPdf();
    //console.log(transactions);
    let html = `<style>
    @page {
      margin: 20px;
    }
    .transa {
        display: flex;
        flex-direction:row;
        height:250px
    }
    .box {
        flex:1;
      }
      .boxImage {
        flex:1;
        margin:auto;
      }
    .transaTitle {
        height:50px;
        text-align: center;
    }
    .pres {
        height:120px;
        margin-top:50px;
        text-align: center;
    }
    .soldeIni {
        height:80px;
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
        margin-top:30px;
        margin-bottom:30px;
    }
    .infoTransa1 {
        height:50px;
    }
    .infoTransa2 {
        height:125px; 
        box-sizing: border-box;
        width: 90%;
        border: solid black 1px;
        padding-left: 15px;
        padding-top:20px
     }
    .infoTransa3 {
        height:50px;
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

        const dateFormat = new Date(transactions[i].date).toLocaleDateString();
        let soldeCalc =soldeHisto-transactions[i].montant;
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
                        <img style="height:250px" src="data:image/png;base64, ${transactions[i].image}" />
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