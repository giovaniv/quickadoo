// check if there is any duplicate data
const checkRecord = (knex, searchObj, tb) => {
  return new Promise((resolve, reject) => {
    knex.where(searchObj).select().table(tb)
      .then(row => {
        if (row.length) {
          // record exists. return an error message with the duplicate record
          reject({ message: "Record already exists!", record: row });
        } else {
          // record doesn't exist. return null
          resolve(null);
        }
      })
  });
};

// insert record when there is no duplicate
const insertRecords = (knex, tb, inputObj) => {
  return new Promise((resolve, reject) => {
    knex(tb).insert(inputObj)
      .then(result => {
        if (result.rowCount) {
          resolve(`${result.rowCount} Record(s) added!`);
        } else {
          reject('Insert failed. Please check your knex syntax!');
        }
      });
  });
};

module.exports = {
  checkRecord,
  insertRecords
};