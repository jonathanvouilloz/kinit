import * as SQLite from 'expo-sqlite';

export const createTable = function () {
  const db = SQLite.openDatabase('campsDB');

  db.transaction(tx => {
    tx.executeSql("drop table camp")
  })

  db.transaction(tx => {
    tx.executeSql(
      `create table if not exists camp (
          id INTEGER PRIMARY KEY, 
          name varchar(50) NOT NULL, 
          soldeInitial double NOT NULL,
          solde double NOT NULL,
          actif boolean NOT NULL);`
    );
  },
    function (err) {
      console.log(err);
    });

  db.transaction(tx => {
    tx.executeSql("drop table transactions")
  })

  db.transaction(tx => {
    tx.executeSql(
      `create table if not exists transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          name varchar(50) NOT NULL, 
          montant double NOT NULL,
          currency int NOT NULL,
          image text NOT NULL,
          date date NOT NULL,
          typeTransaction int NOT NULL,
          camp_id INTEGER REFERENCES camp(id)
          );`
    );
  },
    function (err) {
      console.log(err);
    });


}



export const insertCamp = async function (camp) {
  const db = SQLite.openDatabase('campsDB');
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO camp (name, soldeInitial, solde, actif) VALUES (?,?,?,?)', [camp.name, camp.solde, camp.solde, true],
        (tx, results) => {
          db.transaction(function (tx) {
            tx.executeSql('select * from camp where id = 1', [],
              (tx, results) => {
                resolve(results);
              }
            )
          }, function (err) {
            console.log(err);
          });
        }
      )
    }, function (err) {
      console.log(err);
    }, function (succes) {
      console.log("Transaciton insérée");
    });
  })
}


export const insertTransaction = async function (transa) {
  const date = new Date().getTime();
  const db = SQLite.openDatabase('campsDB');
  let campUpdated;
  //montant a operér
  const montantTransaction = parseFloat(transa.montant).toFixed(2);

  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO transactions (name, montant, currency, image, date, typeTransaction, camp_id) VALUES (?,?,?,?,?,?,?)',
        [transa.name, parseFloat(transa.montant).toFixed(2), transa.currency, transa.image, date, transa.typeTransaction, transa.idCamp],
        (tx, results) => {

          db.transaction(function (tx) {
            tx.executeSql('select * from camp where id = ?', [transa.idCamp],
              (tx, results) => {
                //calcul
                const campUpdate = results.rows.item(0);
                let newSolde;
                let soldeActuel = parseFloat(campUpdate.solde);
                switch (transa.typeTransaction) {
                  case 0:
                    newSolde = soldeActuel - montantTransaction;
                    break;
                  case 1:
                    newSolde = soldeActuel + montantTransaction / 1;
                    break;
                  default:
                    newSolde = soldeActuel - montantTransaction;
                    break;
                }
                //update le solde du camp
                db.transaction(function (tx) {
                  tx.executeSql("update camp set solde = ? where id = ?", [parseFloat(newSolde).toFixed(2), transa.idCamp],
                    (tx) => {
                      db.transaction(function (tx) {
                        tx.executeSql('select * from transactions where camp_id = ? order by id desc', [transa.idCamp],
                          (tx, results) => {

                            const transactions = results.rows.item(0);
                            const nbRows = results.rows.length;

                            tx.executeSql("Select * from camp where id = ?", [transa.idCamp],
                              (tx, results) => {
                                const camp = results.rows.item(0);
                                if (nbRows === 1) {
                                  resolve({ first: true, results: transactions, camp: camp })
                                  //console.log(transactions, " ", camp);

                                } else {
                                  resolve({ first: false, results: transactions, camp: camp })
                                  //console.log(transactions, " ", camp);

                                }
                              }
                            )

                          }
                        )
                      }, function (err) {
                        console.log(err);
                      });
                    }
                  )
                }
                )
              }
            )
          }, function (err) {
            console.log(err);
          });
        }
      )
    }, function (err) {
      console.log(err);
    }, function (succes) {
      console.log("Transaction insérée");
    });
  })
}

export const selectCamp = async function () {
  const db = SQLite.openDatabase('campsDB');
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql('select * from camp where actif = ?', [true],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results);
          } else {
            resolve(false);
          }
        }
      )
    }, function (err) {
      console.log(err);
    });
  }
  )
}

export const selectTransactions = async function () {
  const db = SQLite.openDatabase('campsDB');
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql('select * from transactions order by id desc', [],
        (tx, results) => {
          let arr = []
          for (let i = 0; i < results.rows.length; i++) {
            const transa = {
              id: results.rows.item(i).id,
              name: results.rows.item(i).name,
              montant: results.rows.item(i).montant,
              currency: results.rows.item(i).currency,
              date: results.rows.item(i).date,
              typeTransaction: results.rows.item(i).typeTransaction,
            };
            arr.push(transa);
          }
          if (results.rows.length > 0) {
            resolve(arr);
          } else {
            resolve(false);
          }
        }
      )
    }, function (err) {
      console.log(err);
    });
  }
  )
}

export const selectTransactionsForPdf = async function () {
  const db = SQLite.openDatabase('campsDB');
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql('select * from transactions order by id asc', [],
        (tx, results) => {
          let arr = []
          for (let i = 0; i < results.rows.length; i++) {
            const transa = {
              id: results.rows.item(i).id,
              name: results.rows.item(i).name,
              montant: results.rows.item(i).montant,
              currency: results.rows.item(i).currency,
              date: results.rows.item(i).date,
              typeTransaction: results.rows.item(i).typeTransaction,
              image: results.rows.item(i).image,
            };
            arr.push(transa);
          }
          if (results.rows.length > 0) {
            resolve(arr);
          } else {
            resolve(false);
          }
        }
      )
    }, function (err) {
      console.log(err);
    });
  }
  )
}

export const selectTransaction = async function (id) {
  const db = SQLite.openDatabase('campsDB');
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql('select * from transactions where id = ?', [id],
        (tx, results) => {
          resolve(results.rows.item(0));
        }
      )
    }, function (err) {
      console.log(err);
    });
  }
  )
}



export const recupCaution = async function (id, montant, solde, deleteOrCaution, typeTransaction) {

  let updateSolde;
  if (!deleteOrCaution) {
    if (typeTransaction === 1) {
      updateSolde = solde / 1 - montant / 1;
    } else {
      updateSolde = solde / 1 + montant / 1;
    }
  } else {
    updateSolde = solde / 1 + montant / 1
  }


  const db = SQLite.openDatabase('campsDB');
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql('update camp set solde = ?', [updateSolde],
        (tx, results) => {
          tx.executeSql("delete from transactions where id = ?", [id]),
            tx.executeSql('select * from transactions order by id desc', [],
              (tx, results) => {
                let arr = []
                for (let i = 0; i < results.rows.length; i++) {
                  const transa = {
                    id: results.rows.item(i).id,
                    name: results.rows.item(i).name,
                    montant: results.rows.item(i).montant,
                    currency: results.rows.item(i).currency,
                    date: results.rows.item(i).date,
                    typeTransaction: results.rows.item(i).typeTransaction,
                  };
                  arr.push(transa);
                }
                resolve(arr);
              }
            )
        }
      )
    }, function (err) {
      console.log(err);
    });
  }
  )
}