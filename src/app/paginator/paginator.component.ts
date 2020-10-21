import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginator: any; 
  paginas:  number[];
  initRange: number;
  lastRange: number;

  constructor() { }

  ngOnInit(): void{
    this.initPagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let paginatorUpdated = changes['paginator'];
    if (paginatorUpdated.previousValue){
      this.initPagination();
    }
  }

  private initPagination(): void{
    this.initRange = Math.min(Math.max(1, this.paginator.number-4), this.paginator.totalPages-5);
    this.lastRange = Math.max(Math.min(this.paginator.totalPages, this.paginator.number+5), 6);
    if (this.paginator.totalPages > 10){
      this.paginas = new Array(this.lastRange - this.initRange + 1).fill(0).map((_value, indice) => indice+this.initRange);
    }else{
      this.paginas = new Array(this.paginator.totalPages).fill(0).map((_value, indice) => indice+1);
    }
  }

}
