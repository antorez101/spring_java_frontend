import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;

  private _uploadImage : EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  get uploadImage(){
    return this._uploadImage;
  }

  openModal(){
    this.modal = true;
  }

  closeModal(){
    this.modal = false;
  }
}
