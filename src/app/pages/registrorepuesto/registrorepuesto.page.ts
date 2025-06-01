import { Component, OnInit } from '@angular/core';
import { StrapisqlService } from 'src/app/services/strapisql.service';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { InventarioRepuesto } from 'src/app/models/modelos';

@Component({
  selector: 'app-registrorepuesto',
  templateUrl: './registrorepuesto.page.html',
  styleUrls: ['./registrorepuesto.page.scss'],
})
export class RegistrorepuestoPage implements OnInit {

  repuestos: InventarioRepuesto[] = [];

  constructor(private strapisql: StrapisqlService,
    private firestore: FirestoredatabaseService) { }

  ngOnInit() {
    this.traerrepuestos()
  }

  traerrepuestos() {
    this.firestore.getCollection<InventarioRepuesto>('RepuestoServicio').subscribe(res =>{
      console.log(res);
      this.repuestos= res;
    })
  }

}
