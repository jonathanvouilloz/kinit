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
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO transactions (name, montant, currency, image, date, typeTransaction, camp_id) VALUES (?,?,?,?,?,?,?)',
        [transa.name, transa.montant, transa.currency, transa.image, date, transa.typeTransaction, transa.idCamp],
        (tx, results) => {

          db.transaction(function (tx) {
            tx.executeSql('select * from transactions where id = ?', [results.insertId],
              (tx, results) => {
                resolve(results.rows.item(0));
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
      tx.executeSql('select * from transactions', [],
        (tx, results) => {        
          if (results.rows.length > 0) {    
            resolve(results.rows);
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
            resolve(results);
        }
      )
    }, function (err) {
      console.log(err);
    });
  }
  )
}