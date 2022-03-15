import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validator, Validators} from "@angular/forms";
import {DishesService} from "../services/dishes.service";

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.css']
})
export class AddDishComponent implements OnInit {

  newDish = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    cuisine:  new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    category: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    type: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    ingredients: new FormControl('', [
      Validators.minLength(5)
    ]),
    price: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9,]*$')
    ]),
    maxAmount: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]*$')
    ]),
    imageLinks: new FormControl('', [
      Validators.required,
      Validators.pattern('^(http|https)\\:\\/\\/.{3,}$')
    ]),
    description: new FormControl(''),
  });

  dishesService: DishesService;

  constructor(dishesService: DishesService) {
    this.dishesService=dishesService;
  }

  ngOnInit(): void {
  }

  submit(form: FormGroupDirective){
    let values = form.value

    this.dishesService.addDish(values['name'], values['cuisine'], values['type'],
                              values['category'], values['ingredients'], Number(values['maxAmount']),
                              Number(values['price']), values['description'], new Array<string>(values['imageLinks']))
    this.newDish.reset();
  }

}
