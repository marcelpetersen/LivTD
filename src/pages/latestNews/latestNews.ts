import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


declare var cordova;

@Component({
  selector: 'page-latest-news',
  templateUrl: 'latestNews.html'
})
export class LatestNewsPage implements OnInit  {

  	constructor(public navCtrl: NavController, public navParams: NavParams)  {
   	

  	}

	ngOnInit() {
		

	}
}
