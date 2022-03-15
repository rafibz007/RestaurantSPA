import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit, SimpleChanges,
} from '@angular/core';
import {DishesService} from "../services/dishes.service";
import {Dish} from "../dish";
import {PaginationSelectorComponent} from "../pagination-selector/pagination-selector.component";
import {Observable} from "rxjs";

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DishesListComponent implements AfterViewChecked, OnInit, OnChanges {

  dishesList : Dish[] = []
  amount: number = 0

  loading : boolean = true

  lowestPrice : number
  highestPrice : number

  page : number = 1
  perPage : number


  constructor(private dishService : DishesService, private cd : ChangeDetectorRef) {

    dishService.getLoading$().subscribe(
      next => {
        this.loading = next
      }
    )

    dishService.getDishes().subscribe( next => {
      this.dishesList = next
      this.lowestPrice = this.lowestPriceInFiltered()
      this.highestPrice = this.highestPriceInFiltered()
    })

    this.lowestPrice = this.lowestPriceInFiltered()
    this.highestPrice = this.highestPriceInFiltered()

    this.perPage = 10
  }

  ngAfterViewChecked() {
    this.cd.detectChanges()
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.lowestPrice = this.lowestPriceInFiltered()
    this.highestPrice = this.highestPriceInFiltered()

    this.cd.detectChanges()
  }


  lowestPriceInFiltered() : number {
    let _min = Infinity
    for (let dish of this.dishesList){
      _min = Math.min( dish.price, _min )
    }

    return _min
  }


  highestPriceInFiltered() : number {
    let _max = -Infinity
    for (let dish of this.dishesList){
      _max = Math.max( dish.price, _max )
    }

    return _max
  }




  nextPage(){
    if (this.dishesList.slice((this.page)*this.perPage, (this.page)*this.perPage + this.perPage).length > 0)
      this.page += 1
  }

  prevPage(){
    this.page = Math.max(1, this.page-1)
  }

  trackByIndex(index : number, item : Dish){
    return item._id
  }

}
