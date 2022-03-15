import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyOptionsService {
  static CURRENCIES = [
    {id: 0, currency: 'zł', converter: 1}, //default
    {id: 1, currency: '$', converter: 0.25},
    {id: 2, currency: '£', converter: 0.18},
  ]
  static pickedCurrency = CurrencyOptionsService.CURRENCIES[2]

}
