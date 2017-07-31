import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebaseProvider'
import { StorageProvider } from '../../providers/storage'
import { CameraProvider } from '../../providers/camera'
import { Events } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { AlertController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert'

import { CaretEvent, EmojiEvent} from "angular2-emoji-picker";


@Component({
  selector: 'page-tabChat',
  templateUrl: 'tabChat.html'
})
export class tabChatPage {
	userID: string;
	displayName: string;
	recieverID: string = "";
	chatRef: any;
	messageText: string = "";
	pictureURL: string = null;
	userPhotoURL: string;
	messageStory: Array<any> = [];
	chatUsers: Array<any> = [];

	public eventMock;
  	public eventPosMock;
  	private _lastCaretEvent: CaretEvent;


	isInitComplete: boolean = false;

    @ViewChild(Content) content: Content
	
  	constructor(public navCtrl: NavController, public element: ElementRef, public navParams: NavParams, public firebaseProvider : FirebaseProvider, public storageProvider : StorageProvider, 
			public cameraProvider: CameraProvider, events: Events, public clipboard: Clipboard, public alertCtrl: AlertController,public alertProvider: AlertProvider) {
		
		this.storageProvider.getItem('curent_user').then(data => {
			this.userID = data.id
			this.userPhotoURL = data.photoURL;
			this.displayName = data.displayName;
		});
		
	  	this.chatRef = this.firebaseProvider.getChatRef(); 

		this.chatRef.on('child_added', data => { 
			if(this.isInitComplete)
				this.addMessage(data.val()) 
		});
	
		this.chatRef.orderByChild("date").once('value', data => {
			
			this.initMessageStory(data);
		});

		events.subscribe('changedPhoto', (imageData, toUpload: boolean) => {							
			if(!toUpload)
			this.firebaseProvider.uploadChatPhoto(imageData).then(url => {
				this.pictureURL = url 
				this.sendMessage();
				});
		}); 
    }

   //  //scrolls to bottom whenever the page has loaded
  	// ionViewDidEnter(){
  	// 	// this.content.scrollToBottom();
	  //   // var res = this.element.nativeElement.querySelector('.chatLog');
	  //   console.log(this.content);
   //   //    res.scrollBottom = 500;
  	// }

	initMessageStory(snapshot: any) {
		
		let snapshotObj = snapshot.val();
		if (snapshotObj) {
			var keyNames = Object.keys(snapshotObj);
			for (let name of keyNames) {
				//console.log(snapshotObj[name]);
				this.addMessage(snapshotObj[name]);
			}
			
		}
		this.isInitComplete = true;
		console.log(this.chatUsers);
		console.log(this.messageStory);
    }

    
   	
  	addMessage(data) {
		let msgData = data;
		msgData.displayName = "";
		msgData.photoURL = "";
		this.messageStory.push(msgData);
		

		let chatUser = this.chatUsers.find(user => { return user.uid === data.senderID });
		console.log(chatUser);
		if (chatUser === undefined) {
			chatUser = {
				uid: data.senderID,
				displayName: "",
				photoURL: ""
			}
			
			this.firebaseProvider.getUserRef(data.senderID)
				.once('value')
				.then(snaphot => {
					
					
					chatUser.displayName = snaphot.val().displayName,
					chatUser.photoURL = snaphot.val().photoURL
				
					this.chatUsers.push(chatUser);					
					msgData.displayName = chatUser.displayName;
					msgData.photoURL = chatUser.photoURL;

				}, 	function(error) { 
					console.error(error);
					}
				)
			
		}
		else {

			console.log(chatUser);
			msgData.displayName = chatUser.displayName;
			msgData.photoURL = chatUser.photoURL;
		}
	

  	}


  

	sendMessage() {
		let messageText = this.messageText.trim()
		if(messageText!==""){

		let message = {
			senderID: this.userID,
			recieverID: this.recieverID,
			message: messageText,
			date: this.firebaseProvider.getServerTimestamp(),
			pictureURL: this.pictureURL
		}
		this.chatRef.push(message);
		this.messageText = "";
		this.recieverID = "";
		this.pictureURL = null;
		}
	}

	uploadPhotoClick() {
		this.cameraProvider.showChoiceAlert(false);
	}
	

	onMessageClick(message) {
		console.log(message);
		

		let addressAlert = this.alertCtrl.create({
			buttons: [
				{
					text: "Reply",
					handler: () => {
						this.recieverID = message.senderID;
						this.messageText = '@(' + message.displayName + '), ' + this.messageText;
					}
				},

				{
					text: "Copy Address",
					handler: () => {
						let msgToCopy = '@(' + message.displayName + '):' + '"' + message.message + '"';
						this.clipboard.copy(msgToCopy);
						this.alertProvider.presentCopyToast();
						console.log("Copied");
					}
				}
			]
		})

		addressAlert.present();
	}	

	scrollFunction() {
	    this.content.scrollToBottom(0);
		// console.log(this.content);
    }

    handleSelection(event: EmojiEvent) {
    	console.log(this._lastCaretEvent);
	    this.messageText = this.messageText.slice(0, this._lastCaretEvent.caretOffset) + event.char + this.messageText.slice(this._lastCaretEvent.caretOffset);
	    this.eventMock = JSON.stringify(event);
	  }

	  handleCurrentCaret(event: CaretEvent) {
	    this._lastCaretEvent = event;
	    this.eventPosMock = '{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${event.textContent} }';
	  }
}




 