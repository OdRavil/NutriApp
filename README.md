# Projeto-3

## Tech stack

- React Native
- Javascript
- Firebase

## Configuração

Configurar o arquivo `firebase.json` em `./app/db/firebase.json` com as credenciais do CloudFirestore.

```bash

npm i

npx react-native start

npx react-native run-android

```

## Migration Dev

Após configurado o arquivo de configurações do firebase, executar `node ./app/db/migration.js` para popular a base de dados de testes.
