import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class ServiceAPIService {
//public GetURL:any = "http://localhost:3000/user/";
public GetURL:any = "https://dataservice01.herokuapp.com/user/"
// public GetURL:any = "https://my-json-server.typicode.com/kmsundar001/userBackEnd/user"
  constructor(private http: HttpClient) { }
  public getUser() {
    return this.http.get(this.GetURL).pipe(map((res:any) => { return res }))
  }
  public postUser(data: any) {
    return this.http.post(this.GetURL,data).pipe(map((res:any) => { return res }))
  }
  public updateUser( id:any, data: any) {
    return this.http.patch(this.GetURL+id,data).pipe(map((res:any) => { return res }))
  }
  public updateUserAllDate( id:any, data: any) {
    return this.http.put(this.GetURL+id,data).pipe(map((res:any) => { return res }))
  }
  public deleteUser(id:any) {
    return this.http.delete(this.GetURL+id).pipe(map((res:any) => { return res }))
  }
}
