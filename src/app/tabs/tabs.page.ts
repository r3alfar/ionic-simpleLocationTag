/* tslint:disable */
import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {FriendService} from '../services/friend.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {AngularFireDatabase} from '@angular/fire/database';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {
  idUser: string;
  userData: any;
  userLocations: any[] = [];
  boolGetData: boolean = false;
  monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];

  constructor(
      private authService: AuthService,
      private userService: FriendService,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private db: AngularFireDatabase,
      private router: Router
  ) { }

  ngOnInit() {
    this.getIdUser();
  }

  getIdUser(){
    this.authService.userDetails().subscribe(res => {
      if(res !== null){
        this.idUser = res.uid;
        this.getUserData();
      }
      else{
        this.router.navigateByUrl('/login');
      }
    }, err => {
      console.log(err);
    })
  }

  getUserData(){
    this.db.object('/user/' + this.idUser).valueChanges().subscribe(data => {
      this.userData = data;
      if (this.userData.locations){
        this.userLocations = this.userData.locations;
      }
      if (this.boolGetData == false){
        this.boolGetData = true;
        this.autoCheckIn();
      }
    });
  }

  getCurrDate(): string{
    const today = new Date();
    const todayDay = String(today.getDate()).padStart(2, '0');
    const todayMonth = String(today.getMonth()).padStart(2, '0');
    const todayYear = today.getFullYear();
    const todayHour = today.getHours();
    const todayMinute = today.getMinutes();
    const todayDate: string = todayDay + ' ' + this.monthNames[todayMonth] + ' ' + todayYear + ' ' + todayHour + ':' + todayMinute;

    return todayDate;
  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({
      message: "Memperbaharui lokasi...",
      duration: 1000
    });
    return loading.present();
  }

  async presentToast(toastMessage: string, colorMessage: string) {
    const toast = await this.toastCtrl.create({
      message: toastMessage,
      duration: 3000,
      position: 'bottom',
      color: colorMessage,
    });
    await toast.present();
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>{});
  }

  autoCheckIn(){
    this.presentLoading().then(() => {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position: Position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }

          const lat = pos.lat;
          const lng = pos.lng;

          const todayDate = this.getCurrDate();
          const newLocation: any = {
            lat: lat,
            lng: lng,
            nama: 'Last Seen (Automated)',
            tanggal: todayDate
          };
          this.userLocations.push(newLocation);
          this.userData.locations = this.userLocations;

          this.userService.update(this.idUser, this.userData);
          this.delay(600000).then(any => {
            this.autoCheckIn();
          });
        });
      }
    })
  }
}
