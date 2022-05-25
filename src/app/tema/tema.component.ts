import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Tema } from '../model/Tema';
import { AlertasService } from '../service/alertas.service';
import { AuthService } from '../service/auth.service';
import { TemaService } from '../service/tema.service';

@Component({
  selector: 'app-tema',
  templateUrl: './tema.component.html',
  styleUrls: ['./tema.component.css']
})
export class TemaComponent implements OnInit {

  tema: Tema = new Tema()
  listaTemas: Tema[]

  constructor(
    private router: Router,
    private auth: AuthService,
    private temaService: TemaService,
    private alertas: AlertasService
    ) { }

  ngOnInit() {
    window.scroll(0, 0)

    if (environment.token == '') {
      this.alertas.showAlertDanger('Voce precisa estar logado para ficar aqui...')
      this.router.navigate(['/entrar'])
    }
    this.temaService.refreshToken()
    this.buscarTemas()
}

buscarTemas(){
  this.temaService.getTemas().subscribe((resp: Tema[]) =>{
    this.listaTemas = resp;
  })
}

cadastrarTema(){
  this.temaService.refreshToken()
  this.temaService.postTema(this.tema).subscribe((resp: Tema)=> {
    this.tema = resp;
    this.alertas.showAlertSuccess('Tema cadastrado com sucesso')
    this.tema = new Tema()
    this.buscarTemas()
  })
}

}
