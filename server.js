const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const multer = require('multer');

const messagesFilePath = path.join(__dirname, 'messages.json');

function loadMessages() {
  try {
    const fileContent = fs.readFileSync(messagesFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Erro ao carregar mensagens:', error);
    return [];
  }
}

function saveMessages(messages) {
  try {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages));
  } catch (error) {
    console.error('Erro ao salvar mensagens:', error);
  }
}

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now());
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.render('login.html');
});

app.post('/', upload.single('file'), (req, res) => {
  console.log('Arquivo recebido!');
  res.send('Arquivo recebido!');
});

let messages = loadMessages();

io.on('connection', socket => {
  console.log(`Socket conectado ${socket.id}`);

  // Envia mensagens anteriores para o novo cliente conectado
  socket.emit('previousMessages', messages);

  socket.on('sendMessage', data => {
    messages.push(data);
    saveMessages(messages);

    // Emite a mensagem para todos os clientes conectados
    io.emit('mensagemRecebida', data);
  });

  socket.on('chat', message => {
    socket.broadcast.emit('chat', message);
  });
});

server.listen(8081, () => {
  console.log('Servidor escutando na porta 8081');
});

process.on('SIGINT', () => {
  saveMessages(messages);
  process.exit(0);
});