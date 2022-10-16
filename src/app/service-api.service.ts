import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class ServiceAPIService {
public GetURL:any = "http://localhost:3000/user/";
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
  public deleteUser(id:any, data: any) {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.GetURL+id);
  }
}
