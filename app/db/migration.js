const firebase = require('firebase');
const config = require('./firebase.json');

const firebaseImpl = firebase.initializeApp(config);
const firebaseDatabase = firebase.firestore();

class FirebaseService {
  static pushData = (collection, objToSubmit) => {
    return firebaseDatabase
      .collection(collection)
      .add(objToSubmit)
      .then(doc => {
        return doc.id;
      });
  };
  static arrayUnion = (collection, id, field, obj) => {
    return firebaseDatabase
      .collection(collection)
      .doc(id)
      .update({[field]: firebase.firestore.FieldValue.arrayUnion(obj)});
  };
  static arrayRemove = (collection, id, field, obj) => {
    return firebaseDatabase
      .collection(collection)
      .doc(id)
      .update({[field]: firebase.firestore.FieldValue.arrayRemove(obj)});
  };
}

(async () => {
  //Turma
  const idTurma1 = await FirebaseService.pushData('turmas', {
    codigo: 'A1',
    descricao: 'Turma A1',
  });

  const idTurma2 = await FirebaseService.pushData('turmas', {
    codigo: 'A2',
    descricao: 'Turma A2',
  });

  //Professor
  const idProfessor1 = await FirebaseService.pushData('usuarios', {
    login: 'antonio.vieira',
    tipo: 2,
    nome: 'Antônio Vieira',
    dataNascimento: new Date('1998-08-25T10:11:30.651Z'),
    turmaLista: [idTurma1],
  });
  const idProfessor2 = await FirebaseService.pushData('usuarios', {
    login: 'maria.clara',
    tipo: 2,
    nome: 'Maria Clara',
    dataNascimento: new Date('1998-08-25T10:11:30.651Z'),
    turmaLista: [idTurma2],
  });

  FirebaseService.arrayUnion('turmas', idTurma1, 'usuariosLista', idProfessor1);
  FirebaseService.arrayUnion('turmas', idTurma2, 'usuariosLista', idProfessor2);

  //Aluno
  const idAluno1 = await FirebaseService.pushData('usuarios', {
    login: 'jose.carvalho',
    tipo: 1,
    nome: 'José Carvalho',
    dataNascimento: new Date('1998-08-25T10:11:30.651Z'),
    turmaLista: [idTurma1],
  });
  const idAluno2 = await FirebaseService.pushData('usuarios', {
    login: 'jose.carvalho',
    tipo: 1,
    nome: 'José Carvalho',
    dataNascimento: new Date('1998-08-25T10:11:30.651Z'),
    turmaLista: [idTurma1],
  });
  const idAluno3 = await FirebaseService.pushData('usuarios', {
    login: 'jose.carvalho',
    tipo: 1,
    nome: 'José Carvalho',
    dataNascimento: new Date('1998-08-25T10:11:30.651Z'),
    turmaLista: [idTurma1],
  });
  const idAluno4 = await FirebaseService.pushData('usuarios', {
    login: 'jose.carvalho',
    tipo: 1,
    nome: 'José Carvalho',
    dataNascimento: new Date('1998-08-25T10:11:30.651Z'),
    turmaLista: [idTurma1, idTurma2],
  });
  const idAluno5 = await FirebaseService.pushData('usuarios', {
    login: 'jose.carvalho',
    tipo: 1,
    nome: 'José Carvalho',
    dataNascimento: new Date('1998-08-25T10:11:30.651Z'),
    turmaLista: [idTurma2],
  });

  FirebaseService.arrayUnion('turmas', idTurma1, 'usuariosLista', idAluno1);
  FirebaseService.arrayUnion('turmas', idTurma1, 'usuariosLista', idAluno2);
  FirebaseService.arrayUnion('turmas', idTurma1, 'usuariosLista', idAluno3);
  FirebaseService.arrayUnion('turmas', idTurma1, 'usuariosLista', idAluno4);
  FirebaseService.arrayUnion('turmas', idTurma2, 'usuariosLista', idAluno4);
  FirebaseService.arrayUnion('turmas', idTurma2, 'usuariosLista', idAluno5);
})()
  .then(() => {
    process.exit(0);
  })
  .catch(err => console.error(err));
