export const TipoUsuario = {
  ALUNO: 1,
  PROFESSOR: 2,
};

export const Sexo = {
  MASCULINO: 'M',
  FEMININO: 'F',
};

export class Usuario {
  id;
  login;
  email;
  sexo;
  tipo;
  nome;
  dataNascimento;
  turmaLista;
}
