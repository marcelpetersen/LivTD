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


@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})
export class RegistrationPage {

  public regForm : FormGroup;
  public dateStr : string;
  public userPassword : string;
  public conditionChecked : boolean;

  constructor(public navCtrl: NavController, public firebaseProvider: FirebaseProvider, public formBuilder: FormBuilder,
  public alertProvider: AlertProvider) {

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
      if (!this.ageFilter()) {
        this.alertProvider.presentAlertWithTittle("You must be older than 21");
      } else {
        var date:Date = new Date(this.dateStr);
        this.firebaseProvider.signupUser(this.regForm.value.name, date.getTime(), this.regForm.value.email,
          this.userPassword).then(() => {
              this.alertProvider.presentAlertWithTittle('You successfully registred!');
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
                  this.alertProvider.presentAlertWithTittle(errorMessage);
                });      
      }

  }

  presentAgreementAlert():void {
    this.alertProvider.presentAlertWithTittle('Agreement');
  }


  onExistAccountClick():void{
    this.navCtrl.setRoot(LoginPage);
  }

}
