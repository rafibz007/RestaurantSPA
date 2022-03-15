import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {CommentService} from "../services/comment.service";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginCredentials = new FormGroup({
    usernameOrEmail: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
  })

  errorBox : Array<string> = []

  constructor(private auth : AuthService, private router : Router, private user : UserService) {

  }

  ngOnInit(): void {
  }

  onSubmit(form : FormGroupDirective){
    let values = form.value

    this.auth.login(values.usernameOrEmail, values.usernameOrEmail, values.password).subscribe(
      next => {
        this.loginCredentials.reset()
        if (this.auth.setSession(next)){
          this.errorBox = []
          this.router.navigateByUrl('/')
        } else {
          this.errorBox = ["Błędna nazwa użytkownika/email lub hasło"]
        }
      },
      error => {
        this.loginCredentials.reset()
        this.errorBox = ["Błędna nazwa użytkownika/email lub hasło"]
      }
    )

  }

}

