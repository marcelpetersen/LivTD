import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowserProvider } from '../../providers/inAppBrowserProvider';


@Component({
  selector: 'page-fun',
  templateUrl: 'fun.html'
})
export class FunPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, public browser : InAppBrowserProvider) {}

  openLink(link) {
    this.browser.openURL(link);
  }
}
