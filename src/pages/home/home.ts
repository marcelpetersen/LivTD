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
  
  	/*this.storage.getItem('curent_user').then((data:any)=>{
  		console.log("Display name:"+data['displayName']);
  		console.log("Email:"+data['email']);
  		console.log("Photo URL:"+data['photoURL']);
  		console.log("DOB:"+data['dob']);
  	});*/
  }

}
