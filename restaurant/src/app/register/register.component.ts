import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../user.service";
import {HttpClient} from "@angular/common/http";
import {ApiConnectionService} from "../services/api-connection.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerCredentials = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.min(3),
      Validators.max(15),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.min(3),
    ]),
  })

  errorBox : Array<string> = []

  constructor(private auth : AuthService, private router : Router, private http : HttpClient, private api : ApiConnectionService) {

  }

  ngOnInit(): void {
  }

  onSubmit(form : FormGroupDirective){
    let values = form.value

    this.http.post<{registration:boolean, error:string}>(this.api.BASE_URL + "/register", {username:values.username, email:values.email, password:values.password}).subscribe(
      {
        next : (next) => {
          if (next.registration){
            this.registerCredentials.reset()
            this.errorBox = []
            this.router.navigateByUrl('/login')
          } else {
            this.errorBox = [next.error]
          }
        },
        error: (error) =>{
          this.errorBox = [error.error.error]
        }
      }
    )
  }

}
