# Setup del proyecto `kit-sertec`

## 1. Requisitos

- `Node.js`: recomendado `18 LTS` (Angular 14 no soporta bien Node 22).
- `npm`: version incluida con Node 18.
- `Git`
- Opcional para comandos globales: `Ionic CLI`

Este repositorio usa:
- Angular `14.x`
- Ionic Angular `6.x`
- Capacitor `4.x`

## 2. Clonar e instalar dependencias

En PowerShell:

```powershell
cd C:\
git clone <URL_DEL_REPO> tech-flow
cd C:\tech-flow
npm install --legacy-peer-deps
```

`--legacy-peer-deps` es necesario por un conflicto de peers entre `ng2-charts` y `chart.js`.

## 3. Variables/archivos de entorno (obligatorio)

Los archivos `src/environments/environment.ts` y `src/environments/environment.prod.ts` no vienen en el repo (estan en `.gitignore`), pero son requeridos por `src/app/app.module.ts`.

Crea la carpeta y archivos:

```powershell
mkdir src\environments
```

`src/environments/environment.ts`

```ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_AUTH_DOMAIN',
    projectId: 'TU_PROJECT_ID',
    storageBucket: 'TU_STORAGE_BUCKET',
    messagingSenderId: 'TU_MESSAGING_SENDER_ID',
    appId: 'TU_APP_ID'
  }
};
```

`src/environments/environment.prod.ts`

```ts
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_AUTH_DOMAIN',
    projectId: 'TU_PROJECT_ID',
    storageBucket: 'TU_STORAGE_BUCKET',
    messagingSenderId: 'TU_MESSAGING_SENDER_ID',
    appId: 'TU_APP_ID'
  }
};
```

## 4. Servicios externos requeridos

- Firebase Authentication + Firestore (la app usa `@angular/fire/compat`).
- API Strapi local en:
  - `http://localhost:1337/api/repuestos`
  - Definido en `src/app/services/strapisql.service.ts`.

Si Strapi no esta levantado en ese host/puerto, los llamados a repuestos fallaran.

## 5. Ejecutar en desarrollo

Sin instalar Ionic global:

```powershell
npx ionic serve
```

Alternativa:

```powershell
npm run start
```

## 6. Scripts disponibles

```powershell
npm run start   # ng serve
npm run build   # ng build
npm run test    # ng test
npm run lint    # ng lint
```

## 7. Capacitor (Android/iOS)

Sincronizar cambios web:

```powershell
npx cap sync
```

Abrir proyecto nativo:

```powershell
npx cap open android
npx cap open ios
```

Requisitos extra:
- Android: Android Studio + SDK
- iOS: Xcode en macOS

## 8. Problemas comunes

- Error `ionic no se reconoce`:
  - Usa `npx ionic serve`, o instala globalmente: `npm i -g @ionic/cli`.
- Error de dependencias al instalar:
  - Ejecuta `npm install --legacy-peer-deps`.
- Advertencia de Node no soportado:
  - Cambia a Node 18 LTS.
