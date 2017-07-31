/**
 * Created by Yanislav on 7/10/2017.
 */
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseProvider } from "../../../providers/firebaseProvider";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from "../../../validators/email";
import { HomePage } from '../../../pages/home/home';
import { LoginPage } from '../../../pages/auth/login/login';
import { AlertProvider } from '../../../providers/alert';
import { PostmarkProvider } from '../../../providers/postmarkProvider'

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})
export class RegistrationPage {

  public regForm : FormGroup;
  public dateStr : string;
  public userPassword : string;
  public conditionChecked : boolean;
  public musicPreference: any;
  public firebaseErrorMessage: string = null;
   
  errors: any;
  constructor(public navCtrl: NavController, public firebaseProvider: FirebaseProvider, public formBuilder: FormBuilder,
    public alertProvider: AlertProvider, public postmarkProvider: PostmarkProvider) {

    this.musicPreference = {
        edm: false,
        hipHop: false,
        latin: false,
        underground: false
    }

    this.errors = {
      name: false,
      email: false,
      password: false,
      age: false
    }

    this.regForm = formBuilder.group({
        name:['',Validators.compose([Validators.required,
        Validators.maxLength(45),Validators.pattern("[a-z A-Z]*")])],
        dobStamp:['',Validators.compose([Validators.required])],
        email: ['',Validators.compose([Validators.required,EmailValidator.isValid])],
        pswrd: ['', Validators.compose([Validators.required,Validators.minLength(6)])]       
      }
    );
  }

  ageFilter():boolean {
    var date:Date = new Date(this.dateStr);
    var ageDifMs = Date.now() - date.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) > 20;

  }
  signupUser() {
    this.errors.name = !this.regForm.controls.name.valid;
    this.errors.email = !this.regForm.controls.email.valid;
    this.errors.password = !this.regForm.controls.pswrd.valid;
    this.errors.age = !this.ageFilter();
    this.firebaseErrorMessage = null;

    if(this.regForm.valid && !this.errors.age){
              this.alertProvider.presentLoadingCustom();
              var date:Date = new Date(this.dateStr);
              this.firebaseProvider.signupUser(this.regForm.value.name, date.getTime(), this.regForm.value.email,
                this.userPassword, this.musicPreference).then(() => {
                    this.alertProvider.presentAlertWithTittle('You successfully registred!');
                    this.alertProvider.dismissLoadingCustom();
                    this.postmarkProvider.sendGreettingEmail(this.regForm.value.email);
                            this.navCtrl.setRoot(HomePage);
                  }).catch((error:any) => {                
                        var errorMessage:string;
                        switch (error.code) {
                          case "auth/email-already-in-use":
                            errorMessage = 'This email already in use';
                            break;
                          case ("auth/invalid-email"):
                            errorMessage = "Invalid email";
                            break;
                          case "auth/weak-password":
                            errorMessage = "Weak password";
                            break;
                          default:
                            errorMessage = "Something went wrong";
                            break;
                          }
                        this.alertProvider.dismissLoadingCustom();
                        this.firebaseErrorMessage = errorMessage;
                      });      
            } 

  }


  presentAgreementAlert():void {
    this.alertProvider.presentAlertWithTittle('Terms & Conditions & Privacy Policy');
  }


  onExistAccountClick():void{
    this.navCtrl.setRoot(LoginPage);
  }

  onMusicPreferenceClick() {
    let alert = this.alertProvider.alertCtrl.create({
      title: 'Music Preference',
      inputs: [
        {
          name: 'edm',
          label: 'EDM',
          type: "checkbox",
          value: "edm",
          
      checked: this.musicPreference.edm
        },
        {
          name: 'hipHop',
          label: 'Hip-Hop/Open Format',
          type: "checkbox",
          value: "hipHop",
          
      checked: this.musicPreference.hipHop
        },
        {
          name: 'latin',
          label: 'Latin',
          type: "checkbox",
          value: "latin",
          
      checked: this.musicPreference.latin
        },
        {
          name: 'underground',
          label: 'Underground',
          type: "checkbox",
          value: "underground",
          
      checked: this.musicPreference.underground
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: (data) => {
            
              this.musicPreference.edm = false;
              this.musicPreference.hipHop = false;
              this.musicPreference.latin = false;
              this.musicPreference.underground = false;
              for (let i = 0; i < data.length; i++)
                this.musicPreference[data[i]] = true;
            
          }
        }
      ]
    });
    alert.present(); 
  }

}
