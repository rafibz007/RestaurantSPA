import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  @Input('imgURLs') imagesURLs !: string[]
  @Input('boxSize') boxSize !: number

  currentPicture : number = 0

  constructor() { }

  ngOnInit(): void {
  }

  prev() : void{
    this.currentPicture = (this.currentPicture-1) >= 0 ? (this.currentPicture-1)%this.imagesURLs.length : (this.imagesURLs.length+this.currentPicture-1)%this.imagesURLs.length
  }

  next() : void{
    this.currentPicture = (this.currentPicture+1)%this.imagesURLs.length
  }

}
