import { EventEmitter, Injectable } from "@angular/core";


@Injectable()
export class LoaderProvider {

  loader: EventEmitter<number> = new EventEmitter();

  constructor() { 

  }
  showLoader() {
    this.loader.emit(1);
  }
  hideLoader() {
    this.loader.emit(0);
  }
}
