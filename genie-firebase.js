
/*
  GENIE – FIREBASE POVEZIVANJE
  Projekat: genie-255f7
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_Jr_suisLmVpuuXParkd8jWy901hfin0",
  authDomain: "genie-255f7.firebaseapp.com",
  projectId: "genie-255f7",
  storageBucket: "genie-255f7.firebasestorage.app",
  messagingSenderId: "296648095221",
  appId: "1:296648095221:web:e6caadf211ef0b60335cbc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Kreiranje novog korisničkog naloga
export async function createGenieAccount(email, password, requestedRole) {
  if (requestedRole !== "worker" && requestedRole !== "employer") {
    throw new Error("Izaberite Radnik ili Poslodavac.");
  }

  const result = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  const profile = {
    role: requestedRole === "worker" ? "worker" : "pending",
    requestedRole: requestedRole,
    email: email.trim(),
    createdAt: serverTimestamp()
  };

  await setDoc(doc(db, "users", result.user.uid), profile);

  return result.user;
}

// Prijava postojećeg korisnika i provera uloge
export async function signInGenie(email, password, requestedRole) {
  if (requestedRole !== "worker" && requestedRole !== "employer") {
    throw new Error("Izaberite Radnik ili Poslodavac.");
  }

  const result = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  const profileRef = doc(db, "users", result.user.uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    await signOut(auth);
    throw new Error(
      "Profil nije pronađen. Kontaktirajte podršku."
    );
  }

  const profile = profileSnap.data();

  if (profile.requestedRole !== requestedRole) {
    await signOut(auth);
    throw new Error(
      "Izabrali ste pogrešnu vrstu naloga. Izaberite odgovarajuću ulogu."
    );
  }

  if (requestedRole === "employer" && profile.role !== "employer") {
    await signOut(auth);
    throw new Error(
      "Nalog poslodavca čeka odobrenje. Još nije moguće nastaviti."
    );
  }

  if (requestedRole === "worker" && profile.role !== "worker") {
    await signOut(auth);
    throw new Error("Nalog radnika nije aktivan.");
  }

  return result.user;
}

// Odjava korisnika
export async function signOutGenie() {
  await signOut(auth);
}

// Provera prijavljenog korisnika
export function currentGenieUser() {
  return auth.currentUser;
}

// Praćenje promene stanja prijave
export function watchGenieAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
