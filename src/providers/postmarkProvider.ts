import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()

export class PostmarkProvider   {
	
	headers: any;
	accessToken: any = '327fd15e-00c7-4d79-a319-78cf6727b37d';
	senderEmail:string = 'rachel@livnightclub.com';
	bookTableEmail:string = 'liv.app10.07@gmail.com';
	
	constructor(private http: Http) {
		this.headers = new Headers();
		this.headers.append('Accept', 'application/json');
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('X-Postmark-Server-Token', this.accessToken);
	}

	sendDataToEmail(data): Promise<any> {
		return new Promise(resolve => {
			this.http
				.post('https://cors-anywhere.herokuapp.com/https://api.postmarkapp.com/email', data, {
					headers: this.headers
				})
				.subscribe(data => {
					resolve(data);
				});
		}) 
		
	}

	sendGreettingEmail(destinationEmail: string): Promise<any> {

		let mainText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Sed elementum neque id magna.Mauris sollicitudin nisi sit amet sem.Etiam sit amet lectus a'
		 +'velit interdum facilisis.Vestibulum ante ipsum primis in faucibus orci  luctus et ultrices posuere cubilia Curae; In tincidunt eleifend neque.'
		 +' Maecenas interdum, neque in fringilla pellentesque, lacus massa eleifend elit, nec scelerisque nulla orci a nunc.'

		let newHtml = 
			'<div style="margin-bottom:20px; color:white;background: url('+"'https://s3.amazonaws.com/ionic-io-static/i5CxQkRSYaDOdTLgKiR3_12471867_977394868963092_4550193530738327890_o.jpg'"+') no-repeat center;">'
			+'<img style="display:block; margin: 0 auto;" src="https://s3.amazonaws.com/ionic-io-static/DCQO9S0QKaNxXEKF0eym_icon_template2.png" alt="LIV" />'
				+'<h1 style="text-align:center; margin-top:0; "><b>Welcome to the LIV app! </></h1 >'
					+'<div style="margin: 20px 50px 30px 50px">'
						+'<p><h3>Thanks for using our app! </h3></p>'
							+'<p style="font-size:15px">'+mainText+'</p>'
								+'</div>'
			+ '<form action="http://www.livnightclub.com/"><input type="submit" value="Official page"'
			 +'style=" font-size:20px; color:white;margin: 20px 50px 30px 50px; height:50px; width: 210px; background:rgba(0,0,0,0.5); border: 2px solid #3b5998; border-radius:10px;" >'
								+' </></form>'
									+'</div>'

		let data = {
			From: this.senderEmail,	
			To: destinationEmail,
			Subject: 'LIVApp',
			HtmlBody: newHtml
		}
		return this.sendDataToEmail(data);
	}

	sendBookTableMessage(date: Date, females: string, males: string, phoneNumber: string, email: string): Promise<any> {
		
		let htmlEmail =
		'<p>' + 'Book a Table' + '</p>' +
		'<p>' + 'Email: <b>' + email + '</b></p>' +
		'<p>' + 'Date: ' + date + '</p>' +
		'<p>' + 'Females: ' + females + '</p>' +
		'<p>' + 'Males: ' + males + '</p>' +
		'<p>' + 'Phone: ' + phoneNumber + '</p>';


		
		let data = {
			From: this.senderEmail,
			To: this.bookTableEmail,
			Subject: 'Book A Table',
			HtmlBody: htmlEmail
		}
		 return this.sendDataToEmail(data);
	}

}

