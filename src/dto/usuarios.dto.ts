export interface CadastrarUsuarioDto {
  nome: string;
  email: string;
  senha: string;
}

export interface AtualizarUsuarioDto {
  nome?: string;
  email?: string;
  senha?: string;
}

export interface ListarUsuarioDto {
  nome?: string;
}