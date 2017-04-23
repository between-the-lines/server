const repository = require('./repository');

class MoodService {
  static findByQuery(query, from, to) {
    return repository
      .findByQuery(query, from, to)
      .then(data => {
        // here we consume the mood service
        return data;
      });
  }

  static stream(query, cb) {
    return repository
      .stream(query)
      .on('data', data => {
        // here we consume the mood service
        return cb(data);
      });
  }
}

module.exports = MoodService;
