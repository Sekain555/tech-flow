# CONTEXTO.md — TechFlow
> Última actualización: 16-03-2026

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

## 7. Arquitectura de navegación

### Flujo de registro (Administrador)
1. Usuario completa formulario en `/ccuenta` (datos personales + datos del taller)
2. Se crea cuenta en Firebase Auth
3. Se crea documento en `tenants/` con datos del taller, `ownerUid`, `estado: 'trial'` y `creadoEn`
4. Se guarda `tenantId` en el usuario
5. Se crea documento en `Usuarios/{uid}` (compatibilidad temporal)
6. Se crea mapping en `userTenants/{uid}` con `tenantId` y `role: 'administrador'`
7. Se crea usuario dentro de `tenants/{tenantId}/users/{uid}`
8. Redirige a `/entrada`

> Técnicos y vendedores **no se registran públicamente**. Solo el administrador puede crearlos desde dentro del sistema (pendiente implementar).

### Flujo de login
1. Firebase Auth detecta sesión activa en `/entrada`
2. Se consulta `userTenants/{uid}` para obtener `tenantId` y `role`
3. Se consulta `tenants/{tenantId}` para verificar `estado`
4. Si `estado === 'suspendido'` → logout automático y redirección a `/recepcion`
5. Si no suspendido → `SessionService.setSession()` y acceso al dashboard
6. **Todos los roles quedan en `/entrada`** — no hay redirección por rol

### Arquitectura de páginas principales
- **`/entrada`** — layout principal con menú lateral + dashboard. Controla visibilidad por rol via `*ngIf`
- **`/menuresumen`** — página secundaria de gráficos. Lee rol y tenantId desde `SessionService`
- **`/recepcion`** — pantalla pública de login
- **`/ccuenta`** — registro público, solo crea cuentas de Administrador

---

## 8. Páginas del sistema

| Página | Ruta | Descripción |
|---|---|---|
| recepcion | /recepcion | Pantalla inicial / login |
| ccuenta | /ccuenta | Registro de nuevo taller + administrador |
| entrada | /entrada | Layout principal — dashboard + menú lateral |
| menuresumen | /menuresumen | Estadísticas y gráficos (secundaria) |
| menuresumentec | /menuresumentec | Legacy — pendiente evaluar si se elimina |
| menuordenes | /menuordenes | Listado de órdenes |
| nuevaorden | /nuevaorden | Crear nueva orden |
| registroorden | /registroorden | Detalle/registro de orden |
| estadisticasorden | /estadisticasorden | Estadísticas de órdenes |
| menuclientes | /menuclientes | Listado de clientes |
| nuevocliente | /nuevocliente | Crear cliente |
| registroclientes | /registroclientes | Detalle de cliente |
| contactoclientes | /contactoclientes | Contactar clientes |
| menuinventario | /menuinventario | Inventario de repuestos |
| anadirrepuesto | /anadirrepuesto | Agregar repuesto |
| registrorepuesto | /registrorepuesto | Detalle de repuesto |
| configadmin | /configadmin | Configuración administrador |
| menuvideos | /menuvideos | Videos tutoriales (función postergada) |
| registrovideos | /registrovideos | Registrar video (función postergada) |

---

## 9. Hardware complementario (planificado)

- **ESP32** con lector RFID
- Tarjetas RFID entregadas al cliente al dejar su equipo
- Cliente consulta estado del equipo escaneando su tarjeta en la tienda
- ESP32 se comunica con el backend via WiFi (REST API)
- Aprovisionamiento WiFi via WiFiManager (primer arranque)
- Kit RFID como add-on premium del plan de suscripción

---

## 10. Modelo de negocio (en definición)

- SaaS por suscripción mensual/anual
- Planes por cantidad de técnicos o volumen de OTs incluidas
- Add-on hardware: kit ESP32 + tarjetas RFID
- Tenant nuevo inicia en estado `trial` — activación manual por el dueño del sistema
- Panel de superadmin planificado para post-MVP

---

## 11. Estado del Trello — Roadmap MVP

### DONE ✅
| Tarjeta |
|---|
| Multi-tenant foundation (tenantId en todo el modelo) |
| Normalizar roles y flujo por cargo |
| Refactor FirestoredatabaseService (IDs + paths por tenant) |
| Restringir registro público a solo rol Administrador |
| Modelo de activación de tenant (trial/activo/suspendido) |

### BACKLOG (orden de prioridad)
| # | Tarjeta | Prioridad | Tamaño | Categoría |
|---|---|---|---|---|
| 1 | Definir reglas Firestore por tenant | Alta | M | OPS |
| 2 | Validar flujo OT dentro de tenant | Alta | M | FE/BE |
| 3 | Órdenes de trabajo end-to-end (crear → estados → cerrar) | Media | L | FE/BE |
| 4 | Clientes + equipos (asociación real a OT) | Media | M | FE/BE |
| 5 | Inventario / repuestos (asociado a OT + stock) | Media | M | FE/BE |
| 6 | Migrar páginas legacy a métodos por tenant | Alta | L | FE/BE |
| 7 | Historial / búsqueda (por cliente, por OT, por estado) | Baja | M | FE/BE |
| 8 | Export simple (PDF/print o resumen) | Baja | S | FE |
| 9 | Onboarding (crear taller → primer técnico → primera OT) | Baja | M | FE/BE |

### POST-MVP
| Tarjeta |
|---|
| Panel de administración del sistema (superadmin) |

---

## 12. Pendientes técnicos conocidos

| Pendiente | Prioridad | Contexto |
|---|---|---|
| `correotaller` es null en tenant | Baja | El formulario de registro no tiene ese campo |
| Colección `Usuarios/` es legacy | Baja | Mantener por compatibilidad hasta migración completa |
| Interfaz `Taller` es legacy | Baja | Usar `Tenant` para nuevos desarrollos |
| Técnicos/vendedores sin flujo de creación | Alta | Solo el admin puede crearlos, flujo no implementado aún |
| Validación de roles técnico/vendedor pendiente | Media | Depende de implementación de creación de usuarios internos |
| `menuresumentec` posiblemente redundante | Baja | Evaluar si se elimina ahora que existe dashboard unificado |
| Métodos legacy en FirestoredatabaseService | Alta | Migrar cuando se trabajen cards de OTs, clientes e inventario |
| YouTube API key revocada | Resuelta | Función de videos postergada para post-MVP |

---

## 13. Convención de tarjetas Trello

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

## 14. Decisiones de arquitectura tomadas

| Decisión | Razón |
|---|---|
| Subcolecciones por tenant en Firestore | Aislamiento natural, reglas más limpias, escala mejor |
| Un solo dashboard `/entrada` para todos los roles | Menos código duplicado, mantenimiento centralizado |
| Registro público solo para Administrador | Seguridad — técnicos/vendedores los crea el admin desde dentro |
| `SessionService` como fuente de verdad del rol | Evita consultas repetidas a Firestore en cada página |
| `ionViewDidEnter` para inicializar gráficos | El DOM debe estar listo antes de acceder a canvas |
| Tenant nuevo inicia en estado `trial` | Control de acceso desde el primer registro |
| Estado del tenant verificado en cada login | Permite suspender acceso sin eliminar la cuenta |
| Panel superadmin postergado para post-MVP | Complejidad excede el scope del MVP |
| Función de videos postergada para post-MVP | YouTube API key revocada, bajo impacto en MVP |