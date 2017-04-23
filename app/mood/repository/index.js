const twitter = require('./twitter');

class Repository {
  static findByQuery(query) {
    return twitter.findByQuery(query);
  }

  static stream(query) {
    return twitter.track(query);
  }
}

module.exports = Repository;
