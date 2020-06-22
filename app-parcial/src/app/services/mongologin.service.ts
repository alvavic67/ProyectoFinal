import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const urlAPI = environment.API.EndPoint.NodeJS;

@Injectable({
  providedIn: 'root'
})
export class MongologinService {

  constructor(private http: HttpClient) {

  }

  getAuth(user: any){
    return this.http.get(`${urlAPI}auth/login`, user);
  }

}
