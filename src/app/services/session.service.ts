import { Injectable } from '@angular/core';

export type UserRole = 'administrador' | 'tecnico' | 'vendedor';

export interface SessionState {
  tenantId: string | null;
  role: UserRole | null;
  uid: string | null;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private state: SessionState = {
    tenantId: null,
    role: null,
    uid: null,
  };

  // Cache liviano (opcional): solo tenantId
  private readonly TENANT_KEY = 'techflow_tenantId';

  setSession(payload: { tenantId: string; role: UserRole; uid: string }, persistTenant = true) {
    this.state = {
      tenantId: payload.tenantId,
      role: payload.role,
      uid: payload.uid,
    };

    if (persistTenant) {
      localStorage.setItem(this.TENANT_KEY, payload.tenantId);
    }
  }

  clear() {
    this.state = { tenantId: null, role: null, uid: null };
    localStorage.removeItem(this.TENANT_KEY);
  }

  get tenantId(): string | null {
    return this.state.tenantId ?? localStorage.getItem(this.TENANT_KEY);
  }

  get role(): UserRole | null {
    return this.state.role;
  }

  get uid(): string | null {
    return this.state.uid;
  }

  isReady(): boolean {
    return !!this.tenantId;
  }
}