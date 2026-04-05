# CONTEXTO.md — TechFlow
> Última actualización: 04-04-2026

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
| Generación PDF | jsPDF |
| Mobile | Capacitor (Android + iOS) |

---

## 4. Arquitectura de datos — Firestore

### Colecciones globales
```
userTenants/{uid}
  - tenantId: string
  - role: 'administrador' | 'tecnico' | 'vendedor'

Usuarios/{uid}           ← compatibilidad temporal, se eliminará en el futuro

devices/{deviceId}       ← catálogo global compartido entre todos los tenants
  - marcadisp: string
  - modelodisp: string
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
  - onboardingCompletado: boolean
  ├─ users/{uid}              ← ✅ migrado
  ├─ clients/{clientId}       ← ✅ migrado
  ├─ workorders/{workOrderId} ← ✅ migrado
  ├─ inventory/{itemId}       ← ✅ migrado
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

### Taller ← LEGACY — migrar a Tenant en post-MVP
```typescript
export interface Taller {
  nombretaller: string;
  rutempresa: string;
  correotaller: string;
  nrotelefonotaller: number;
  direcciontaller: string;
  comuna: string;
  region: string;
  ownerUid?: string;
  estado?: 'trial' | 'activo' | 'suspendido';
  creadoEn?: string;
  onboardingCompletado?: boolean;
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

### InventarioRepuesto
```typescript
export interface InventarioRepuesto {
  id?: string;
  nombrers: string;
  marca: string;
  modelo: string;
  variante: string;
  cantidad: number;
  proveedor: string;
  valor: number;
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
  repuesto: {
    nombrers: string;
    marca: string;
    modelo: string;
    variante: string;
    cantidad: number;   ← siempre 1 por ahora
    valor: number;
  };
}
```

### Dispositivos
```typescript
export interface Dispositivos {
  id?: string;
  marcadisp: string;
  modelodisp: string;
}
```

---

## 6. Servicios principales

### FirestoredatabaseService

**Métodos globales:**
- `createDoc(data, path, id)`
- `getDoc(path, id)`
- `modificarDoc(data, path, id)`
- `getId()`

**Métodos por tenant:**
- `getCollectionByTenant<T>(subpath, tenantId)`
- `getCollectionByTenantQuery<T>(subpath, tenantId, param, cond, search)`
- `getDocByTenant<T>(subpath, tenantId, docId)`
- `createDocByTenant(subpath, tenantId, data)`
- `updateDocByTenant(subpath, tenantId, docId, data)`
- `deleteDocByTenant(subpath, tenantId, docId)`

**Métodos multi-tenant:**
- `createTenant(data)`
- `setUserTenant(uid, data)`
- `setTenantUser(tenantId, uid, data)`
- `getUserTenant(uid)`
- `getTenant(tenantId)`
- `updateTenant(tenantId, data)` — actualiza documento raíz del tenant

**Métodos catálogo global:**
- `getCatalog<T>(catalogPath)`
- `getCatalogQuery<T>(catalogPath, param, cond, search)`
- `addToCatalog(catalogPath, data)`

> ✅ No existen métodos legacy

### SessionService
- `tenantId`, `role`, `uid`
- Métodos: `setSession()`, `clear()`, `isReady()`

### AuthfirebaseService
- `login()`, `logout()`, `registrousuario()`, `estadousuario()`

---

## 7. Reglas de seguridad Firestore

| Colección | Lectura | Escritura |
|---|---|---|
| `userTenants/{uid}` | Solo el propio uid | Bloqueada desde cliente |
| `Usuarios/{uid}` | Solo el propio uid | Bloqueada desde cliente |
| `devices/{deviceId}` | Cualquier usuario autenticado | Solo administrador |
| `tenants/{tenantId}` | Miembros del tenant | Create: ownerUid == uid / Update: solo admin |
| `tenants/{tenantId}/users` | Miembros del tenant | Solo administrador |
| `tenants/{tenantId}/clients` | Miembros del tenant | Miembros del tenant |
| `tenants/{tenantId}/workorders` | Miembros del tenant | Miembros del tenant |
| `tenants/{tenantId}/inventory` | Miembros del tenant | Miembros del tenant |
| `tenants/{tenantId}/settings` | Miembros del tenant | Solo administrador |

---

## 8. Flujo de la aplicación

### Registro (nuevo taller)
1. `/ccuenta` → crea Auth + tenant con `onboardingCompletado: false` + userTenants + Usuarios + users
2. Redirige a `/entrada`

### Login
1. `/entrada` → consulta `userTenants` → verifica `estado` del tenant
2. Si suspendido → logout + `/recepcion`
3. Si `onboardingCompletado === false` y rol administrador → muestra pantalla bienvenida
4. Si no → dashboard normal

### Onboarding
- Solo para administradores en primer acceso
- Pantalla de bienvenida con 3 pasos en el dashboard
- Al presionar "¡Entendido, comenzar!" → `onboardingCompletado: true` en Firestore → dashboard normal

### Flujo OT
- `muestradispositivo` → `orden.cliente.dispositivos`
- `muestrainventario` → `orden.repuesto` con `cantidad: 1`
- Stock decrementa en 1 al generar OT
- Estados: `ingresado` → `en reparacion` → `esperando repuesto` → `reparado` / `sin reparacion`
- Órdenes nunca se eliminan

### Exportación PDF
- jsPDF desde modal de detalle en `registroorden`
- Nombre: `orden-{nroorden}-{nombrecliente}.pdf`

---

## 9. Estado de páginas

| Página | Ruta | Estado |
|---|---|---|
| recepcion | /recepcion | ✅ |
| ccuenta | /ccuenta | ✅ |
| entrada | /entrada | ✅ |
| menuresumen | /menuresumen | ✅ |
| nuevaorden | /nuevaorden | ✅ |
| registroorden | /registroorden | ✅ |
| registroclientes | /registroclientes | ✅ |
| nuevocliente | /nuevocliente | ✅ |
| contactoclientes | /contactoclientes | ✅ |
| anadirrepuesto | /anadirrepuesto | ✅ |
| registrorepuesto | /registrorepuesto | ✅ |
| menuinventario | /menuinventario | ✅ solo navegación |
| menuordenes | /menuordenes | pendiente post-MVP |
| estadisticasorden | /estadisticasorden | pendiente post-MVP |
| menuclientes | /menuclientes | pendiente post-MVP |
| configadmin | /configadmin | pendiente post-MVP |
| menuvideos | /menuvideos | postergado |
| registrovideos | /registrovideos | postergado |

---

## 10. Estado del Trello

### DONE ✅ — MVP COMPLETADO
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
| Catálogo global de dispositivos |
| Órdenes de trabajo end-to-end |
| Clientes + equipos (asociación real a OT) |
| Inventario / repuestos (asociado a OT + stock) |
| Historial / búsqueda (por cliente, por OT, por estado) |
| Export simple (PDF/print o resumen) |
| Onboarding (crear taller → primer técnico → primera OT) |

### POST-MVP
| Tarjeta |
|---|
| Panel de administración del sistema (superadmin) |
| Múltiples repuestos por OT |
| Enriquecer dashboard con métricas reales |
| Visita guiada interactiva del sistema |
| Crear interfaz Tenant y migrar desde Taller legacy |

---

## 11. Pendientes técnicos conocidos

| Pendiente | Prioridad | Contexto |
|---|---|---|
| `correotaller` null en tenant | Baja | Formulario sin ese campo |
| Colección `Usuarios/` legacy | Baja | Compatibilidad temporal |
| Interfaz `Taller` legacy | Media | Migrar a `Tenant` en post-MVP |
| Técnicos/vendedores sin flujo de creación | Alta | Pendiente post-MVP |
| Botón eliminar/editar repuesto sin funcionalidad | Baja | Post-MVP |
| Botón eliminar cliente sin funcionalidad | Baja | Post-MVP |
| Solo un repuesto por OT | Media | Post-MVP |
| Logo del taller en PDF | Baja | Pendiente subida de imágenes |
| `menuresumentec` posiblemente redundante | Baja | Evaluar eliminación |
| Conflicto ng2-charts vs chart.js | Baja | Usar --legacy-peer-deps |

---

## 12. Decisiones de arquitectura tomadas

| Decisión | Razón |
|---|---|
| Subcolecciones por tenant en Firestore | Aislamiento natural, reglas más limpias |
| Un solo dashboard para todos los roles | Menos duplicación, mantenimiento centralizado |
| Registro público solo para Administrador | Seguridad |
| `SessionService` como fuente de verdad | Evita consultas repetidas a Firestore |
| `ionViewDidEnter` para gráficos | DOM debe estar listo antes de acceder a canvas |
| Tenant inicia en estado `trial` | Control de acceso desde el primer registro |
| Estado del tenant verificado en cada login | Permite suspender sin eliminar cuenta |
| `allow create` en tenant si ownerUid == uid | Permite registro sin romper seguridad |
| `firestore.rules` versionado en Git | Trazabilidad de cambios |
| Dispositivos como catálogo global `devices/` | Marcas y modelos son iguales para todos los talleres |
| Órdenes nunca se eliminan | Preservar historial completo |
| `orden.repuesto.cantidad` siempre 1 | Simplificación para MVP |
| Stock crítico = cantidad ≤ 3 | Umbral configurable via constante `STOCK_CRITICO` |
| Dashboard simplificado con datos reales | Mejor UX que campos vacíos |
| jsPDF para generación de PDF | Control total sobre el diseño del documento |
| Onboarding como pantalla en dashboard | No invasivo, no bloquea navegación |
| `onboardingCompletado` en Firestore | Persiste entre dispositivos y sesiones |