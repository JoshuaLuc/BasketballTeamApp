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
  public amountValue;
  constructor( 
    public authService: AuthService,
    public db: AngularFireDatabase,) { }

  ngOnInit() {
  }

  feeDetails(time,date,venue){
    const memberRef = this.db.list('/games/');
    const id = time + '' + date + '' + venue
    memberRef.update(id,
      {
        payeeName: this.nameValue,
        paymentAmount: this.amountValue
      });
  }

  deleteGame(time,date,venue){
    const id = time + '' + date + '' + venue
    this.db.list('/games/' + id).remove();
  }
}
