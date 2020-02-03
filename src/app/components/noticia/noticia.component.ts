import { Component, OnInit, Input } from '@angular/core';
import { Article } from 'src/app/interfaces/interfaces';

// Plugins
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, ToastController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

  @Input() noticia: Article;
  @Input() index: number;
  @Input() enFavoritos;

  constructor(
    private iab: InAppBrowser,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private dataLocalService: DataLocalService,
    private toastCtrl: ToastController,
    private platform: Platform
  ) { }

  ngOnInit() {}


  abrirNoticia() {
    console.log('noticia', this.noticia.url);
    const browser = this.iab.create(this.noticia.url, '_system');

  }



  async lanzarMenu() {

    let guardarBorrarBtn;

    if ( this.enFavoritos ) {
      guardarBorrarBtn = {
        text: 'Borrar Favorito',
        icon: 'trash',
        cssClass: 'action-dark',
        handler: () => {
          console.log('borrar favorito clicked');
          this.dataLocalService.borrarNoticia( this.noticia );

        }
      };

    } else {
      guardarBorrarBtn = {
        text: 'Favoritos',
        icon: 'heart',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Favorite clicked');
          this.dataLocalService.guardarNoticias( this.noticia );

        }
      };
    }

    const actionSheet = await this.actionSheetCtrl.create({

      buttons: [{
        text: 'Compartir',
        icon: 'share',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Share clicked');

          this.compartirNoticia();

        }
      },
        guardarBorrarBtn,

       {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Cancel clicked');

        }
      }]
    });
    await actionSheet.present();
  }

  compartirNoticia() {

    if ( this.platform.is('cordova') ) {
      this.socialSharing.share(
        this.noticia.title,
        this.noticia.source.name,
        '',
        this.noticia.url
      );

    } else {
      if (navigator['share']) {
        navigator['share']({
            title: this.noticia.title,
            text: this.noticia.description,
            url: this.noticia.url,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else {
        console.log('no soporta el share');

      }
    }



  }

}
