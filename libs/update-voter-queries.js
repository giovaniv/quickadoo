const getOptionVoters = (knex, voterId) => {
  return new Promise((resolve, reject) => {
    knex.raw('select * from option_voters where person_id = ?', voterId)
      .then(rows => {
        resolve(rows);
      })
      .catch(err => {
        reject(err);
      })
  });
};

async function validateVoters(knex, userEmail) {
  const voterRow = await checkVoterExists(knex, userEmail);
  if (voterRow.rowCount) {
    const optionVoterRows = await getOptionVoters(knex, voterRow.rows[0].id);
    const options = [];
    for (let i = 0; i < optionVoterRows.rows.length; i++) {
      options.push(optionVoterRows.rows[i].option_id);
    }
    return {
      user: voterRow.rows[0],
      options
    };
  }
}

// check if the voter exists in db
const checkVoterExists = (knex, voterEmail) => {
  return new Promise((resolve, reject) => {
    knex.raw('select * from users where email = ?', voterEmail)
      .then(voterRow => {
        resolve(voterRow);
      })
  });
};

// insert voter information to tb
const insertVoterInfo = (knex, voterInfo) => {
  return new Promise((resolve, reject) => {
    knex('users').returning('id')
      .insert(voterInfo)
      .then(row => {
        resolve(row[0]);
      })
  });
};

// before updating option_voter tb, delete previous votes tied to the current user
const deleteExistingOptionVoters = (knex, voterId) => {
  return new Promise((resolve, reject) => {
    knex('option_voters').where('person_id', voterId).del()
      .then(() => {
        resolve(null);
      })
      .catch(err => {
        reject(err);
      })
  });
};

// update option_voter tb with new votes
const updateOptionVoters = (knex, voterId, selectedOptions) => {
  return new Promise((resolve, reject) => {
    selectedOptions.forEach(option => {
      knex.raw(`insert into option_voters(option_id, person_id) values (${option},${voterId})`)
        .then(() => {
          resolve(null);
        })
        .catch(err => {
          reject(err);
        })
    })
  })
};

async function castVotes(knex, userEmail, voterData, selectedOptions) {
  const voterInfo = await checkVoterExists(knex, userEmail);
  let userId;
  if (!voterInfo.rowCount) {
    // voter info doesn't exist in db
    userId = await insertVoterInfo(knex, voterData);
  } else {
    // voter info exists in db
    userId = voterInfo.rows[0].id;
  }
  await deleteExistingOptionVoters(knex, userId);
  await updateOptionVoters(knex, userId, selectedOptions);
}

module.exports = { validateVoters, castVotes };