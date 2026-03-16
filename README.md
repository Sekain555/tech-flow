# TechFlow - Sistema de Gestión de Servicios Técnicos
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Sekain555/tech-flow)

TechFlow es una aplicación móvil desarrollada con Angular e Ionic diseñada para optimizar las operaciones de talleres de reparación técnica. El sistema gestiona el flujo completo de reparaciones desde el registro de clientes hasta la finalización de órdenes, incluyendo gestión de inventario, asignación de técnicos y análisis de negocio.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Frontend**: Angular 14, Ionic 6, TypeScript
- **Backend**: Firebase (Firestore Database, Authentication)
- **Mobile**: Capacitor (Android, iOS)
- **UI**: Chart.js para visualización, Swiper para carruseles
- **Build**: Angular CLI con configuración Ionic [3](#0-2) [4](#0-3) 

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 16+
- Angular CLI 14+
- Android Studio (para desarrollo Android)
- Xcode (para desarrollo iOS)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Sekain555/tech-flow.git
cd tech-flow
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**
   - Crear un proyecto en Firebase Console
   - Configurar Firestore Database
   - Habilitar Authentication
   - Actualizar las credenciales en `src/environments/`

4. **Ejecutar en desarrollo**
```bash
npm start
```

5. **Construir para producción**
```bash
npm run build
```

6. **Ejecutar en móvil**
```bash
# Android
npx cap run android

# iOS
npx cap run ios
```

## 📱 Funcionalidades Principales

### Gestión de Órdenes de Trabajo
- Creación de órdenes con flujo paso a paso
- Asignación de técnicos
- Seguimiento de estado
- Generación de reportes

### Gestión de Clientes
- Registro de nuevos clientes
- Búsqueda y consulta de clientes existentes
- Historial de reparaciones por cliente

### Gestión de Inventario
- Control de repuestos y accesorios
- Actualización de stock
- Asignación de partes a órdenes

### Análisis y Reportes
- Dashboard con métricas clave
- Gráficos de rendimiento
- Reportes de comisiones

## 🔐 Roles de Usuario

El sistema implementa tres roles con permisos específicos:

| Rol | Funciones Principales |
|-----|---------------------|
| Administrador | Acceso completo, gestión de usuarios |
| Técnico | Procesamiento de órdenes, operaciones técnicas |
| Vendedor | Gestión de clientes, creación de órdenes | [5](#0-4) 

## 📊 Modelo de Datos

### Entidades Principales
- **UsuarioI**: Información de usuarios del sistema
- **ClienteST**: Datos de clientes y sus dispositivos
- **Ordenes**: Órdenes de trabajo con detalles completos
- **InventarioRepuesto**: Control de repuestos y servicios [6](#0-5) 

## 🛠️ Configuración de Plataformas

### Android
- App ID: `io.ionic.starter`
- Versión mínima: API 21+
- Configuración en `android/app/src/main/`

### iOS
- Bundle Identifier: `io.ionic.starter`
- Versión mínima: iOS 11.0+
- Configuración en `ios/App/App/` [7](#0-6) [8](#0-7) 

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── models/           # Modelos de datos TypeScript
│   ├── pages/           # Páginas de la aplicación
│   │   ├── recepcion/   # Página de bienvenida y login
│   │   ├── nuevaorden/  # Creación de órdenes
│   │   ├── menuclientes/ # Gestión de clientes
│   │   ├── menuordenes/  # Gestión de órdenes
│   │   └── menuinventario/ # Gestión de inventario
│   ├── services/        # Servicios de Firebase
│   └── app.module.ts    # Módulo principal
├── assets/              # Recursos estáticos
└── index.html          # Página principal
```

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia servidor de desarrollo |
| `npm run build` | Construye para producción |
| `npm test` | Ejecuta pruebas unitarias |
| `npm run lint` | Verifica calidad de código |
| `npm run e2e` | Ejecuta pruebas end-to-end | [9](#0-8) 

## 📄 Licencia

Este proyecto es propiedad de TechFlow y está desarrollado por Insert Coin.

## 🤝 Contribución

Para contribuir al proyecto:
1. Fork del repositorio
2. Crear rama de características
3. Realizar cambios y pruebas
4. Enviar Pull Request

---

## Notes

- El README está basado en la arquitectura y configuración actual del proyecto Sekain555/tech-flow
- Todas las referencias a "Kit Sertec" han sido reemplazadas por "TechFlow" según lo solicitado
- La configuración de Firebase debe ser completada antes de ejecutar la aplicación
- Para desarrollo móvil se requiere configurar los entornos específicos de Android Studio o Xcode

Wiki pages you might want to explore:
- [Overview (Sekain555/tech-flow)](/wiki/Sekain555/tech-flow#1)
- [Order Creation & Registration (Sekain555/tech-flow)](/wiki/Sekain555/tech-flow#4.1)

### Citations

**File:** package.json (L6-13)
```json
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  },
```

**File:** package.json (L15-48)
```json
  "dependencies": {
    "@angular/common": "^14.0.0",
    "@angular/core": "^14.0.0",
    "@angular/fire": "^7.4.1",
    "@angular/forms": "^14.0.0",
    "@angular/platform-browser": "^14.0.0",
    "@angular/platform-browser-dynamic": "^14.0.0",
    "@angular/router": "^14.0.0",
    "@awesome-cordova-plugins/barcode-scanner": "^6.1.0",
    "@awesome-cordova-plugins/core": "6.1.0",
    "@awesome-cordova-plugins/http": "^6.1.0",
    "@capacitor-community/barcode-scanner": "^3.0.0",
    "@capacitor/android": "4.4.0",
    "@capacitor/app": "4.1.0",
    "@capacitor/core": "4.4.0",
    "@capacitor/haptics": "4.0.1",
    "@capacitor/ios": "4.4.0",
    "@capacitor/keyboard": "4.0.1",
    "@capacitor/status-bar": "4.0.1",
    "@ionic-native/barcode-scanner": "^5.36.0",
    "@ionic/angular": "^6.1.9",
    "chart.js": "^4.0.1",
    "cordova-plugin-advanced-http": "^3.3.1",
    "cordova-plugin-file": "7.0.0",
    "firebase": "^9.13.0",
    "html2canvas": "^1.4.1",
    "ionicons": "^6.0.3",
    "jspdf": "^2.5.1",
    "ng2-charts": "^3.0.0-rc.7",
    "nodemailer": "^6.8.0",
    "rxjs": "~6.6.0",
    "swiper": "^8.4.5",
    "tslib": "^2.2.0",
    "zone.js": "~0.11.4"
```

**File:** angular.json (L6-16)
```json
    "app": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "app",
      "schematics": {},
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "www",
```

**File:** capacitor.config.ts (L3-8)
```typescript
const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Kit Sertec',
  webDir: 'www',
  bundledWebRuntime: false
};
```

**File:** ios/App/App/Info.plist (L7-8)
```text
	<key>CFBundleDisplayName</key>
        <string>Kit Sertec</string>
```
