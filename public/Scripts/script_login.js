const users = [
    {
        login: "Claudio", 
        password: "123"
    },
    {
        login: "Lucas", 
        password: "123"
    },
    {
        login: "Osvaldo", 
        password: "123"
    },
    {
        login: "Rogerio", 
        password: "123"
    },
    {
        login: "Rosa", 
        password: "123"
    },
    {
        login: "Lucia", 
        password: "123"
    },
    {
        login: "Ministerio do meio ambiente", 
        password: "123"
    },
]

let form = document.getElementById("loginForm");


form.addEventListener('submit', function(event) {
   event.preventDefault();



   let login = document.getElementById("ID_Ident").value;
   let senha = document.getElementById("ID_Password").value;
   let mensagemErro = document.querySelector('.error-msg');
   let linhaErro1 = document.querySelector('.erl_1');
   let linhaErro2 = document.querySelector('.erl_2');
   let authentication = false

   localStorage.setItem('valorNomeAnterior', login);

   for (let i = 0; i < users.length; i++) {
            if (login === users[i].login && senha === users[i].password) {
                authentication = true;
                break;
            }
        }

        if (authentication) {
            location.href = "../chat.html";
        } else {
                mensagemErro.style.display = 'block'
                linhaErro1.style.cssText = 'border-bottom: 1px solid red'
                linhaErro2.style.cssText = 'border-bottom: 1px solid red'
        }
    });
    
    var socket = io('http://localhost:8081');
