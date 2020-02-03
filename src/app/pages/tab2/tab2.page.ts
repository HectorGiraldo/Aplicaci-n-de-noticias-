import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSegment, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { NoticiasService } from 'src/app/services/noticias.service';
import { Article } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  @ViewChild(IonSegment) segment: IonSegment;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) IonContent: IonContent;

  categorias = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

  noticias: Article[] = [];

  constructor(
    private noticiasService: NoticiasService
  ) {}

  ngOnInit() {

    this.segment.value = this.categorias[0];

    this.cargarNoticias( this.segment.value );
  }

  cambioCategoria( event ) {

    this.infiniteScroll.disabled = false;
    this.IonContent.scrollToTop();

    this.noticias = [];

    this.cargarNoticias( event.detail.value );

  }

  loadData( event ) {
    // console.log( event );
    this.cargarNoticias( this.segment.value, event );
  }

  cargarNoticias( categoria: string, event? ) {

    this.noticiasService.topHeadlinesCategorias( categoria ).subscribe( resp => {

      // console.log('noticias', resp );

      if ( resp.articles.length === 0) {
        this.infiniteScroll.disabled = true;
        event.target.complete();
        return;
      }
      this.noticias.push( ...resp.articles );

      if ( event ) {
        event.target.complete();
      }
    });
  }

 
}
