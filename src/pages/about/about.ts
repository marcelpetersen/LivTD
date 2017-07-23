import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

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
  address: string = "4441 Collins Avenue Miami Beach, FL 33140";
  phone: string = "+1 305 674 4680";
  latitude: number = 25.817853;
  longitude: number = -80.122189;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, 
	  public clipboard: Clipboard, public callNumber: CallNumber, private emailComposer: EmailComposer, private launchNavigator: LaunchNavigator) {

	  this.latLng = new google.maps.LatLng(this.latitude, this.longitude);
  }	

  loadMap():void {
	
	let mapOptions = {
		center: this.latLng,
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

	
	// this.map.addMarker({
	// 	animation: google.maps.Animation.DROP,
	// 	position: this.latLng,
	// 	name : "LIV Miami",
	// 	title : "LIV Miami",
	// });

	let marker = new google.maps.Marker({
		map: this.map,
		animation: google.maps.Animation.DROP,
		position: this.latLng,
		title:"LIV Miami",
		optimized: false
	});

	/*let content = "<h3>LIV Miami</h3>";  
	this.addInfoWindow(marker, content);*/
  }

  /*addInfoWindow(marker, content) {

	  let infoWindow = new google.maps.InfoWindow({
		  content: content
	  });

	  google.maps.event.addListener(marker, 'click', () => {
		infoWindow.open(this.map, marker);
	  });

  }*/

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
				console.log("Copied");
			}
		}
  		]
  	})

	addressAlert.present();
  }

  onPhoneClick() {
	  this.callNumber.callNumber(this.phone, true)
		  .then(() => console.log('Launched dialer!'))
		  .catch(() => console.log('Error launching dialer'));
  }

  onEmailClick() {
	let email = {
		to: this.email,
	  };
	this.emailComposer.open(email);
  }

}
