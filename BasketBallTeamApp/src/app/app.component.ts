import { Component, OnInit, Pipe } from '@angular/core';
import { AuthService } from "../app/auth.service";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  games: Observable<any[]>;
  players: Observable<any[]>;
  title = 'BasketBallTeamApp';
  userRef: AngularFireList<any>
  currentDate  = new Date();
  userData: AngularFireList<any>
  public userInfo;
  public timeValue;
  public dateValue;
  public venueValue;
  public emailValue;
  public passwordValue;
  public nameValue;
  constructor(
    public authService: AuthService,
    public db: AngularFireDatabase,
  ) { }

  ngOnInit(){
    this.games = this.db.list('games' ).valueChanges();
    this.players = this.db.list('users' ).valueChanges();
  }
  login() {
    console.log('Login() Called')
    this.authService.SignIn(this.emailValue, this.passwordValue)
  }

  register() {
    console.log('Register() Called')
    this.authService.SignUp(this.emailValue, this.passwordValue, this.nameValue)
  }

  logout() {
    console.log('Logout() Called')
    this.authService.SignOut()
  }

  submitGame() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this.userRef = this.db.list('/users', ref => ref.equalTo(user.uid).orderByKey())
      this.userRef.snapshotChanges(['child_added'])
        .subscribe(actions => {
          actions.forEach(action => {
            this.userInfo = action.payload.val();
            if (this.userInfo.is_manager === true) {
              const memberRef = this.db.list('/games/');
              const id = this.timeValue + '' + this.dateValue + '' + this.venueValue
              memberRef.update(id,
                {
                  time: this.timeValue,
                  date: this.dateValue,
                  venue: this.venueValue
                });
            }
            else{
              console.log('User is not Manager')
            }
          })
        })
      }
      else {
        console.log('No user logged in')
      }
    }

    currentEvents(date){
      date = date.replace('-','');
      date = date.replace('-','');
      let currentMonth = this.currentDate.getMonth() + 1;
      let dateString  = this.currentDate.getFullYear() + '' + currentMonth + '' + this.currentDate.getDate();
      let currentDate = +dateString;
      if(currentDate < date){
        return true;
      }
      else{
        return false;
      }
    }
    pastEvents(date){
      date = date.replace('-','');
      date = date.replace('-','');
      let currentMonth = this.currentDate.getMonth() + 1;
      let dateString  = this.currentDate.getFullYear() + '' + currentMonth + '' + this.currentDate.getDate();
      let currentDate = +dateString;
      if(currentDate > date){
        return true;
      }
      else{
        return false;
      }
    }

    acceptUser(id, userVerified){
      if(userVerified != true){
      console.log('User Accepted')
      const user = JSON.parse(localStorage.getItem('user'));
      this.userData = this.db.list('/users', ref => ref.equalTo(user.uid).orderByKey())
    this.userData.snapshotChanges(['child_added'])
      .subscribe(actions => {
        actions.forEach(action => {
          this.userInfo = action.payload.val();
        if(this.userInfo.verified == true){
          const userRef = this.db.list('/users/');
           
          userRef.update(id,
                  {
                    verified: true,
                  });
        }
        else{
          console.log('user is not verified')
        }
        
        })})
      }
    }
    rejectUser(id, userVerified){
      if(userVerified != true){
      console.log('User Accepted')
      const user = JSON.parse(localStorage.getItem('user'));
      this.userData = this.db.list('/users', ref => ref.equalTo(user.uid).orderByKey())
    this.userData.snapshotChanges(['child_added'])
      .subscribe(actions => {
        actions.forEach(action => {
          this.userInfo = action.payload.val();
        if(this.userInfo.verified == true){
          const userRef = this.db.list('/users/');
           
          userRef.update(id,
                  {
                    verified: 'Rejected',
                  });
        }
        else{
          console.log('user is not verified')
        }
        
        })})
     
    }
}}