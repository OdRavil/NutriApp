export const TipoUsuario = {
  ALUNO: 1,
  PROFESSOR: 2,
};

export class Usuario {
  id;
  login;
  senha;
  tipo;
  nome;
  dataNascimento;
}
