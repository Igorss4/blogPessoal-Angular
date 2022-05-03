import { Postagem } from "./Postagem";

export class Usuario {
  public id: number;
  public nome: string;
  public usuario: string;
  public foto: string;
  public senha: string;
  public tipo: string;
  public postagem: Postagem[];
}