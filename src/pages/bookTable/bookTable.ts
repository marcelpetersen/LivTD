import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';


@Component({
  selector: 'page-book-table',
  templateUrl: 'bookTable.html'
})
export class BookTablePage {
 	
 	token: any;
 	headers: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
  	this.token = '';
  	this.headers = new Headers();
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('X-Postmark-Server-Token', this.token);
  }

  submit() {
  	var data = {
  		From: '',
  		To: '',
  		Subject: '',
  		HtmlBody: '<html><body><strong>Hello</strong> dear Postmark user.</body></html>'
  	};
  	
  	this.http
	  	.post('https://cors-anywhere.herokuapp.com/https://api.postmarkapp.com/email', data, {
	    	headers: this.headers,
	  	})
	  	.subscribe(data => {
      		console.log(data);
    	});
  }

 
}
