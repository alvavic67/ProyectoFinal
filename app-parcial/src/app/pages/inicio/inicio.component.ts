import { Component, OnInit } from '@angular/core';
import { MongologinService } from 'src/app/services/mongologin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  Usuario: any;
  Pass: any;
  Pagina = null;

  constructor(private auth: MongologinService, private router: Router) { }

  userBody = {
    userName: '',
    password: ''
  };

  userOK: boolean;
  userRol: string;


  ngOnInit(): void {
  }

  iniciarSesion(){
    this.userBody.userName = this.Usuario.text;
    this.userBody.password = this.Pass.text;
    this.auth.getAuth(this.userBody).subscribe((result: any) => {
      this.userOK = result.ok;
      if (!this.userOK) {
        this.router.navigate(['/inicio']);
      }else{
        this.userRol = result.rol;
        if (this.userRol === 'ROL_PIE') {
          this.router.navigate(['/top5']);
        }
        this.router.navigate(['/histograma']);
      }
    });
  }
}
