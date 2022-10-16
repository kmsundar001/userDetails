import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dataService } from '../data.service';
import { ServiceAPIService } from '../service-api.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private serverAPI: ServiceAPIService) { }
  public name: any;
  public userName: any;
  public email: any;
  public password: any;
  public repeatPass: any;
  public profilePic: any;
  public gender: any;
  public education: any;
  public emailFlag: boolean = false;
  public passFlag: boolean = false;
  public rePassFlag: boolean = false;
  public usernameFlag:boolean = false
  public image: any;
  public userId:any
  public title:any = "CREATE AN ACCOUNT";
  public submitLable = "Register";
  public editFlag:boolean = false;
  public userList:any = [];
  public hobbiesArray = [
    { "name": "Reading", "checked": false },
    { "name": "Traveling", "checked": false },
    { "name": "Fishing", "checked": false },
    { "name": "Television", "checked": false },
    { "name": "Bird Watching", "checked": false },
    { "name": "Collecting ", "checked": false },
    { "name": "Music", "checked": false },
    { "name": "Gardening", "checked": false },
    { "name": "Video Games", "checked": false },
    { "name": "Crafting", "checked": false },
  ]
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  ngOnInit(): void {
    if( dataService.getEditUser() != undefined ){
        var getUser = dataService.getEditUser().userDetails;
        this.editFlag = true;
        this.userId = getUser.id
        this.name = getUser.name;
        this.userName = getUser.userName;
        this.email = getUser.email;
        this.password = getUser.password;
        this.repeatPass = getUser.password;
        this.gender = getUser.gender;
        this.education = getUser.education;
        this.emailFlag = true;
        this.passFlag = true;
        this.rePassFlag = true;
        this.title = "Edit User Account";
        this.submitLable = "Update";
        this.hobbiesArray.forEach(element => {
            element.checked = getUser.hobbies.indexOf(element.name) != -1 ? true : false;
        });
       
    }
  }
  login() {
    this.router.navigateByUrl("login");
  }
  checkValidation(type: string) {
    if (type == "email") {
      if (this.email.length > 2) {
        this.emailFlag = this.validateEmail(this.email) ? true : false;
      }

    } else if (type == "pass") {
      this.passFlag = this.validatePassword(this.password) ? true : false;
    } else if(type == "userName"){
        if( this.userName.length > 2 ){
              this.serverAPI.getUser().subscribe(res => {
                var obj = JSON.parse(JSON.stringify(res));
                let temp = obj.filter((o :any) => {return o.userName == this.userName});
                this.usernameFlag = temp.length != 1 ? true : false
              });
        }else{
          this.usernameFlag = false;
        }
    } else {
      this.rePassFlag = this.password == this.repeatPass ? true : false;
    }

  }
  validateEmail(email: any) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }
  validatePassword(password: any) {
    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()+=-\?;,./{}|\":<>\[\]\\\' ~_]).{8,}/
    var test = re.test(password);
    console.log(test);
    return test;
  }
  chooseImg(event: any) {
    const reader = new FileReader();
     
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.myForm.patchValue({
          fileSource: reader.result
        });
      };
    }
  }

  async addUser() {
    console.log(this.myForm.value);
    // this.http.post('http://localhost:8001/upload.php', this.myForm.value)
    //   .subscribe(res => {
    //     console.log(res);
    //     alert('Uploaded Successfully.');
    //   })
    var today: any = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = dd + '-' + mm + '-' + yyyy;
        var fileName = this.userName + "(" + today + ")";
        let uploadImg = new FormData();
        uploadImg.set("name", fileName);
        uploadImg.set("file", this.image);
        this.http.post('http://localhost/demo/images/', uploadImg).subscribe(res => {
          console.log("res" + JSON.stringify(res))
        });
    if (this.userName != undefined && this.emailFlag == true && this.passFlag == true && this.rePassFlag == true && this.usernameFlag) {
      this.serverAPI.getUser().subscribe(res => {
        console.log(res);
        var obj = JSON.parse(JSON.stringify(res));
        var lastId = obj.filter((x: any, i: any) => { i == (x.length - 1) }).map((x: any) => { return x.id });
        var count = parseInt(lastId) + 1;
        
        var getHobbis = this.hobbiesArray.filter(x => x.checked == true).map((x) => { return x.name });
        var sendData:any;
        if( this.editFlag == true ){
          sendData = {
            "name": this.name,
            "userName": this.userName,
            "email": this.email,
            "password": this.password,
            "profilePic": fileName,
            "gender": this.gender,
            "education": this.education,
            "hobbies": getHobbis,
            "active": true,
            "delStatus": false
          }
          console.log("send" + JSON.stringify(sendData))
          this.serverAPI.updateUserAllDate(this.userId,sendData).subscribe(res => {
            var obj = JSON.parse(JSON.stringify(res));
            this.router.navigateByUrl("/dashboard");
          })

        }else{
          sendData = {
            "id": count,
            "name": this.name,
            "userName": this.userName,
            "email": this.email,
            "password": this.password,
            "profilePic": fileName,
            "gender": this.gender,
            "education": this.education,
            "hobbies": getHobbis,
            "active": true,
            "delStatus": false
          }
          console.log("send" + JSON.stringify(sendData))
          this.serverAPI.postUser(sendData).subscribe(res => {
            var obj = JSON.parse(JSON.stringify(res));
            dataService.setUserId(obj.id);
            this.router.navigateByUrl("viewuser")
          })
        }
       
      })
    } else {
      alert("!Please Fill all mandatory fields ")
    }
  }
}
