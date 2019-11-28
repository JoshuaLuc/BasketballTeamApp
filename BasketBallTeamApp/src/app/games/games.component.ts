import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from "../../app/auth.service";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})

export class GamesComponent implements OnInit {
  @Input("game-card") gameData;
  games: Observable<any[]>;
  public nameValue;
  public userInfo;
  public amountValue;
  userData: AngularFireList<any>
  constructor( 
    public authService: AuthService,
    public db: AngularFireDatabase,) { }

  ngOnInit() {
    
  }

  feeDetails(time,date,venue){
    const user = JSON.parse(localStorage.getItem('user'));
    this.userData = this.db.list('/users', ref => ref.equalTo(user.uid).orderByKey())
    this.userData.snapshotChanges(['child_added'])
      .subscribe(actions => {
        actions.forEach(action => {
          this.userInfo = action.payload.val();
          console.log(this.userInfo.verified)
          if(this.userInfo.verified){
            const userRef = this.db.list('/users/');
            const gameRef = this.db.list('/games/');
            const id = time + '' + date + '' + venue
            gameRef.update(id,
              {
                payeeName: this.userInfo.name,
                paymentAmount: this.amountValue
              });
  
              userRef.update(user.uid,
                {
                  amountPaid: this.amountValue + this.userInfo.amountPaid
                });
            }
        else{
          console.log('Account Not verified')
         
            }
  })
})
  }

  deleteGame(time,date,venue){
    const id = time + '' + date + '' + venue
    this.db.list('/games/' + id).remove();
  }
}
