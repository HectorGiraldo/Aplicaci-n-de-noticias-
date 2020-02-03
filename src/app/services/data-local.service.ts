import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Article } from '../interfaces/interfaces';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  noticias: Article[] = [];

  constructor(
    private storage: Storage,
    private toastCtrl: ToastController
  ) {
    this.cargarFavoritos();
   }

   async presentToast( message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  guardarNoticias( noticia: Article ) {

    const existe = this.noticias.find( noti => noti.title === noticia.title );

    if ( !existe ) {

      this.noticias.unshift( noticia );
      this.storage.set( 'favorito', this.noticias );
    }

    this.presentToast( 'Guardado en favoritos!!!' );
  }

  async cargarFavoritos() {

    const favorito = await this.storage.get( 'favorito' );

    if ( favorito ) {

      this.noticias = favorito;
    }


  }

  borrarNoticia( noticia: Article) {

    this.noticias = this.noticias.filter( noti => noti.title !== noticia.title);
    this.storage.set( 'favorito', this.noticias );
    this.presentToast( 'Borrado de favoritos :(' );
  }

}
