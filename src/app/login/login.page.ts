/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NavController, ToastController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
      private navCtrl: NavController,
      private authServ: AuthService,
      private formBuilder: FormBuilder,
      public toastController: ToastController
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]))
    });
  }

  loginUser(value) {
    this.authServ.loginUser(value).then(
        res => {
          console.log(res);
          this.presentToast("Login success!","success");
          this.navCtrl.navigateForward('tabs/maps');
        },
        err => {
          this.presentToast(err,"danger");
        }
    )
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('register')
  }

  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 1000,
    });
    toast.present();
  }

}
