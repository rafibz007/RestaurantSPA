import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination-selector',
  templateUrl: './pagination-selector.component.html',
  styleUrls: ['./pagination-selector.component.css']
})
export class PaginationSelectorComponent implements OnInit {

  @Input() perPage !: number
  @Output() perPageChange = new EventEmitter<number>()

  setPerPage(value : number){
    this.perPage = value
    this.perPageChange.emit(this.perPage)
  }

  constructor() { }

  ngOnInit(): void {
    this.setPerPage(10)
  }

}
