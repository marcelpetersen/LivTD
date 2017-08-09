import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { tabHomePage } from '../tabHome/tabHome';
import { tabChatPage } from '../tabChat/tabChat';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    tabHome = tabHomePage;
    tabChat = tabChatPage;

  constructor(public navCtrl: NavController) {
  }

}
