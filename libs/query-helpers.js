
// function to filter keys in a object and return the values of this filter
const filterObj = (obj, filter) => {
  let key, keys = []
  for (key in obj) {
    if (obj.hasOwnProperty(key) && filter.test(key)) {
      keys.push(obj[key])
    }
  }
  return keys
}

// get event_id corresponding to the given url
const getEventId = (knex, url) => {
  return new Promise((resolve, reject) => {
    knex.select('id').from('events')
      .where(function () {
        this.where('events.admin_url', url).orWhere('events.poll_url', url)
      }).then(eventId => {
        if (eventId.length) {
          resolve(eventId[0].id);
        } else {
          reject('no event_id found!');
        }
      })
  });
}

// check if there is any event corresponding to url
// if there is any, return the result
const checkExistingEvent = (knex, url) => {
  return new Promise((resolve, reject) => {
    knex.select('*', 'options.id as option_id').from('options')
      .join('events', 'options.event_id', 'events.id')
      .join('users', 'events.creator_id', 'users.id')
      .where(function () {
        this.where('events.admin_url', url).orWhere('events.poll_url', url)
      })
      .then(eventRecord => {
        if (eventRecord.length) {
          resolve(eventRecord);
        } else {
          reject('no url found!');
        }
      })
  });
};

const countVoters = voterResults => {
  voterResults.forEach((option, index) => {
    const counts = option.name.split(',').length;
    voterResults[index].counts = counts;
  })
  return voterResults;
}

// `select a.option_id, STRING_AGG(a.name,', ') as name
//     from (select c.option_id, concat(left(b.first_name,1),left(b.last_name,1)) as name
//     from options a, users b, option_voters c where a.id=c.option_id and b.id=c.person_id and a.event_id = ${event_id}) as a
//     group by a.option_id;`

// count the number of votes for each option
const getVoterInitials = (knex, event_id) => {
  return new Promise((resolve, reject) => {
    knex.raw(`select a.option_id, STRING_AGG(a.name,', ') as name
    from (select c.option_id, b.first_name as name
    from options a, users b, option_voters c where a.id=c.option_id and b.id=c.person_id and a.event_id = ${event_id}) as a
    group by a.option_id;`)
      .then(result => {
        resolve(countVoters(result.rows));
      })
  });
}

// return event record and the number of votes for the event options
async function getEventRecord(knex, url) {
  const event_id = await getEventId(knex, url);
  const eventRecord = await checkExistingEvent(knex, url);
  const voterCounts = await getVoterInitials(knex, event_id);

  return { eventRecord, voterCounts };
}

// calculate how many options were returned
const calculateOptionLen = (options, fields) => (Object.keys(options).length - 5) / fields.length;

// take out all the numbers from option keys (i.e. name-1 => name)
const modifyOptionKeys = (optionObj, optionKeys, eventId, i) => {
  const optionResults = {};
  optionKeys.forEach(key => {
    const fieldName = `${key}-${i + 1}`;
    optionResults[key] = optionObj[fieldName] ? optionObj[fieldName] : null;
  })
  optionResults.event_id = eventId;
  return optionResults;
};

// parse out option fields from form data and return them as an array of objects
const parseOptions = (userData, event_id) => {
  // options: calculate how many options were returned
  // # of returned options = (# of total fields - 5) / 4
  // 5: (3 user data fields, 2 event data fields))
  // 4: (4 option fields)
  const optionFields = ['name', 'start_time', 'end_time', 'note'];
  const optionLen = calculateOptionLen(userData, optionFields);
  const results = [];
  for (let i = 0; i < optionLen; i++) {
    const options = modifyOptionKeys(userData, optionFields, event_id, i);
    // results should be an array of objects to insert to db
    results.push(options);
  }
  return results;
};

// calitalise the first letter of a name
const capitaliseFirstLetter = name => name.replace(/^\w/, letter => letter.toUpperCase());

// generate a random alphanumeric string
const generateRandomString = length => Math.random().toString(36).substring(2, length + 2);

module.exports = { filterObj, generateRandomString, capitaliseFirstLetter };