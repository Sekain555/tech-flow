import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registrovideos',
  templateUrl: './registrovideos.page.html',
  styleUrls: ['./registrovideos.page.scss'],
})
export class RegistrovideosPage implements OnInit {

  passvideo: string = null;

  constructor() { }

  ngOnInit() {
    this.passvideo = sessionStorage.getItem('tokenvideo')
    console.log(this.passvideo)
  }

}
