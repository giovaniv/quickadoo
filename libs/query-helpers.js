
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

// calitalise the first letter of a name
const capitaliseFirstLetter = name => name.replace(/^\w/, letter => letter.toUpperCase());

// generate a random alphanumeric string
const generateRandomString = length => Math.random().toString(36).substring(2, length + 2);

module.exports = { filterObj, generateRandomString, capitaliseFirstLetter };