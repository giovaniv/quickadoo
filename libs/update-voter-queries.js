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

module.exports = castVotes;