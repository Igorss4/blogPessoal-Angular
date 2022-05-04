import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-tema',
  templateUrl: './tema.component.html',
  styleUrls: ['./tema.component.css']
})
export class TemaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    window.scroll(0, 0)

    if (environment.token == '') {
      alert('Voce precisa estar logado para ficar aqui...')
      this.router.navigate(['/entrar'])
    }
}
}
