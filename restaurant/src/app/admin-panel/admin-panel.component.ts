import { Component, OnInit } from '@angular/core';
import {Role} from "../role";
import {HttpClient} from "@angular/common/http";
import {ApiConnectionService} from "../services/api-connection.service";
import {UserService} from "../user.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  users : Array<SimplifiedUser> = []

  constructor(private http : HttpClient, private api : ApiConnectionService, public loggedUser : UserService) {

  }

  CLIENT = Role.CLIENT
  MANAGER = Role.MANAGER
  ADMIN = Role.ADMIN

  ngOnInit(): void {
    this.http.get<Array<{
      _id:string,
      username:string,
      email:string,
      rolesIDs:Array<string>,
      isBanned:boolean
    }>>(this.api.USER_URL).subscribe({
      next:(res)=>{
        this.users = []
        for (let user of res){
          let roles = new Set<Role>()
          for (let roleID of user.rolesIDs){
            if (roleID === "0") roles.add(Role.ADMIN)
            else if (roleID === "1") roles.add(Role.MANAGER)
            else if (roleID === "2") roles.add(Role.CLIENT)
          }

          this.users.push({
            _id:user._id,
            username:user.username,
            email:user.email,
            rolesIDs:roles,
            isBanned:user.isBanned,
            updateSucceeded: null,
            changed: false
          })
        }
      }
    })
  }

  makeClient(user : SimplifiedUser){
    user.updateSucceeded = null
    user.changed = true
    user.rolesIDs.add(Role.CLIENT)
  }
  unmakeClient(user : SimplifiedUser){
    user.updateSucceeded = null
    user.changed = true
    user.rolesIDs.delete(Role.CLIENT)
  }

  makeManager(user : SimplifiedUser){
    user.updateSucceeded = null
    user.changed = true
      user.rolesIDs.add(Role.MANAGER)
  }
  unmakeManager(user : SimplifiedUser){
    user.updateSucceeded = null
    user.changed = true
      user.rolesIDs.delete(Role.MANAGER)
  }

  makeAdmin(user : SimplifiedUser){
    user.updateSucceeded = null
    user.changed = true
      user.rolesIDs.add(Role.ADMIN)
  }
  unmakeAdmin(user : SimplifiedUser){
    user.updateSucceeded = null
    user.changed = true
      user.rolesIDs.delete(Role.ADMIN)
  }

  ban(user : SimplifiedUser){
    user.updateSucceeded = null
    user.changed = true
    user.isBanned = true
  }
  unban(user : SimplifiedUser){
    user.updateSucceeded = null
    user.changed = true
    user.isBanned = false
  }

  submitChanges(user:SimplifiedUser, index : number){
    let rolesIDs = []
    for (let role of user.rolesIDs)
      rolesIDs.push(role.toString())

    this.http.put<{
      _id:string,
      username:string,
      email:string,
      rolesIDs:Array<string>,
      isBanned:boolean
    }>(this.api.USER_URL + `/${user._id}`, { isBanned:user.isBanned, rolesIDs: rolesIDs }).subscribe({
      next:(res)=>{
        let roles = new Set<Role>()
        for (let roleID of res.rolesIDs){
          if (roleID === "0") roles.add(Role.ADMIN)
          else if (roleID === "1") roles.add(Role.MANAGER)
          else if (roleID === "2") roles.add(Role.CLIENT)
        }

        this.users[index] = {
          _id:user._id,
          username:user.username,
          email:user.email,
          rolesIDs:roles,
          isBanned:user.isBanned,
          updateSucceeded: true,
          changed: false
        }

      },
      error:(res)=>{
        user.updateSucceeded = false
      }
    })
  }

  test(user : SimplifiedUser){
    console.log(user)
  }
}

interface SimplifiedUser{
  _id:string,
  username:string,
  email:string,
  rolesIDs:Set<Role>,
  isBanned:boolean,
  updateSucceeded: boolean | null,
  changed: boolean
}
