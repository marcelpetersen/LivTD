import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from "../../validators/email";
import { PostmarkProvider } from '../../providers/postmarkProvider'
import { AlertProvider } from '../../providers/alert'

@Component({
  selector: 'page-book-table',
  templateUrl: 'bookTable.html'
})
export class BookTablePage {
 	
  public bookTableForm: FormGroup;
 
  isEmailValid: boolean = true;
  isDateValid: boolean = true;
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,
    formBuilder: FormBuilder, public postmarkProvider: PostmarkProvider, public alertProvider: AlertProvider) {
  	
  	
     this.bookTableForm = formBuilder.group({
       email: ['', Validators.compose([Validators.required,EmailValidator.isValid])],
       phoneNumber : ['', Validators.required],
       females: ['', Validators.required],
       males: ['', Validators.required],
       date: ['', Validators.required]
     })
    
  }

  submit() {
    this.isDateValid = new Date(this.bookTableForm.value.date).getTime() >= new Date().getTime();
    this.isEmailValid = this.bookTableForm.controls.email.valid;
    if(this.isDateValid && this.bookTableForm.valid){
    this.alertProvider.presentLoadingCustom();
    this.postmarkProvider.sendBookTableMessage(this.bookTableForm.value.date, this.bookTableForm.value.females
        , this.bookTableForm.value.males, this.bookTableForm.value.phoneNumber, this.bookTableForm.value.email).then((data)=> {
          this.alertProvider.dismissLoadingCustom();
          this.alertProvider.presentCustomToast("Message sent !");
        });
     }
      
  }
  
  
 
}
 