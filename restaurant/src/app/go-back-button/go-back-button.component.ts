import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { Location } from '@angular/common'

@Component({
  selector: 'app-go-back-button',
  templateUrl: './go-back-button.component.html',
  styleUrls: ['./go-back-button.component.css']
})
export class GoBackButtonComponent implements OnInit {
  history : Array<string> = []

  constructor(private router : Router, private location : Location) {
  }

  ngOnInit(): void {
  }

  back(){
    this.location.back()
  }

}
