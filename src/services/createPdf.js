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
        height:10cm;
      }
      .boxImage {
        flex:1;
        height:10cm;
        margin:auto;
      }
    .transaTitle {
        height:3cm;
        text-align: center;
    }
    tbody {
        background-color: #e4f0f5;
    }
    table {
        border-collapse: collapse;
        border: 2px solid rgb(200, 200, 200);
        letter-spacing: 1px;
        font-family: sans-serif;
        font-size: .8rem;
    }
    td,
th {
    border: 1px solid rgb(190, 190, 190);
    padding: 5px 10px;
}
thead {
    background-color: #3f87a6;
    color: #fff;
}
td {
    text-align: center;
}
    .pres {
        height:15px;
        text-align: center;
        padding-top:1.5cm
    }
    .soldeIni {
        height:15px;
    }
    .divider2 {
        height:4px;
        background-color:black;
        width:50%;
        margin:auto;
    }
    .infoTransa1 {
        height:2cm;
    },
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
    <div style="height:800px">
    <table style="width: 1400px;margin-top:100px;">
    <thead>
        <tr>
            <th scope="col">Ticket</th>
            <th scope="col">Date</th>
            <th scope="col">Libellé</th>
            <th scope="col">Entrée</th>
            <th scope="col">Sortie</th>
            <th scope="col">Total</th>
        </tr>
    </thead>
    <tbody>
    <tr>
            <th scope="row" style="width: 50px;">-</th>
            <td style="width: 90px;">-</td>
            <td style="width: 700px;text-align:left">Budget initial</td>
            <td style="width: 80px;">${soldeInitial}</td>
            <td style="width: 80px;"></td>
            <td style="width: 90px;">${soldeInitial}</td>
            </tr>
    `

    let soldeHisto = soldeInitial;
    for (let i = 0; i < transactions.length; i++) {
        let soldeCalc;
        if (transactions[i].typeTransaction === 1) {
            soldeCalc = soldeHisto / 1 + transactions[i].montant / 1;
        } else {
            soldeCalc = soldeHisto - transactions[i].montant;
        }
        const dateFormat = new Date(transactions[i].date).toLocaleDateString();

        let transa = `
            <tr>
            <th scope="row" style="width: 50px;">${transactions[i].id}</th>
            <td style="width: 90px;">${dateFormat}</td>
            <td style="width: 700px;text-align:left"">${transactions[i].name}</td>
            <td style="width: 80px;">${transactions[i].typeTransaction === 1 ? transactions[i].montant : ''}</td>
            <td style="width: 80px;">${transactions[i].typeTransaction === 1 ? '' : transactions[i].montant}</td>
            <td style="width: 90px;">${soldeCalc}</td>
            </tr>
            `
        soldeHisto = soldeCalc;
        html = html + transa;
    }

    html = html + `</tbody></table></div>`

    let ntm = `
        <div style="height:10px;text-align:center;margin-bottom:50px">
            <h1>Liste des tickets</h1>
        </div>
        <div style="display:flex;margin-bottom:20px;height:450px;width:1400px;">
    `

    html = html + ntm;
    let cpt = 0;
    for (let i = 0; i < transactions.length; i++) {

        if (cpt === 3) {            
            let col = `</div>
            <div style="display:flex;margin-bottom:20px;height:450px;width:1400px;">`
            html = html + col;   
            cpt=0;
        }

        let transa = `<div style="border-style:solid;border-width:2px;border-color:black;width:450px;margin-right:20px;">
                    <p style="margin-right:15px;text-align:center">Id ticket:  ${transactions[i].id}</p>
                    <img style="width:450px; height:350px" src="data:image/png;base64, ${transactions[i].image}" />
                    </div>
            `
        html = html + transa;
        cpt++;      
    }
    
    return html;

}


export { createPdf }