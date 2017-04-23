const SEARCH_TWEETS = 'search/tweets';
const config = require('../../../config');
const Twitter = require('twitter');
const client = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

function normalize(tweets) {
  return tweets.statuses.map(tweet => ({
    text: tweet.text,
    author: tweet.user.name
  }));
}

function nextPage(tweets) {
  return new Promise((resolve, reject) => {
    client.get(SEARCH_TWEETS, {
      q: q,
      max_id: tweets.search_metadata.max_id_str,
      include_entities: 1
    }, (error, _tweets) => {
      if (error) return reject(error);

      _tweets.statuses = _tweets.statuses.concat(tweets.statuses);
      _tweets.search_metadata.count = _tweets.statuses.length;

      return resolve(normalize(_tweets));
    });
  });
}

class TwitterRepository {
  static findByQuery(q) {
    return new Promise((resolve, reject) => {
      client.get(SEARCH_TWEETS, {
        q: q
      }, (error, tweets) => {
        if (error) return reject(error);
        if (tweets.search_metadata.next_results) {
          return nextPage(tweets)
            .then(resolve)
            .catch(reject);
        }

        return resolve(normalize(tweets));
      });
    });
  }

  static track(q) {
    return client
      .stream('statuses/filter', {
        track: q
      });
  }
}

module.exports = TwitterRepository;
