// Obtém o nome do usuário armazenado anteriormente
var usuario = localStorage.getItem('valorNomeAnterior');

// Inicializa a conexão do socket.io com o servidor
var socket = io('http://localhost:8081');

// Imprime o nome do usuário no console
console.log(`Seu nome é: ${usuario}`);

// Seleciona o botão de enviar mensagem
let prontoEnviar = document.querySelector('.btn-enviar-msg');

// Seleciona o campo de entrada de texto
let inputpreenchido = document.querySelector('.box-entrada-texto');

// Adiciona um ouvinte de evento para detectar a entrada de texto no campo
inputpreenchido.addEventListener("input", function(){
  let valor = inputpreenchido.value.trim();
  
  // Verifica se há texto no campo
  if (valor.length > 0) {
    prontoEnviar.classList.add("efeito-enviar");
  } else {
    prontoEnviar.classList.remove("efeito-enviar");
  }
});

function profileList(){
  let profileIcon = document.querySelector('.perfil-options');
  
  profileIcon.classList.toggle('visivel')
}

// Função para rolar a tela para o final do chat
function scrollNoFim() {
  let scrollFim = document.querySelector('.chat-principal-tela');
  scrollFim.scrollTop = scrollFim.scrollHeight;
}

// Seleciona o botão de enviar mensagem
let clickbtn = document.querySelector('.btn-enviar-msg');

// Seleciona a área de exibição do chat
let telaChat = document.querySelector('.chat-principal-tela');

// Adiciona um ouvinte de evento para o clique no botão de enviar mensagem
clickbtn.addEventListener('click', function(){
  let valor = inputpreenchido.value.trim(); 

  if(valor.length > 0){
    // Cria uma nova div para exibir a mensagem enviada pelo usuário
    let divMolde = document.createElement("div");
    divMolde.setAttribute("class", "mensagens mensagem-ida");
    divMolde.innerHTML = `
      <div>
        <div class="nome-msg">Você</div>
        <div class="conteudo-msg">${inputpreenchido.value}</div>
      </div>
    `;
  
    Enviando(); // Envia a mensagem para o servidor via socket
    telaChat.appendChild(divMolde);
    inputpreenchido.value = "";
    prontoEnviar.classList.remove("efeito-enviar");
    console.log('Fazendo Update clicando no botão');
    scrollNoFim();
  }else{
    console.log('Não enviar mensagem');
  }

  // Emite o evento 'chat' para o servidor, enviando o autor e a mensagem
  socket.emit('chat', {
    author: usuario,
    message: valor
  });
});

// Ouve o evento 'chat' do servidor e chama a função para exibir a mensagem recebida
socket.on("chat", function(message){
  enviarMensagem("other", message);
});

// Função para exibir uma mensagem na área de chat
function enviarMensagem(type, message) {
  let messageContainer = document.querySelector(".chat-principal-tela");

  if (type === "my") {
    // Cria uma div para exibir a mensagem enviada pelo usuário
    let el = document.createElement("div");
    el.setAttribute("class", "mensagens mensagem-ida");
    el.innerHTML = `
      <div>
        <div class="nome-msg">Você</div>
        <div class="conteudo-msg">${message.message}</div>
      </div>
    `;
    messageContainer.appendChild(el);
  } else if (type === "other") {
    // Cria uma div para exibir a mensagem recebida de outro usuário
    let el = document.createElement("div");
    el.setAttribute("class", "mensagens mensagem-volta");
    el.innerHTML = `
      <div>
        <div class="nome-msg">${message.author}</div>
        <div class="conteudo-msg">${message.message}</div>
      </div>
    `;
    messageContainer.appendChild(el);
  }

  let textarea = document.getElementById("entrada-texto");
  let mensagem = textarea.value;
  
  localStorage.setItem('armazenamento', mensagem);
  
  console.log("Mensagem enviada: " + mensagem);

  let valor = inputpreenchido.value.trim();
  if(valor.length > 0){
    // Cria uma nova div para exibir a mensagem enviada pelo usuário
    let divMolde = document.createElement("div");
    divMolde.setAttribute("class", "mensagens mensagem-ida");
    divMolde.innerHTML = `
      <div class="caixa-msg">
        <div class="nome-msg">Você</div>
        <div class="conteudo-msg">${inputpreenchido.value}</div>
      </div>
    `;

    socket.emit('chat', {
      author: usuario,
      message: valor
    });
    Enviando(); // Envia a mensagem para o servidor via socket
    telaChat.appendChild(divMolde);
    inputpreenchido.value = "";
    prontoEnviar.classList.remove("efeito-enviar");
    textarea.scrollTop = 0;
    console.log('Fazendo Update clicando no Enter');
    scrollNoFim();
  }else{
    console.log('Não enviar mensagem');
  }
}

// Adiciona um ouvinte de evento para a tecla Enter pressionada no campo de texto
let textarea = document.getElementById("entrada-texto");
textarea.addEventListener("keydown", function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Impede a quebra de linha no pressionamento do Enter
    enviarMensagem(); // Chama a função para enviar a mensagem
  }
});

// Função para enviar a mensagem para o servidor via socket
function Enviando(){
  var mensagem = document.querySelector('.box-entrada-texto').value;

  var messageObject = {
    author: usuario,
    message: mensagem,
  }
  socket.emit('sendMessage', messageObject);
}

// Seleciona todos os emojis
let emoji = document.querySelectorAll('#emojis');

// Seleciona o ícone de emojis
let iconEmojis = document.querySelector('.emoji-icone');

// Seleciona a lista de emojis
let boxEmojis = document.querySelector('.emoji-list');

// Adiciona um ouvinte de evento para o clique no ícone de emojis
iconEmojis.addEventListener('click', function(){
  boxEmojis.classList.toggle('emoji-list-on');
});

// Adiciona um ouvinte de evento para o clique em cada emoji
for(const emojis of emoji) {
  emojis.addEventListener('click', function(){
    // Adiciona o emoji clicado ao valor do campo de entrada de texto
    inputpreenchido.setAttribute("value", document.querySelector('.box-entrada-texto').value += emojis.innerHTML);
    
    if (inputpreenchido.length != "") {
      prontoEnviar.classList.add("efeito-enviar");
    } else {
      prontoEnviar.classList.remove("efeito-enviar");
    }
  });
}

// ...

// Ouve o evento 'previousMessages' do servidor e exibe as mensagens anteriores
socket.on('previousMessages', function(messages) {
  for (message of messages) {
    if (message.author === usuario) {
      enviarMensagem('my', message);
    } else {
      enviarMensagem('other', message);
    }
  }
});
// ...