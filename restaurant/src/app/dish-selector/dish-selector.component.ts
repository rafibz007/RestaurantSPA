import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Dish} from "../dish";
import {AddButtonComponent} from "../add-button/add-button.component";
import {RemoveButtonComponent} from "../remove-button/remove-button.component";
import {DishesService} from "../services/dishes.service";

@Component({
  selector: 'app-dish-selector',
  templateUrl: './dish-selector.component.html',
  styleUrls: ['./dish-selector.component.css']
})
export class DishSelectorComponent implements OnInit {

  @Input() dish !: Dish

  @ViewChild('add') addButton !: AddButtonComponent
  @ViewChild('remove') removeButton !: RemoveButtonComponent

  constructor(private dishService : DishesService, private cd : ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    if (this.dish === undefined)
      return

    if (this.addButton !== undefined){
      if (this.dish.selectedAmount >= this.dish.maxServingAmount) {
        this.addButton.lock()
      } else {
        this.addButton.unlock()
      }
    }


    if (this.removeButton !== undefined){
      if (this.dish.selectedAmount <= 0) {
        this.removeButton.lock()
      } else {
        this.removeButton.unlock()
      }
    }

    this.dishService.updateSelection(this.dish)

    this.cd.detectChanges()
  }

}
