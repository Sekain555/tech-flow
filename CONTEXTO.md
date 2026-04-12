# CONTEXTO.md — TechFlow
> Última actualización: 12-04-2026

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

Usuarios/{uid}           ← legacy, ya no se escribe en registro

devices/{deviceId}       ← catálogo global compartido entre todos los tenants
  - marcadisp: string
  - modelodisp: string
```

### Por tenant
```
tenants/{tenantId}
  - nombretaller: string
  - rutempresa: string
  - correotaller: string
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
- `updateTenant(tenantId, data)`

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
| `userTenants/{uid}` | Solo el propio uid | Create: solo el propio uid / Update y Delete: bloqueado |
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
1. `/ccuenta` → crea Auth + tenant + userTenants + users
2. Envía email de verificación con `sendEmailVerification()`
3. Espera 1500ms para propagación de Firestore
4. Redirige a `/entrada`

> La colección legacy `Usuarios/` ya no se escribe en el registro.
> El campo `correotaller` se captura correctamente desde el formulario.

### Login
1. `/entrada` → consulta `userTenants` → verifica `estado` del tenant
2. Si suspendido → logout + `/recepcion`
3. Si `onboardingCompletado === false` y rol administrador → muestra pantalla bienvenida
4. Si no → dashboard normal con nombre real del usuario y nombre del taller

### Dashboard (entrada)
- Saludo con nombre real del usuario desde `tenants/{tenantId}/users/{uid}`
- Barra lateral muestra `{Rol} de {nombretaller}`
- Últimas 5 órdenes, conteos, clientes e inventario en tiempo real

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
| configadmin | /configadmin | pendiente v0.1.1-alpha.2 |
| menuvideos | /menuvideos | postergado |
| registrovideos | /registrovideos | postergado |

---

## 10. Estado del Trello

### DONE ✅ — MVP + HOTFIX + v0.1.1-alpha.2 (bugs)
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
| 🚨 userTenants no se creaba al registrar nuevo taller |
| 🚨 Email de confirmación al registrar cuenta |
| 🔴 correotaller null en registro de taller |
| 🔴 Saludo al usuario en header de Entrada |
| 🔴 Barra lateral muestra ID de Firestore en vez del nombre del taller |
| 🔴 Tablas desalineadas en registros |
| 🔴 Datos de contacto reales en modal CONTÁCTANOS |

### BACKLOG v0.1.1-alpha.2 (mejoras pendientes)
| Tarjeta | Tipo |
|---|---|
| Configuración del taller desde configadmin | 🟡 MEJORA |
| Logo del taller en PDF de orden | 🟡 MEJORA |
| Editar y eliminar repuesto en registrorepuesto | 🟡 MEJORA |
| Eliminar o desactivar cliente en registroclientes | 🟡 MEJORA |

### BACKLOG v0.1.2-alpha.3
| Tarjeta | Tipo |
|---|---|
| Reemplazar banners Kit Sertec por banners TechFlow | 🟡 MEJORA |
| Tema propio TechFlow | 🟡 MEJORA |
| Rediseño UI general | 🟡 MEJORA |
| Rediseño de menús de categoría | 🟡 MEJORA |
| Responsividad móvil | 🟡 MEJORA |
| Creación de usuarios técnicos y vendedores | 🟢 FEATURE |
| Crear interfaz Tenant y migrar desde Taller legacy | 🟡 MEJORA |
| Bloquear acceso hasta verificar correo | 🟢 FEATURE |

### POST-MVP
| Tarjeta |
|---|
| Panel de administración del sistema (superadmin) |
| Múltiples repuestos por OT |
| Enriquecer dashboard con métricas reales |
| Visita guiada interactiva del sistema |
| Notificaciones por email al cambiar estado de OT |

### ÉPICAS/VISIÓN
| Tarjeta |
|---|
| Sistema NFC — Identificación física de órdenes (v2.0.0) |

---

## 11. Pendientes técnicos conocidos

| Pendiente | Prioridad | Contexto |
|---|---|---|
| Colección `Usuarios/` legacy | Baja | Ya no se escribe, pendiente eliminar de Firestore |
| Interfaz `Taller` legacy | Media | Migrar a `Tenant` en v0.1.2-alpha.3 |
| Técnicos/vendedores sin flujo de creación | Alta | Pendiente v0.1.2-alpha.3 |
| Botón eliminar/editar repuesto sin funcionalidad | Baja | Pendiente v0.1.1-alpha.2 |
| Botón eliminar cliente sin funcionalidad | Baja | Pendiente v0.1.1-alpha.2 |
| Solo un repuesto por OT | Media | Post-MVP |
| Logo del taller en PDF | Baja | Pendiente v0.1.1-alpha.2 |
| `menuresumentec` posiblemente redundante | Baja | Evaluar eliminación |
| Conflicto ng2-charts vs chart.js | Baja | Usar --legacy-peer-deps |
| Verificación de correo no bloquea acceso | Media | Pendiente v0.1.2-alpha.3 |
| Tamaños de columna en tablas revisar con tema propio | Baja | Pendiente v0.1.2-alpha.3 |

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
| `allow create` en userTenants si uid == uid autenticado | Permite registro sin exponer escritura arbitraria |
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
| `setTimeout(1500ms)` antes de navegar post-registro | Garantiza propagación de Firestore |
| `sendEmailVerification()` al completar registro | Verificación de correo — no bloquea acceso aún |
| `ion-grid.tabla-encabezado` para tablas | Alineación consistente entre encabezado y datos |
| Nombre real del usuario desde `tenants/users/{uid}` | Saludo personalizado en dashboard |
| Nombre del taller desde `getTenant()` | Barra lateral con información correcta |