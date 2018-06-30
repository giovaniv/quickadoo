// parse out option fields from form data and return them as an array of objects
const parseOptions = (userData, dataLen, optionFields, event_id) => {
  const results = [];
  for (let i = 0; i < dataLen; i++) {
    const options = {};
    optionFields.forEach(field => {
      const fieldName = `${field}-${i + 1}`;
      options[field] = userData[fieldName] ? userData[fieldName] : null;
    })
    options.event_id = event_id;
    results.push(options);
  }
  return results;
};

// calitalise the first letter of a name
const capitaliseFirstLetter = name => name.replace(/^\w/, letter => letter.toUpperCase());

// generate a random alphanumeric string
const generateRandomString = length => Math.random().toString(36).substring(2, length + 2);

// check if there is any duplicate data
const checkRecord = (knex, searchObj, tb) => {
  const { first_name, last_name, email } = searchObj;

  return new Promise((resolve, reject) => {
    knex.where(function () {
      this.where('first_name', first_name)
        .orWhere('last_name', last_name)
        .orWhere('email', email)
    }).select().table(tb)
      .then(row => {
        if (row.length) {
          // record exists. return an error message with the duplicate record
          reject({ message: "Record already exists!", rowId: row[0].id });
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
      .returning('id')
      .then(id => {
        if (id.length) {
          resolve({
            message: `${id.length} Record(s) added to "${tb}" Table!`,
            rowId: id[0]
          });
        } else {
          reject({
            message: 'Insert failed. Please check your knex syntax!',
          });
        }
      })
      .catch(err => console.log(err));
  });
};

module.exports = {
  checkRecord,
  insertRecords,
  generateRandomString,
  capitaliseFirstLetter,
  parseOptions
};