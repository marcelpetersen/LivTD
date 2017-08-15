import { Component, ViewChild, ElementRef, ViewChildren, QueryList} from '@angular/core';
import { NavController, NavParams, Content, ActionSheetController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebaseProvider'
import { StorageProvider } from '../../providers/storage'
import { CameraProvider } from '../../providers/camera'
import { Events } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { AlertController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert'
import { ScrollProvider } from '../../providers/scroll'
import { FileTransferProvider } from '../../providers/fileTransfer';
import {InAppBrowserProvider} from '../../providers/inAppBrowserProvider'

@Component({
  selector: 'page-tabChat',
  templateUrl: 'tabChat.html'
})

export class tabChatPage {

	@ViewChild(Content) content: Content;
	@ViewChild('sidebar') sidebar: ElementRef;
    @ViewChildren('task') taskCards: QueryList<ElementRef>; 

	userID: string;
	displayName: string;
	recieverID: string = "";
	chatRef: any;
	messageText: string = "";
	pictureURL: string = null;
	userPhotoURL: string;
	messageStory: Array<any> = [];
	chatUsers: any = {};
	public eventMock;
  	public eventPosMock;
	isInitComplete: boolean = false;
	isInitCompleteInit: boolean = true;
	isSending: boolean = false;
	isLoading: boolean = false;
	limitCount: any = 30;
	prevScroll: any = 0;

	
	constructor(public navCtrl: NavController, private scrollFix: ScrollProvider, public element: ElementRef, public navParams: NavParams, public firebaseProvider: FirebaseProvider, public storageProvider: StorageProvider,public inAppBrowserProvider: InAppBrowserProvider, 
			public cameraProvider: CameraProvider,private events: Events, public clipboard: Clipboard, public actionSheetController: ActionSheetController, public alertProvider: AlertProvider, public fileTransferProvider: FileTransferProvider) {

		
		this.storageProvider.getItem('curent_user').then(data => {
			this.userID = data.id
			this.userPhotoURL = data.photoURL;
			this.displayName = data.displayName;
		});
		
	  	this.chatRef = this.firebaseProvider.getChatRef(); 

		this.chatRef.on('child_added', data => { 
			if(this.isInitComplete) {
				this.isInitCompleteInit = true;
				this.messageStory.push(this.addMessage(data.val()));
			}
		});
	
		this.chatRef.orderByChild("date").limitToLast(this.limitCount).once('value', data => {
			this.initMessageStory(data);
		});

		
    }

    ngAfterViewInit() {
       // this.isInitCompleteInit = false;
    }

    // openEmoji() {
    // 	var result = this.element.nativeElement.querySelector('[_nghost-c0] .emoji-search[_ngcontent-c0]');
    // 	result.hidden = !result.hidden;
    // }

    scrollHandler(event) {
  //   	if(!this.isLoading) {
	 //    	var result = this.element.nativeElement.querySelector('.spinner-chat');
		//    if(event.scrollTop <= 100) {
		//    		this.prevScroll = event.scrollTop;
		//    		result.style.display = 'block';
		//    		this.isLoading = true;
		//    		this.loadMore(result);
		//    } else {
		//    		result.style.display = 'none';
		//    }
		// }
    }

	initMessageStory(snapshot: any) {
		let snapshotObj = snapshot.val();
		if (snapshotObj) {
			this.alertProvider.presentLoadingCustom();
			var keyNames = Object.keys(snapshotObj);
			for (let name of keyNames) {
				this.messageStory.push(this.addMessage(snapshotObj[name]));
			}
			this.alertProvider.dismissLoadingCustom();
		}

		this.isInitComplete = true;
    }

  	addMessage(data) {
		
		if( !this.chatUsers[data.senderID] ) {
			this.chatUsers[data.senderID] = {
				uid: data.senderID,
				displayName: "",
				photoURL: '../../assets/default.png'
			}
			this.firebaseProvider.getUserRef(data.senderID).once('value').then(snaphot => {
				this.chatUsers[data.senderID].displayName = snaphot.val().displayName;
				this.chatUsers[data.senderID].photoURL = snaphot.val().photoURL;						
			}, 	function(error) { 
				console.error(error);
			})
		}
		var urlRegex = /(https?:\/\/[^\s]+)/g;
		data.message = data.message.replace(urlRegex, function(url){
			data.link = url;
			return '<a>' + url + '</a>';
		})
		return data;
  	}

	sendMessage() {
		let messageText = this.messageText.trim()
		if(messageText!=="" || this.pictureURL){
			this.isSending = true;
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
		this.storageProvider.getItem('pictureToPast').then(data => {
			let alert = this.cameraProvider.showChoiceAlert(this);
			if(data){
				alert.addButton(
					{
						text: 'Past image',
						handler: () => {
							this.pictureURL = data;
							this.sendMessage();
						}
					})			
			}
			alert.present();
		})
	}

	imageReadyHandler(imageData:any) {
		this.firebaseProvider.uploadChatPhoto(imageData).then(url => {
			this.pictureURL = url;
			console.log('imageReadyHandlerHHHHH ' + this.pictureURL);
			this.sendMessage();
		});
	}

	onMessagePress(message) {
		let messageSheet = this.actionSheetController.create({
			buttons: [{
				text: "Reply",
				icon: 'ios-mail-outline',
				handler: () => {
					this.recieverID = message.senderID;
					this.messageText = '@(' + this.chatUsers[message.senderID].displayName + '), ' + this.messageText;
				}
			},
			{
				text: "Copy",
				icon: 'ios-copy-outline',
				handler: () => {
					let msgToCopy = '@(' + this.chatUsers[message.senderID].displayName + '):' + '"' + message.message + '"';
					this.clipboard.copy(msgToCopy);
					this.alertProvider.presentCopyToast();
				}
			}]
		})
		if (message.pictureURL) {
			messageSheet.addButton({
				text: "Save Image",
				icon: 'ios-cloud-download-outline',
				handler:() => {
					this.fileTransferProvider.saveImage(message.pictureURL);
				}
			})
		}
		messageSheet.present();
	}

	scrollFunction() {
		if( this.isSending ) {
			this.content.scrollToBottom(0);
	    	this.isSending = false;
		} else if( this.isInitCompleteInit ) {
			this.content.scrollToBottom(0);
	    	
		}
    }

	doInfinite(event){		
		
		this.chatRef.orderByChild("date").endAt(this.messageStory[0].date).limitToLast(this.limitCount).once('value', data => {

			let snapshotObj = data.val();
			
			if (snapshotObj) {
				var keyNames = Object.keys(snapshotObj).sort().reverse();
				if (!keyNames||keyNames.length <= 1)
					event.complete();
				else
				for (let name of keyNames) {
					if (name !== keyNames[0])
						this.messageStory.unshift(this.addMessage(snapshotObj[name]));
					if (name === keyNames[keyNames.length - 1]) {						
						event.complete();	
					}
				}
			} else {
				event.complete();
			}
		});
	}

	openURL(message){	
		if(message.link){
			this.inAppBrowserProvider.openURL(message.link);
		}
	}
	
}




