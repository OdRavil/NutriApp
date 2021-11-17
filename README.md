# NutriApp

Aplicação para monitoramento de saúde e bem estar de alunos.

# Tech Stack

- Javascript & TypeScript
- [Node.js](https://nodejs.org)
- [Ionic Framework](https://ionic.io/)
  - [Capacitor](https://capacitorjs.com/docs)
  - [React.js](https://pt-br.reactjs.org/)
- [Husky](https://typicode.github.io/husky/#/)
- [Firebase](https://firebase.google.com/)
  - [Firestore](https://firebase.google.com/products/firestore)

# Start here

Utilize esses comandos para clonar o projeto:

```batch
# Configure
$ npm install -g @ionic/cli cordova-res
$ git clone https://gitlab.com/vividussaude/vividus.git ionic-vividus
$ cd ionic-vividus && npm install && ionic serve

# Development
$ npm start

# Production
$ npm run build
$ npm install -g serve
$ serve -s build

```

## Criando o primeiro usuário

Para acessar pela primeira vez a aplicação é necessário criar manualmente um usuário administrador no Firestore:

1. [Criar um projeto Firebase](https://firebase.google.com/), seguindo os passos na própria documentação.
2. Em _Authentication_ habilitar o provedor de login para **E-mail/senha**.
3. Adicionar um e-mail e senha para autenticar. Copiar o UID desse novo usuário.
4. Adicionar um banco de produção Firestore e criar uma coleção `usuarios`.
5. Criar um novo documento de usuário.
   1. UID do documento deve ser o UID copiado do _Authentication_.
   2. O novo usuário deve seguir o _model_ de [`Usuario`](./src/models/Usuario) e [`BaseModel`](./src/models/BaseModel), ignorando apenas a propriedade `id` que é apenas para utilização no app.
6. Atualizar as regras do banco Firestore para habilitar o acesso.
7. Adicionar um app no projeto.
   1. Utilizar a plataforma Web
   2. Copiar as configurações do SDK. Será utilizado em formato JSON. Ex:
   ````json
      {
        "apiKey": "xxxxxxxxxxxxxxxxxxx",
        "authDomain": "xxxxxxxxxxxxx.firebaseapp.com",
        "projectId": "xxxxxxxxxxxxx",
        "storageBucket": "xxxxxxxxxx.appspot.com",
        "messagingSenderId": "xxxxxxxxxxx",
        "appId": "1:xxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxxxx"
      }
   ````
8. Criar um arquivo `firebase.json` na pasta [utils](./src/utils) e colar as credenciais do firebase.
