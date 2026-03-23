# CONTEXTO.md — TechFlow
> Última actualización: 22-03-2026

---

## 1. ¿Qué es TechFlow?

TechFlow es un SaaS de gestión para servicios técnicos de dispositivos (teléfonos y computadores). Digitaliza procesos clave como ingreso de equipos, generación de órdenes de trabajo, comunicación con clientes e inventario de repuestos.

Apunta a cubrir todo el ecosistema de servicios técnicos: desde técnicos independientes hasta empresas autorizadas de gran escala.

---

## 2. Origen del proyecto

- Partió como proyecto de titulación de Ingeniería Informática técnica.
- Desarrollado inicialmente en 2 meses aprendiendo desarrollo web en paralelo.
- Actualmente en proceso de conversión a producto SaaS comercial.
- Existe un sistema similar en producción llamado **Sistema Tickets Rucaray (STR)** que valida el stack tecnológico.

---

## 3. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Ionic + Angular |
| Backend actual | Directo a Firestore (sin backend propio) |
| Base de datos | Firebase Firestore |
| Autenticación | Firebase Authentication |
| Backend futuro | Python + FastAPI (a implementar post-MVP) |
| Base de datos futura | MySQL |
| Mobile | Capacitor (Android + iOS) |

---

## 4. Arquitectura de datos — Firestore

### Colecciones globales
```
userTenants/{uid}
  - tenantId: string
  - role: 'administrador' | 'tecnico' | 'vendedor'

Usuarios/{uid}           ← compatibilidad temporal, se eliminará en el futuro
```

### Por tenant
```
tenants/{tenantId}
  - nombretaller: string
  - rutempresa: string
  - correotaller: string     ← actualmente null, pendiente agregar al formulario
  - nrotelefonotaller: string
  - direcciontaller: string
  - comuna: string
  - region: string
  - ownerUid: string
  - estado: 'trial' | 'activo' | 'suspendido'
  - creadoEn: string (ISO date)
  ├─ users/{uid}
  ├─ clients/{clientId}
  ├─ workorders/{workOrderId}
  ├─ inventory/{itemId}
  └─ settings/{docId}
```

---

## 5. Modelos principales

### UsuarioI
```typescript
export interface UsuarioI {
  nombre: string;
  rut: string;
  correo: string;
  nrotelefono: number;
  clave: string;
  cargo: 'administrador' | 'tecnico' | 'vendedor';
  nombretaller: string;
  tenantId?: string;
}
```

### Taller ← legacy, usar Tenant para nuevos desarrollos
```typescript
export interface Taller {
  nombretaller: string;
  rutempresa: string;
  correotaller: string;
  nrotelefonotaller: number;
  direcciontaller: string;
  comuna: string;
  region: string;
}
```

### Tenant
```typescript
export interface Tenant {
  nombretaller: string;
  rutempresa: string;
  correotaller: string;
  nrotelefonotaller: number;
  direcciontaller: string;
  comuna: string;
  region: string;
  ownerUid: string;
  estado: 'trial' | 'activo' | 'suspendido';
  creadoEn?: string;
}
```

---

## 6. Servicios principales

### FirestoredatabaseService

**Métodos globales:**
- `createDoc(data, path, id)` — crear documento con ID conocido
- `getDoc(path, id)` — obtener documento por ID
- `modificarDoc(data, path, id)` — actualizar documento
- `getId()` — generar ID único

**Métodos por tenant:**
- `getCollectionByTenant<T>(subpath, tenantId)` — obtener colección con IDs reales via `snapshotChanges()`
- `getCollectionByTenantQuery<T>(subpath, tenantId, param, cond, search)` — consulta filtrada por tenant
- `getDocByTenant<T>(subpath, tenantId, docId)` — obtener documento dentro del tenant
- `createDocByTenant(subpath, tenantId, data)` — crear documento dentro del tenant
- `updateDocByTenant(subpath, tenantId, docId, data)` — actualizar documento dentro del tenant
- `deleteDocByTenant(subpath, tenantId, docId)` — eliminar documento dentro del tenant

**Métodos multi-tenant:**
- `createTenant(data)` — crear nuevo tenant
- `setUserTenant(uid, data)` — mapear usuario → tenant
- `setTenantUser(tenantId, uid, data)` — guardar usuario dentro del tenant
- `getUserTenant(uid)` — resolver tenant al iniciar sesión
- `getTenant(tenantId)` — obtener datos completos del tenant

**Métodos legacy** ← pendiente migrar a métodos por tenant:
- `getCollection(path)` — obtener colección completa
- `getCollectionQuery(path, param, cond, search)` — consulta con filtro
- `createClient(data, path)` — crear documento con ID automático

### SessionService
Persiste en memoria (con fallback a localStorage):
- `tenantId`
- `role`
- `uid`

Métodos: `setSession()`, `clear()`, `isReady()`

### AuthfirebaseService
- `login(correo, password)`
- `logout()`
- `registrousuario(datosusuario)`
- `estadousuario()` — observable del estado de auth

---

## 7. Reglas de seguridad Firestore

Archivo `firestore.rules` en la raíz del proyecto, versionado en Git.

**Funciones auxiliares:**
- `perteneceAlTenant(tenantId)` — valida auth + uid en userTenants + tenantId coincide
- `esAdmin(tenantId)` — valida perteneceAlTenant + role === 'administrador'

**Reglas por colección:**

| Colección | Lectura | Escritura |
|---|---|---|
| `userTenants/{uid}` | Solo el propio uid | Bloqueada desde cliente |
| `Usuarios/{uid}` | Solo el propio uid | Bloqueada desde cliente |
| `tenants/{tenantId}` | Miembros del tenant | Bloqueada desde cliente |
| `tenants/{tenantId}/users` | Miembros del tenant | Solo administrador |
| `tenants/{tenantId}/clients` | Miembros del tenant | Miembros del tenant |
| `tenants/{tenantId}/workorders` | Miembros del tenant | Miembros del tenant |
| `tenants/{tenantId}/inventory` | Miembros del tenant | Miembros del tenant |
| `tenants/{tenantId}/settings` | Miembros del tenant | Solo administrador |

---

## 8. Arquitectura de navegación

### Flujo de registro (Administrador)
1. Usuario completa formulario en `/ccuenta`
2. Se crea cuenta en Firebase Auth
3. Se crea documento en `tenants/` con `estado: 'trial'` y `creadoEn`
4. Se crea mapping en `userTenants/{uid}`
5. Se crea usuario en `Usuarios/{uid}` (compatibilidad temporal)
6. Se crea usuario en `tenants/{tenantId}/users/{uid}`
7. Redirige a `/entrada`

### Flujo de login
1. Firebase Auth detecta sesión activa en `/entrada`
2. Se consulta `userTenants/{uid}` para obtener `tenantId` y `role`
3. Se consulta `tenants/{tenantId}` para verificar `estado`
4. Si `estado === 'suspendido'` → logout y redirección a `/recepcion`
5. Si no suspendido → `SessionService.setSession()` y acceso al dashboard

### Arquitectura de páginas principales
- **`/entrada`** — layout principal con menú lateral + dashboard
- **`/menuresumen`** — estadísticas y gráficos, lee desde `SessionService`
- **`/recepcion`** — pantalla pública de login
- **`/ccuenta`** — registro público, solo Administrador

---

## 9. Archivos de configuración Firebase

| Archivo | Versionado | Descripción |
|---|---|---|
| `firestore.rules` | ✅ Sí | Reglas de seguridad |
| `firestore.indexes.json` | ✅ Sí | Índices de Firestore |
| `firebase.json` | ✅ Sí | Configuración Firebase CLI |
| `.firebaserc` | ❌ No (.gitignore) | ID del proyecto Firebase |
| `environment.ts` | ❌ No (.gitignore) | API keys y configuración sensible |
| `environment.prod.ts` | ❌ No (.gitignore) | API keys producción |
| `config.xml` | ❌ No (.gitignore) | Configuración Capacitor con datos sensibles |

---

## 10. Hardware complementario (planificado)

- **ESP32** con lector RFID
- Tarjetas RFID entregadas al cliente al dejar su equipo
- ESP32 se comunica con el backend via WiFi (REST API)
- Aprovisionamiento WiFi via WiFiManager
- Kit RFID como add-on premium del plan de suscripción

---

## 11. Modelo de negocio (en definición)

- SaaS por suscripción mensual/anual
- Planes por cantidad de técnicos o volumen de OTs incluidas
- Add-on hardware: kit ESP32 + tarjetas RFID
- Tenant nuevo inicia en estado `trial` — activación manual por el dueño del sistema
- Panel de superadmin planificado para post-MVP

---

## 12. Estado del Trello — Roadmap MVP

### DONE ✅
| Tarjeta |
|---|
| Multi-tenant foundation (tenantId en todo el modelo) |
| Normalizar roles y flujo por cargo |
| Refactor FirestoredatabaseService (IDs + paths por tenant) |
| Restringir registro público a solo rol Administrador |
| Modelo de activación de tenant (trial/activo/suspendido) |
| Definir reglas Firestore por tenant |

### BACKLOG (orden de prioridad)
| # | Tarjeta | Prioridad | Tamaño | Categoría |
|---|---|---|---|---|
| 1 | Validar flujo OT dentro de tenant | Alta | M | FE/BE |
| 2 | Órdenes de trabajo end-to-end (crear → estados → cerrar) | Media | L | FE/BE |
| 3 | Clientes + equipos (asociación real a OT) | Media | M | FE/BE |
| 4 | Inventario / repuestos (asociado a OT + stock) | Media | M | FE/BE |
| 5 | Migrar páginas legacy a métodos por tenant | Alta | L | FE/BE |
| 6 | Historial / búsqueda (por cliente, por OT, por estado) | Baja | M | FE/BE |
| 7 | Export simple (PDF/print o resumen) | Baja | S | FE |
| 8 | Onboarding (crear taller → primer técnico → primera OT) | Baja | M | FE/BE |

### POST-MVP
| Tarjeta |
|---|
| Panel de administración del sistema (superadmin) |

---

## 13. Pendientes técnicos conocidos

| Pendiente | Prioridad | Contexto |
|---|---|---|
| `correotaller` es null en tenant | Baja | El formulario de registro no tiene ese campo |
| Colección `Usuarios/` es legacy | Baja | Mantener por compatibilidad hasta migración completa |
| Interfaz `Taller` es legacy | Baja | Usar `Tenant` para nuevos desarrollos |
| Técnicos/vendedores sin flujo de creación | Alta | Solo el admin puede crearlos, flujo no implementado aún |
| Métodos legacy en FirestoredatabaseService | Alta | Migrar cuando se trabajen cards de OTs, clientes e inventario |
| `menuresumentec` posiblemente redundante | Baja | Evaluar si se elimina ahora que existe dashboard unificado |

---

## 14. Convención de tarjetas Trello

```
**Prioridad:** Alta / Media / Baja
**Tamaño:** S / M / L
**Categoría:** FE / BE / FE/BE / OPS

### Alcance:
- Lista de tareas concretas

### Dependencias:
- Tarjetas o módulos previos requeridos

### CA:
- Criterios verificables que indican que está completo
```

---

## 15. Decisiones de arquitectura tomadas

| Decisión | Razón |
|---|---|
| Subcolecciones por tenant en Firestore | Aislamiento natural, reglas más limpias, escala mejor |
| Un solo dashboard `/entrada` para todos los roles | Menos código duplicado, mantenimiento centralizado |
| Registro público solo para Administrador | Seguridad — técnicos/vendedores los crea el admin desde dentro |
| `SessionService` como fuente de verdad del rol | Evita consultas repetidas a Firestore en cada página |
| `ionViewDidEnter` para inicializar gráficos | El DOM debe estar listo antes de acceder a canvas |
| Tenant nuevo inicia en estado `trial` | Control de acceso desde el primer registro |
| Estado del tenant verificado en cada login | Permite suspender acceso sin eliminar la cuenta |
| Escritura de datos críticos bloqueada desde cliente | Seguridad — solo Firebase Console o funciones del servidor |
| `firestore.rules` versionado en Git | Trazabilidad de cambios en reglas de seguridad |
| Panel superadmin postergado para post-MVP | Complejidad excede el scope del MVP |
| Función de videos postergada para post-MVP | YouTube API key revocada, bajo impacto en MVP |