import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Postagem } from '../model/Postagem';
import { Tema } from '../model/Tema';
import { Usuario } from '../model/Usuario';
import { AuthService } from '../service/auth.service';
import { PostagemService } from '../service/postagem.service';
import { TemaService } from '../service/tema.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  listaPostagens: Postagem[]
  postagem: Postagem = new Postagem()

  tema: Tema = new Tema()
  listaTemas: Tema[]
  idTema: number

  usuario: Usuario = new Usuario()
  idUsuario = environment.id

  constructor(
    private router: Router,
    private postagemService: PostagemService,
    private temaService: TemaService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    window.scroll(0, 0)

    // if (environment.token == '') {
    //   alert('Voce precisa estar logado para ficar aqui...')
    //   this.router.navigate(['/entrar'])
    // }
    this.getTemas()
    this.getPostagens()
  }

  getTemas() {
    this.temaService.getTemas().subscribe((resp: Tema[]) => {
      this.listaTemas = resp
    })
  }

  findByIdTema() {
    this.temaService.getByIdTema(this.idTema).subscribe((resp: Tema) => {
      this.tema = resp
    })
  }

  getPostagens(){
    this.postagemService.getPostagem().subscribe((resp: Postagem[])=>{
      this.listaPostagens = resp
    })
  }

  findByIdUsuario(){
    this.auth.getByIdUsuario(this.idUsuario).subscribe((resp: Usuario)=>{
      this.usuario = resp
    })
  }

  publicar() {
    this.tema.id = this.idTema
    this.postagem.tema = this.tema

    this.usuario.id = this.idUsuario
    this.postagem.usuario = this.usuario

    this.postagemService.postPostagem(this.postagem).subscribe((resp: Postagem) => {
      this.postagem = resp
      alert('Postagem realizada com sucesso!')
      this.postagem = new Postagem()
      this.getPostagens()
    })
  }

}
