import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoredatabaseService {

  constructor(public database: AngularFirestore) { }


  createDoc(data: any, path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).set(data);
  }

  createClient(data: any, path: string) {
    const collection = this.database.collection(path);
    return collection.doc().set(data);
  }

  getDoc<tipo>(path: string, id: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }

  getCollection<tipo>(path: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.valueChanges();
  }

  getCollectionQuery<tipo>(path: string, parametro: string, condicion: any, busqueda: string) {
    const collection = this.database.collection<tipo>(path,
      ref => ref.where(parametro, condicion, busqueda));
    return collection.valueChanges();
  }

  getDocQuery<tipo>(path: string, parametro: string, condicion: any, busqueda: string) {
    const collection = this.database.collection<tipo>(path,
      ref => ref.where(parametro, condicion, busqueda));
    return collection.doc().valueChanges();
  }

  getId() {
    return this.database.createId();
  }

  modificarDoc(data: any, path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).update(data);
  }

  /*contarDoc(path: string) {
    const collection = this.database.collection(path);
    collection.onSnapshot(snap =>{

    })
  }*/
}