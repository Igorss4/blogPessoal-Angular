import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/model/Usuario';
import { AlertasService } from 'src/app/service/alertas.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-usuario-edit',
  templateUrl: './usuario-edit.component.html',
  styleUrls: ['./usuario-edit.component.css']
})
export class UsuarioEditComponent implements OnInit {

  usuario: Usuario = new Usuario()
  idUsuario: number
  confirmarSenha: string
  tipoUsuario: string

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private alertas: AlertasService
  ) { }

  ngOnInit() {
    window.scroll(0, 0)

    if (environment.token == '') {
      this.router.navigate(['/entrar'])
    }
    this.auth.refreshToken()
    this.idUsuario = this.route.snapshot.params['id']
    this.findByIdUsuario()
  }

  confirmSenha(event: any) {
    this.confirmarSenha = event.target.value
  }

  tipoUser(event: any) {
    this.tipoUser = event.target.value
  }

  atualizar() {
    this.usuario.tipo = this.tipoUsuario
    this.usuario.postagem = []
    if (this.usuario.senha == this.confirmarSenha) {
      this.auth.cadastrar(this.usuario).subscribe((resp: Usuario) => {
        this.usuario = resp
        this.alertas.showAlertSuccess('Usuario atualizado com sucesso!')
        environment.token = ''
        environment.nome = ''
        environment.foto = ''
        environment.id = 0
        this.router.navigate(['/entrar'])
      })
    } else {
      this.alertas.showAlertDanger('Senhas erradas')
    }
  }

  validaEmailEdit() {
    let regex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/

    if(this.usuario.usuario.match(regex)) {
      let usuario = (<HTMLDivElement>document.querySelector('#usuarioEdit'))
      usuario.style.borderColor = 'green';
      usuario.style.boxShadow = '0 0 1em green';
    }
    else{
      let usuario = (<HTMLDivElement>document.querySelector('#usuarioEdit'))
      usuario.style.borderColor = 'red';
      usuario.style.boxShadow = '0 0 1em red';
    }
  }

  validaNomeEdit(){
    let nomeEdit = this.usuario.nome
    let usuarioNomeEdit = (<HTMLDivElement>document.getElementById('nomeEdit'))
    if (this.usuario.nome.length > 2) {
      usuarioNomeEdit.style.borderColor = 'green';
      usuarioNomeEdit.style.boxShadow = '0 0 1em green';

    } else {
      usuarioNomeEdit.style.borderColor = 'red';
      usuarioNomeEdit.style.boxShadow = '0 0 1em red';
    }
  }

  findByIdUsuario() {
    this.auth.findByIdUsuario().subscribe((resp: Usuario) => {
      this.usuario = resp
    })
  }

  apagar(){
    this.auth.deleteUsuario(this.auth.idUsuario).subscribe(()=>{
      this.alertas.showAlertSuccess('Usuario apagado com sucesso!')
      this.router.navigate(['/entrar'])
      environment.token = ''
    environment.nome = ''
    environment.foto = ''
    environment.id = 0
    })
  }

}
