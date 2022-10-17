import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dataService } from '../data.service';
import { ServiceAPIService } from '../service-api.service';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
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
      this.getUser();
  }
  getUser(){
    this.serverAPI.getUser().subscribe(res => {
      console.log(res);
      var obj = JSON.parse(JSON.stringify(res));
      this.count = res.length;
      this.userDetailsArray = obj.filter((x:any) => { return x.id != "0"}); 
    })
  }
  activeUser(user:any){
    this.userId = user.id;
    var send = {
      active : user.active
    }
    this.serverAPI.updateUser(this.userId,send).subscribe( res => {
      alert("user active status updated successfully");
    })
  }
  deleteUser(id:any){
    this.userId = id;
    $("#exampleModal").modal('show');
  }
  confirmDelete(action:any){
      if( action == "yes" ){
          this.serverAPI.deleteUser(this.userId).subscribe( res => {
            console.log("deleted Successfully");
            this.getUser();
          })
      } else{
        $("#exampleModal").modal('hide');
      }
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
