import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Postagem } from '../model/Postagem';
import { Tema } from '../model/Tema';
import { Usuario } from '../model/Usuario';
import { AlertasService } from '../service/alertas.service';
import { AuthService } from '../service/auth.service';
import { PostagemService } from '../service/postagem.service';
import { TemaService } from '../service/tema.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  idUsuario = environment.id

  listaPostagens: Postagem[]
  postagem: Postagem = new Postagem()

  tema: Tema = new Tema()
  listaTemas: Tema[]
  idTema: number

  usuario: Usuario = new Usuario()

  constructor(
    private router: Router,
    private postagemService: PostagemService,
    private temaService: TemaService,
    public auth: AuthService,
    private alertas: AlertasService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    window.scroll(0, 0)

    if (environment.token == '') {
      this.alertas.showAlertDanger('Voce precisa estar logado para ficar aqui...')
      this.router.navigate(['/entrar'])
    }
    let id = this.route.snapshot.params['id']
    
    this.auth.refreshToken()
    this.temaService.refreshToken()
    this.postagemService.refreshToken()

    this.getPostagens()
    this.getTemas()

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
  findByIdPostagem(id: number) {
    this.postagemService.findByIdPostagem(id).subscribe((resp: Postagem) => {
      this.postagem = resp
    })
  }

  findByIdUsuario(){
    this.auth.findByIdUsuario().subscribe((resp: Usuario)=>{
      this.usuario = resp
    })
  }

  atualizar() {
    this.tema.id = this.idTema
    this.postagem.tema = this.tema

    this.postagemService.putPostagem(this.postagem).subscribe((resp: Postagem) => {
      this.postagem = resp
      this.alertas.showAlertSuccess('Postagem atualizado com sucesso!')
      this.router.navigate(['/inicio'])
    })
  }

  publicar() {
    this.postagemService.refreshToken()
    this.tema.id = this.idTema
    this.postagem.tema = this.tema

    this.usuario.id = this.auth.idUsuario
    this.postagem.usuario = this.usuario

    this.postagemService.postPostagem(this.postagem).subscribe((resp: Postagem) => {
      this.postagem = resp
      this.alertas.showAlertSuccess('Postagem realizada com sucesso!')
      this.postagem = new Postagem()
      this.getPostagens()
    })
  }

  apagar(){
    this.postagemService.deletePostagem(this.postagem.id).subscribe(()=>{
      this.alertas.showAlertSuccess('Postagem apagada com sucesso!')
      this.router.navigate(['/inicio'])
    })
  }

}
