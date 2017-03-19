const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser')
const fetch = require('node-fetch');

const message_api_url = 'http://localhost:3000/gecko_chat/recieve_message';

app.use(bodyParser.json());

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/recieve_message', (req, res) => {
    let message = req.body;
    if (message && Object.keys(message).length > 0) {

        console.log('recieved message: ', message);
        io.emit('recieve_chat_message', message.message.content);
    } else {
        console.log('invalid message recieved');
    }
});

const send_message = msg => {
    // TODO: verify msg
    console.log('sending message', msg);
    fetch(message_api_url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(msg)
    })
    .then((r) => {
        if (r.status !== 200) {
            console.error('Failed to send message to API!');
        } else {
            console.log('Message Sent to API');
        }
    })
    .catch(e => {console.error('error', e);});
};

io.on('connection', function(socket){
    socket.on('send_chat_message', send_message);
});



server.listen(4000, () => {
    console.log('WebClient online: http://localhost:4000');
});
