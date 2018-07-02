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

// count the number of votes for each option
const getVoterInitials = (knex, event_id) => {
  return new Promise((resolve, reject) => {
    knex.raw(`select a.option_id, STRING_AGG(a.name,', ') as name
    from (select c.option_id, concat(left(b.first_name,1),left(b.last_name,1)) as name
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

module.exports = getEventRecord;