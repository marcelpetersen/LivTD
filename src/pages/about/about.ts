import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { AlertProvider } from '../../providers/alert'

declare var google;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements AfterViewInit {
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  latLng: any;
  email: string = "events@LIVnightclub.com";
  mediaEmail: string = "press@LIVnightclub.com";
  address: string = "4441 Collins Avenue Miami Beach, FL 33140";
  phone: string = "+1 305 674 4680";
  lostItemPhone: string = "+1 305 674 4680";
  officialPhone: string = "+1 305 674 4680";
  latitude: number = 25.817853;
  longitude: number = -80.122189;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public clipboard: Clipboard, private emailComposer: EmailComposer 
    , private launchNavigator: LaunchNavigator, public alertProvider: AlertProvider) {

	  this.latLng = new google.maps.LatLng(this.latitude, this.longitude);
  }	

  loadMap():void {
	
  	let mapOptions = {
  		center: this.latLng,
  		zoom: 15,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
  	}

  	this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  	let marker = new google.maps.Marker({
  		map: this.map,
  		animation: google.maps.Animation.DROP,
  		position: this.latLng,
  		title:"LIV Miami",
  		optimized: false
  	});

  }

 
  ngAfterViewInit() {
	  this.loadMap();
  }

  onAddressClick() {
  	let addressAlert = this.alertCtrl.create({
  		buttons:[
  		{
  			text: "Open in Maps",
  			handler: () => {
					this.launchNavigator.navigate([this.latitude, this.longitude]);
  			}
  		},

		{
			text: "Copy Address",
			handler: () => {
				this.clipboard.copy(this.address);
				this.alertProvider.presentCopyToast();
			}
		}
  		]
  	})

	  addressAlert.present();
  }



  onEmailClick(email) {
  	let emailMessage = {
  		to: email,
  	  };
  	this.emailComposer.open(emailMessage);
  }

}
