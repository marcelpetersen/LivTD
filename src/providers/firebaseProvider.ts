import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { StorageProvider } from '../providers/storage';

declare var window: any;

@Injectable()
export class FirebaseProvider {

  public userProfile: firebase.database.Reference;
  public userData: any;
  public defaultPhotoURL: string = 'https://firebasestorage.googleapis.com/v0/b/liv-app-8af89.appspot.com/o/liv_logo_avatar.png?alt=media&token=c01f8eb4-1d54-431e-a8b1-01cacf9c36c3';


  constructor(public facebook: Facebook, public storageProvider: StorageProvider) {
    this.userProfile = null;
  }


  getUserProfileRef(): firebase.database.Reference {
    if (!this.userProfile) {
      var currentUser = firebase.auth().currentUser;
      if (!currentUser) return null;
      this.userProfile = firebase.database().ref('/userProfile/' + currentUser.uid);
    }
    return this.userProfile;
  }

  /*
  //
  //
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Authentication methods!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //
  //
  */


  signupUser(name: string, domTimeStamp: number, email: string, password: string, musicPreferences: any, zipCode: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        this.saveDataToDataBase(name, domTimeStamp, email, this.defaultPhotoURL, musicPreferences, zipCode);
        this.saveDataToLocalStorage(name, domTimeStamp, email, this.defaultPhotoURL, "", zipCode, musicPreferences, false);
      });
  }

  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      firebase.database().ref('/userProfile/').child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        var musicPreference = snapshot.val().musicPreference;
        this.saveDataToLocalStorage(snapshot.val().displayName, snapshot.val().domTimeStamp, snapshot.val().email,
          snapshot.val().photoURL, snapshot.val().phoneNumber, snapshot.val().zipCode, musicPreference, snapshot.val().access_level);
      })
    });
  }

  resetPassword(email: string): firebase.Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logInUserWithFacebook(): firebase.Promise<any> {
    return this.facebook.login(['email']).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      return firebase.auth().signInWithCredential(facebookCredential).then((success) => {
        var displayName = success['displayName'];
        var photoURL = success['photoURL'];
        var phoneNumber = "";
        var zipCode = "";
        var dob = 0;
        var musicPreference = {
          edm: false,
          hipHop: false,
          latin: false,
          underground: false
        }
        var accessLevel = false;
        if (photoURL === "")
          photoURL = this.defaultPhotoURL;

        firebase.database().ref('/userProfile/').child(firebase.auth().currentUser.uid).once('value', (snapshot) => {

          if (!snapshot.exists()) {
            this.saveDataToDataBase(success['displayName'], 0, success['email'], photoURL, musicPreference, "");
          } else {
            displayName = snapshot.val().displayName;
            photoURL = snapshot.val().photoURL;
            phoneNumber = snapshot.val().phoneNumber;
            zipCode = snapshot.val().zipCode;
            dob = snapshot.val().domTimeStamp;
            musicPreference = snapshot.val().musicPreference;
            accessLevel = snapshot.val().access_level;
          }
          this.saveDataToLocalStorage(displayName, dob, success['email'], photoURL, phoneNumber, zipCode, musicPreference, accessLevel);
        });

      });
    }).catch((error: any) => {
      return error;
    });
  }

  saveDataToLocalStorage(name: string, domTimeStamp: number, email: string, photoURL: string, phoneNumber: string, zipCode: string, musicPreference: any, accessLevel:boolean): void {
    var key = 'curent_user';
    var data = {
      displayName: name,
      email: email,
      dob: domTimeStamp,
      photoURL: photoURL,
      id: firebase.auth().currentUser.uid,
      phoneNumber: phoneNumber,
      zipCode: zipCode,
      musicPreference: musicPreference,
      access_level : accessLevel
    };
    this.storageProvider.setItem(key, data);
  }

  saveDataToDataBase(name: string, domTimeStamp: number, email: string, photoURL: string, musicPreferences: any, zipCode: string) {
    var currentUser = firebase.auth().currentUser;
    if (currentUser !== null) {
      firebase.database().ref('/userProfile').child(currentUser.uid)
        .set({
          email: email,
          displayName: name,
          domTimeStamp: domTimeStamp,
          registrationDateStamp: new Date().getTime(),
          photoURL: photoURL,
          phoneNumber: "",
          zipCode: zipCode,
          musicPreference: musicPreferences,
          access_level: false
        });
    }
  }

  logOutUser(): firebase.Promise<any> {
    this.userProfile = null;
    return firebase.auth().signOut().then(() => {
      this.storageProvider.clear();
    });
  }

  /*
  //
  //
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Data editing methods!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //
  //
  */

  updatePhotoURL(newPhotoURL: string): firebase.Promise<void> {
    var profile = this.getUserProfileRef();
    return profile.update({
      photoURL: newPhotoURL
    }).then(() => {
      this.storageProvider.getItem('curent_user').then((data) => {
        var newData = data;
        newData['photoURL'] = newPhotoURL;
        this.storageProvider.clear().then(() => {
          this.storageProvider.setItem('curent_user', data);
        })
      })
    });
  }

  updateUserData(userData: any): firebase.Promise<void> {
    var profile = this.getUserProfileRef();
    return profile.update({
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      phoneNumber: userData.phoneNumber,
      zipCode: userData.zipCode,
      musicPreference: userData.musicPreference
    }).then(() => {
      this.storageProvider.clear().then(() => {
        this.storageProvider.setItem('curent_user', userData);
      })

    });
  }

  updateEmail(newEmail: string): firebase.Promise<any> {
    var currentUser = firebase.auth().currentUser;
    return currentUser.updateEmail(newEmail).then(user => {
      var profile = this.getUserProfileRef();
      profile.update({ email: newEmail }).then(() => {
        this.storageProvider.getItem('curent_user').then((data) => {
          var newData = data;
          newData['email'] = newEmail;
          this.storageProvider.clear().then(() => {
            this.storageProvider.setItem('curent_user', data);
          })
        })
      });
    });
  }

  /*
  //
  //
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Storage methods!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //
  //
  */

  uploadChatPhoto(imageData: any): any {
    let storageRef = firebase.storage().ref().child('/chatPhotos');
    return this.uploadPhotoToStorage(storageRef, imageData);
  }

  uploadUserPhoto(imageData: any): any {
    let storageRef = firebase.storage().ref();
    this.uploadPhotoToStorage(storageRef, imageData).then((url) => this.updatePhotoURL(url));
  }

  uploadPhotoToStorage(storageRef: any, imageData: any): any {
    return this.makeFileIntoBlob(imageData).then((blob: any) => {
      let filename = blob.name;
      const imageRef = storageRef.child(`/${filename}.jpg`);
      return imageRef.put(blob).then(() => {
        return imageRef.getDownloadURL();
      })
    })
  }



  makeFileIntoBlob(_imagePath) {
    return new Promise((resolve, reject) => {

      window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {
        fileEntry.file((resFile) => {

          var reader = new FileReader();

          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = Math.floor(Date.now() / 1000);

            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            console.log('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });
      });

    });
  }
  /*
  //
  //
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Chat methods!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //
  //
  */

  getChatRef(): any {
    return firebase.database().ref('/chat');
  }

  getUserRef(uid: string): any {
    return firebase.database().ref('/userProfile').child(uid);
  }

  getEventsRef(): any {
    return firebase.database().ref('/events');
  }

  getWallpapersRef(): any {
    return firebase.database().ref('/wallpapers');
  }

  getPostEmailRef(): any {
    return firebase.database().ref('/VIPEmail');
  }

  updatePushNotificationsID(regID:any):void {
     this.getUserProfileRef().update({
        RegistrationId: regID
     });
  }

  getServerTimestamp():any{
    return firebase.database.ServerValue.TIMESTAMP;
  }

}
