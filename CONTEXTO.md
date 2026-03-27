# CONTEXTO.md — TechFlow
> Última actualización: 27-03-2026

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
Dispositivos/            ← legacy, pendiente eliminar tras card catálogo global
RepuestoServicio/        ← legacy, pendiente eliminar tras card catálogo global
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
  ├─ users/{uid}              ← ✅ migrado
  ├─ clients/{clientId}       ← ✅ migrado
  ├─ workorders/{workOrderId} ← ✅ migrado
  ├─ inventory/{itemId}       ← ✅ migrado
  └─ settings/{docId}
```

### Catálogo global (planificado)
```
catalogs/devices/        ← pendiente card "Catálogo global de dispositivos"
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

### ClienteST
```typescript
export interface ClienteST {
  id?: string;
  nrorden: number;
  nombrecliente: string;
  rutcliente: string;
  correocliente: string;
  nrotelefonocliente: number;
  comunacliente: string;
  dispositivos: {
    marcadisp: string;
    modelodisp: string;
    imei: string;
    problemadisp: string;
  };
}
```

### Ordenes
```typescript
export interface Ordenes {
  id?: string;
  estado: 'ingresado' | 'en reparacion' | 'esperando repuesto' | 'reparado' | 'sin reparacion';
  cliente: { ... };
  inforden: { ... };
  nombreregistro: string;
  cargo: string;
  taller: { ... };
  repuesto: { ... };
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
- `getCollectionByTenant<T>(subpath, tenantId)` — obtener colección con IDs reales
- `getCollectionByTenantQuery<T>(subpath, tenantId, param, cond, search)` — consulta filtrada
- `getDocByTenant<T>(subpath, tenantId, docId)` — obtener documento
- `createDocByTenant(subpath, tenantId, data)` — crear documento
- `updateDocByTenant(subpath, tenantId, docId, data)` — actualizar documento
- `deleteDocByTenant(subpath, tenantId, docId)` — eliminar documento

**Métodos multi-tenant:**
- `createTenant(data)` — crear nuevo tenant
- `setUserTenant(uid, data)` — mapear usuario → tenant
- `setTenantUser(tenantId, uid, data)` — guardar usuario dentro del tenant
- `getUserTenant(uid)` — resolver tenant al iniciar sesión
- `getTenant(tenantId)` — obtener datos completos del tenant

> ✅ Métodos legacy eliminados — no existen `getCollection()`, `getCollectionQuery()` ni `createClient()`

### SessionService
- `tenantId`, `role`, `uid`
- Métodos: `setSession()`, `clear()`, `isReady()`

### AuthfirebaseService
- `login()`, `logout()`, `registrousuario()`, `estadousuario()`

---

## 7. Reglas de seguridad Firestore

Archivo `firestore.rules` en la raíz del proyecto.

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
1. `/ccuenta` → crea Auth + tenant (`estado: 'trial'`) + userTenants + Usuarios + users
2. Redirige a `/entrada`

### Flujo de login
1. `/entrada` → consulta `userTenants` → verifica `estado` del tenant
2. Si suspendido → logout + `/recepcion`
3. Si no → `SessionService.setSession()` → dashboard

### Flujo de OT
1. `/nuevaorden` → crea cliente en `clients/` + orden en `workorders/` con `estado: 'ingresado'`
2. `/registroorden` → lista órdenes del tenant, permite cambiar estado via `cambiarEstado()`
3. `/registroclientes` → lista clientes del tenant, búsqueda por RUT

---

## 9. Estado de migración por página

| Página | Ruta | Estado migración |
|---|---|---|
| recepcion | /recepcion | — |
| ccuenta | /ccuenta | ✅ multi-tenant |
| entrada | /entrada | ✅ multi-tenant |
| menuresumen | /menuresumen | ✅ SessionService |
| nuevaorden | /nuevaorden | ✅ clients + workorders + inventory + users por tenant |
| registroorden | /registroorden | ✅ workorders por tenant |
| registroclientes | /registroclientes | ✅ clients por tenant |
| nuevocliente | /nuevocliente | ✅ clients por tenant |
| contactoclientes | /contactoclientes | ✅ clients por tenant |
| anadirrepuesto | /anadirrepuesto | ✅ inventory por tenant |
| registrorepuesto | /registrorepuesto | ✅ inventory por tenant |
| menuordenes | /menuordenes | pendiente |
| estadisticasorden | /estadisticasorden | pendiente |
| menuclientes | /menuclientes | pendiente |
| menuinventario | /menuinventario | pendiente |
| configadmin | /configadmin | pendiente |
| menuvideos | /menuvideos | postergado (post-MVP) |
| registrovideos | /registrovideos | postergado (post-MVP) |

---

## 10. Archivos de configuración Firebase

| Archivo | Versionado | Descripción |
|---|---|---|
| `firestore.rules` | ✅ Sí | Reglas de seguridad |
| `firestore.indexes.json` | ✅ Sí | Índices de Firestore |
| `firebase.json` | ✅ Sí | Configuración Firebase CLI |
| `.firebaserc` | ❌ No | ID del proyecto Firebase |
| `environment.ts` | ❌ No | API keys y configuración sensible |
| `environment.prod.ts` | ❌ No | API keys producción |
| `config.xml` | ❌ No | Configuración Capacitor |

---

## 11. Estado del Trello — Roadmap MVP

### DONE ✅
| Tarjeta |
|---|
| Multi-tenant foundation |
| Normalizar roles y flujo por cargo |
| Refactor FirestoredatabaseService |
| Restringir registro público a solo rol Administrador |
| Modelo de activación de tenant |
| Definir reglas Firestore por tenant |
| Validar flujo OT dentro de tenant |
| Migrar páginas legacy a métodos por tenant |

### BACKLOG
| # | Tarjeta | Prioridad | Tamaño | Categoría |
|---|---|---|---|---|
| 1 | Órdenes de trabajo end-to-end (crear → estados → cerrar) | Media | L | FE/BE |
| 2 | Clientes + equipos (asociación real a OT) | Media | M | FE/BE |
| 3 | Inventario / repuestos (asociado a OT + stock) | Media | M | FE/BE |
| 4 | Catálogo global de dispositivos | Media | M | FE/BE |
| 5 | Historial / búsqueda (por cliente, por OT, por estado) | Baja | M | FE/BE |
| 6 | Export simple (PDF/print o resumen) | Baja | S | FE |
| 7 | Onboarding (crear taller → primer técnico → primera OT) | Baja | M | FE/BE |

### POST-MVP
| Tarjeta |
|---|
| Panel de administración del sistema (superadmin) |

---

## 12. Pendientes técnicos conocidos

| Pendiente | Prioridad | Contexto |
|---|---|---|
| `correotaller` null en tenant | Baja | Formulario sin ese campo |
| Colección `Usuarios/` legacy | Baja | Compatibilidad temporal |
| Interfaz `Taller` legacy | Baja | Usar `Tenant` para nuevos desarrollos |
| Técnicos/vendedores sin flujo de creación | Alta | Pendiente implementar |
| Colecciones `Dispositivos/` y `RepuestoServicio/` globales | Media | Eliminar tras card catálogo global |
| Dispositivos en `nuevaorden` deshabilitados | Media | Pendiente card catálogo global |
| UI cambio de estado en `registroorden` | Media | Backend listo, HTML pendiente de conectar |
| `menuresumentec` posiblemente redundante | Baja | Evaluar eliminación |
| `menuvideos` función comentada | Baja | Postergado post-MVP |

---

## 13. Decisiones de arquitectura tomadas

| Decisión | Razón |
|---|---|
| Subcolecciones por tenant en Firestore | Aislamiento natural, reglas más limpias |
| Un solo dashboard para todos los roles | Menos duplicación, mantenimiento centralizado |
| Registro público solo para Administrador | Seguridad |
| `SessionService` como fuente de verdad | Evita consultas repetidas a Firestore |
| `ionViewDidEnter` para gráficos | DOM debe estar listo antes de acceder a canvas |
| Tenant inicia en estado `trial` | Control de acceso desde el primer registro |
| Estado del tenant verificado en cada login | Permite suspender sin eliminar cuenta |
| Escritura de datos críticos bloqueada desde cliente | Seguridad — solo Firebase Console |
| `firestore.rules` versionado en Git | Trazabilidad de cambios |
| Dispositivos como catálogo global compartido | Marcas y modelos son iguales para todos los talleres |
| Panel superadmin postergado para post-MVP | Excede scope del MVP |
| Función de videos postergada para post-MVP | API key revocada, bajo impacto |
| `estado: 'ingresado'` asignado automáticamente al crear OT | Consistencia del flujo |