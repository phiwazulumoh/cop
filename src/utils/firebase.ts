import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA9JjftiH2eQOc7Pp6_If464QJVh1mwSSo",
  authDomain: "communityofpractice-b1ef1.firebaseapp.com",
  databaseURL: "https://communityofpractice-b1ef1-default-rtdb.firebaseio.com",
  projectId: "communityofpractice-b1ef1",
  storageBucket: "communityofpractice-b1ef1.firebasestorage.app",
  messagingSenderId: "231893278193",
  appId: "1:231893278193:web:0517d68a1d2eede9863850",
  measurementId: "G-WES8ZNGQ7V"
};

const app = initializeApp(firebaseConfig);
const database: Database = getDatabase(app);
const auth: Auth = getAuth(app);

export { database, auth };