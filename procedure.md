
```bash
# https://note.com/_little_en_grey_/n/nb93de8a30f40

# Vuetify 3 と Vite のプラグインを入れます。
npm install -D vuetify
npm install -D vite-plugin-vuetify # vite
npm install @mdi/font #mdiフォント

# chartjsインストール
npm install vue-chartjs chart.js

# firebase
npm install firebase
```

```ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3i_r0RuSo4QA45RwOINlO87q1uVqbJkU",
  authDomain: "mypage-53806.firebaseapp.com",
  projectId: "mypage-53806",
  storageBucket: "mypage-53806.appspot.com",
  messagingSenderId: "1071162579188",
  appId: "1:1071162579188:web:aa8a5af3877b4af30266a1",
  measurementId: "G-FLHKHZEJ68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

```bash

npm install -g firebase-tools

# bun
bun install
```