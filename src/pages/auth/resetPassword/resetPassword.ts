import { Component } from '@angular/core';
import {  ViewController } from 'ionic-angular';
import { FirebaseProvider } from "../../../providers/firebaseProvider";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from "../../../validators/email";
import { AlertProvider } from '../../../providers/alert';


@Component({
  selector: 'page-reset-password',
  templateUrl: 'resetPassword.html'
})

export class ResetPasswordPage {
	
	public resetForm : FormGroup;
	
	constructor(public viewController: ViewController, public  firebaseProvider: FirebaseProvider, public formBuilder: FormBuilder,
  public alertProvider: AlertProvider) {
		this.resetForm = formBuilder.group({
        email: ['', Validators.compose([ Validators.required, EmailValidator.isValid ])]       
        }
      );
	}

	resetPassword():void {
		this.firebaseProvider.resetPassword(this.resetForm.value.email).then(() => {
  			this.alertProvider.presentAlertWithTittle("New passwor sent on your email");
        this.viewController.dismiss().catch(() => console.log('not dismissed'));
		    }).catch((error:any) => {
             var errorMessage:string;
              switch (error.code) {
                case ("auth/invalid-email"):
                  errorMessage = "Invalid email";
                  break;
                case "auth/user-not-found":
                	errorMessage = "User not found";
                	break;
                default:
                  errorMessage = "Something went wrong";
                  break;
              }
           this.alertProvider.presentAlertWithTittle(errorMessage);
		      });
	}



  onCancelClick():void {
    this.viewController.dismiss().catch(() => console.log('not dismissed'));
  }
}