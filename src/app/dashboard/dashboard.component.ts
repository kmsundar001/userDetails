import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dataService } from '../data.service';
import { ServiceAPIService } from '../service-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public userDetailsArray:any = [];
   public count:any;
   public userId:any;
  constructor(private router: Router, private serverAPI: ServiceAPIService) { }

  ngOnInit(): void {
    this.serverAPI.getUser().subscribe(res => {
      console.log(res);
      var obj = JSON.parse(JSON.stringify(res));
      this.count = res.length;
      this.userDetailsArray = obj.filter((x:any) => { return x.id != "0"}); 
    })
  }
  activeUser(id:any){
    this.userId = id;
  }
  deleteUser(id:any){

  }
  editUser(user:any){
    var send = {
      flow: "edit",
      userDetails : user
    }
    dataService.setEditUser(send);
    this.router.navigateByUrl("/register")
  }
}
