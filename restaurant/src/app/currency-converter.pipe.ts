import { Pipe, PipeTransform } from '@angular/core';
import {CurrencyOptionsService} from "./services/currency-options.service";

@Pipe({
  name: 'currencyConverter'
})
export class CurrencyConverterPipe implements PipeTransform {

  constructor() {
  }

  transform(value: number): string {
    return (Math.round(value*100*CurrencyOptionsService.pickedCurrency.converter)/100).toString() + CurrencyOptionsService.pickedCurrency.currency
  }

}
