import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirestoredatabaseService {
  constructor(public database: AngularFirestore) {}

  // ─── MÉTODOS GLOBALES (sin tenant) ───────────────────────────────

  createDoc(data: any, path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<T>(path: string, id: string) {
    return this.database.collection<T>(path).doc(id).valueChanges();
  }

  modificarDoc(data: any, path: string, id: string) {
    return this.database.collection(path).doc(id).update(data);
  }

  getId() {
    return this.database.createId();
  }

  // ─── MÉTODOS POR TENANT ──────────────────────────────────────────

  getCollectionByTenant<T>(subpath: string, tenantId: string) {
    return this.database
      .collection('tenants')
      .doc(tenantId)
      .collection<T>(subpath)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as T;
            const id = a.payload.doc.id;
            return { id, ...data };
          }),
        ),
      );
  }

  getCollectionByTenantQuery<T>(
    subpath: string,
    tenantId: string,
    parametro: string,
    condicion: any,
    busqueda: any,
  ) {
    return this.database
      .collection('tenants')
      .doc(tenantId)
      .collection<T>(subpath, (ref) =>
        ref.where(parametro, condicion, busqueda),
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as T;
            const id = a.payload.doc.id;
            return { id, ...data };
          }),
        ),
      );
  }

  getDocByTenant<T>(subpath: string, tenantId: string, docId: string) {
    return this.database
      .collection('tenants')
      .doc(tenantId)
      .collection<T>(subpath)
      .doc(docId)
      .valueChanges();
  }

  createDocByTenant(subpath: string, tenantId: string, data: any) {
    return this.database
      .collection('tenants')
      .doc(tenantId)
      .collection(subpath)
      .add(data);
  }

  updateDocByTenant(
    subpath: string,
    tenantId: string,
    docId: string,
    data: any,
  ) {
    return this.database
      .collection('tenants')
      .doc(tenantId)
      .collection(subpath)
      .doc(docId)
      .update(data);
  }

  deleteDocByTenant(subpath: string, tenantId: string, docId: string) {
    return this.database
      .collection('tenants')
      .doc(tenantId)
      .collection(subpath)
      .doc(docId)
      .delete();
  }

  // ─── MÉTODOS MULTI-TENANT (globales) ─────────────────────────────

  async createTenant(data: any) {
    return await this.database.collection('tenants').add(data);
  }

  async setUserTenant(uid: string, data: any) {
    return await this.database.collection('userTenants').doc(uid).set(data);
  }

  async setTenantUser(tenantId: string, uid: string, data: any) {
    return await this.database
      .collection('tenants')
      .doc(tenantId)
      .collection('users')
      .doc(uid)
      .set(data);
  }

  getUserTenant(uid: string) {
    return this.database.collection('userTenants').doc(uid).valueChanges();
  }

  // ─── MÉTODOS LEGACY (pendiente migrar a métodos por tenant) ──────

  getCollection<T>(path: string) {
    return this.database.collection<T>(path).valueChanges();
  }

  getCollectionQuery<T>(
    path: string,
    parametro: string,
    condicion: any,
    busqueda: string,
  ) {
    return this.database
      .collection<T>(path, (ref) => ref.where(parametro, condicion, busqueda))
      .valueChanges();
  }

  createClient(data: any, path: string) {
    return this.database.collection(path).add(data);
  }
}
