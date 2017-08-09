import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
 

@Component({
  selector: 'page-stick',
  templateUrl: 'stick.html',
})
export class StickPage {

	gifs: Array<any>;

  	constructor(public navCtrl: NavController, public navParams: NavParams) {
  		this.gifs = [
	  		{url: "assets/2OjexZSRezABYhqWPuXA_LIVgiffy.gif"},
	  		{url: "assets/ZEnwiTznRmWqQs3bKHIa_giphy.gif"},
  		];
	}

	ionViewDidLoad() {
   		console.log('ionViewDidLoad StickPage');
	}

}
