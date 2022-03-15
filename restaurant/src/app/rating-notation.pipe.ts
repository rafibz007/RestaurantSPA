import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingNotation'
})
export class RatingNotationPipe implements PipeTransform {

  transform(rating: number): string {

    if (rating < 1000){
      return rating.toString()
    } else if (rating < 1000000){
      return Math.round(rating/1000).toString() + "k"
    } else {
      return Math.round(rating/1000000).toString() + "m"
    }

  }

}
