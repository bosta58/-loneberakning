
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

// Kreiranje novog naloga
export async function createGenieAccount(email, password, requestedRole) {
  if (requestedRole !== "worker" && requestedRole !== "employer") {
    throw new Error("Izaberite Radnik ili Poslodavac.");
  }

  const cleanEmail = email.trim();

  const result = await createUserWithEmailAndPassword(
    auth,
    cleanEmail,
    password
  );

  const profile = {
    role: requestedRole === "worker" ? "worker" : "pending",
    requestedRole: requestedRole,
    email: cleanEmail,
    createdAt: serverTimestamp()
  };

  await setDoc(doc(db, "users", result.user.uid), profile);

  return result.user;
}

// Prijava i provera uloge
export async function signInGenie(email, password, requestedRole) {
  if (requestedRole !== "worker" && requestedRole !== "employer") {
    throw new Error("Izaberite Radnik ili Poslodavac.");
  }

  const cleanEmail = email.trim();

  const result = await signInWithEmailAndPassword(
    auth,
    cleanEmail,
    password
  );

  try {
    const profileRef = doc(db, "users", result.user.uid);
    const profileSnap = await getDoc(profileRef);

    let profile;

    if (profileSnap.exists()) {
      profile = profileSnap.data();
    } else {
      profile = {
        role: requestedRole === "worker" ? "worker" : "pending",
        requestedRole: requestedRole,
        email: cleanEmail,
        createdAt: serverTimestamp()
      };

      await setDoc(profileRef, profile);
    }

    if (profile.requestedRole !== requestedRole) {
      throw new Error(
        "Izabrali ste pogrešnu vrstu naloga. Izaberite odgovarajuću ulogu."
      );
    }

    if (requestedRole === "employer" && profile.role !== "employer") {
      throw new Error(
        "Nalog poslodavca čeka odobrenje. Još nije moguće nastaviti."
      );
    }

    if (requestedRole === "worker" && profile.role !== "worker") {
      throw new Error("Nalog radnika nije aktivan.");
    }

    return result.user;

  } catch (error) {
    await signOut(auth);
    throw error;
  }
}

// Odjava
export async function signOutGenie() {
  await signOut(auth);
}

// Trenutni korisnik
export function currentGenieUser() {
  return auth.currentUser;
}

// Praćenje prijave
export function watchGenieAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
