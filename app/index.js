const express = require('express');
const websocket = require('socket.io');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(cors());

const MoodService = require('./mood/service');

io.on('connection', function(socket) {
  const track = socket.request._query.track;
  if (!track) return;

  const stream = MoodService
    .stream(track, event => {
      socket.emit(`track:${track}`, event);
    });

  socket.on('disconnect', () => {
    stream.destroy();
  });
});

app.get('/search', (req, res) => {
  MoodService
    .findByQuery(req.query.q)
    .then(data => res.send(data))
    .catch(err => res.status(400).send(err.message));
});

server
  .listen(3000, () => console.log('Server listen'));
