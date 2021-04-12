import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private test = new BehaviorSubject('default message');
  currentMessage = this.test.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.test.next(message);
  }
}
