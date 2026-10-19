
/*
  GENIE – FIREBASE POVEZIVANJE
  Projekat: genie-255f7
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  runTransaction,
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

// Ujednačavanje e-mail adrese.
function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

// Provera izabrane uloge.
function validateRole(role) {
  if (role !== "worker" && role !== "employer") {
    throw new Error("Izaberite Radnik ili Poslodavac.");
  }
}

// Provera prijavljenog korisnika.
function requireSignedInUser() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Prvo se prijavite u Genie.");
  }

  return user;
}

// Čitanje profila trenutno prijavljenog korisnika.
async function getMyProfile() {
  const user = requireSignedInUser();
  const profileRef = doc(db, "users", user.uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    throw new Error(
      "Profil nije pronađen. Odjavite se i pokušajte ponovo da se prijavite."
    );
  }

  return {
    user,
    profile: profileSnap.data()
  };
}

// Prepoznavanje uloge korisnika.
export async function getCurrentGenieProfile() {
  return await getMyProfile();
}

// Kreiranje novog naloga.
export async function createGenieAccount(
  email,
  password,
  requestedRole
) {
  validateRole(requestedRole);

  const clean = cleanEmail(email);

  if (!clean || !password) {
    throw new Error("Unesite e-mail i lozinku.");
  }

  if (password.length < 6) {
    throw new Error("Lozinka mora imati najmanje 6 znakova.");
  }

  const result = await createUserWithEmailAndPassword(
    auth,
    clean,
    password
  );

  const profile = {
    role: requestedRole === "worker" ? "worker" : "pending",
    requestedRole,
    email: clean,
    createdAt: serverTimestamp()
  };

  try {
    await setDoc(
      doc(db, "users", result.user.uid),
      profile
    );
  } catch (error) {
    await signOut(auth);

    throw new Error(
      "Firebase je napravio nalog, ali nije uspeo da sačuva profil. " +
      "Proverite vezu i pravila baze. Ako je nalog već napravljen, " +
      "pokušajte prijavu istim e-mailom i lozinkom."
    );
  }

  return result.user;
}

// Prijava i provera uloge.
export async function signInGenie(
  email,
  password,
  requestedRole
) {
  validateRole(requestedRole);

  const clean = cleanEmail(email);

  if (!clean || !password) {
    throw new Error("Unesite e-mail i lozinku.");
  }

  const result = await signInWithEmailAndPassword(
    auth,
    clean,
    password
  );

  try {
    const profileRef = doc(db, "users", result.user.uid);
    const profileSnap = await getDoc(profileRef);

    let profile;

    if (profileSnap.exists()) {
      profile = profileSnap.data();
    } else {
      // Oporavak naloga koji nema sačuvan profil.
      profile = {
        role: requestedRole === "worker" ? "worker" : "pending",
        requestedRole,
        email: clean,
        createdAt: serverTimestamp()
      };

      await setDoc(profileRef, profile);
    }

    if (profile.requestedRole !== requestedRole) {
      throw new Error(
        "Izabrali ste pogrešnu vrstu naloga. " +
        "Izaberite ulogu koju ste koristili pri registraciji."
      );
    }

    if (
      requestedRole === "worker" &&
      profile.role !== "worker"
    ) {
      throw new Error("Uloga ovog naloga radnika nije aktivna.");
    }

    if (
      requestedRole === "employer" &&
      profile.role !== "employer" &&
      profile.role !== "pending"
    ) {
      throw new Error("Uloga ovog naloga nije odgovarajuća.");
    }

    return result.user;
  } catch (error) {
    await signOut(auth);
    throw error;
  }
}

// Poslodavac šalje zahtev na e-mail radnika.
export async function sendConnectionRequest(workerEmail) {
  const { user, profile } = await getMyProfile();

  if (
    profile.requestedRole !== "employer" ||
    (profile.role !== "employer" && profile.role !== "pending")
  ) {
    throw new Error(
      "Samo nalog poslodavca može slati zahtev."
    );
  }

  const targetEmail = cleanEmail(workerEmail);

  if (!targetEmail || !targetEmail.includes("@")) {
    throw new Error("Unesite ispravnu e-mail adresu radnika.");
  }

  if (targetEmail === cleanEmail(user.email)) {
    throw new Error("Ne možete poslati zahtev sebi.");
  }

  const requestRef = doc(
    collection(db, "connectionRequests")
  );

  await setDoc(requestRef, {
    employerUid: user.uid,
    employerEmail: cleanEmail(user.email),
    workerEmail: targetEmail,
    status: "pending",
    createdAt: serverTimestamp()
  });

  return requestRef.id;
}

// Radnik prati zahteve poslate na njegov e-mail.
export function watchWorkerConnectionRequests(callback) {
  const user = requireSignedInUser();

  const requestsQuery = query(
    collection(db, "connectionRequests"),
    where("workerEmail", "==", cleanEmail(user.email)),
    where("status", "==", "pending")
  );

  return onSnapshot(
    requestsQuery,
    (snapshot) => {
      const requests = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      callback(requests, null);
    },
    (error) => {
      callback([], error);
    }
  );
}

// Radnik prihvata ili odbija zahtev.
export async function respondToConnectionRequest(
  requestId,
  decision
) {
  if (decision !== "approved" && decision !== "rejected") {
    throw new Error("Izaberite prihvatanje ili odbijanje.");
  }

  const user = requireSignedInUser();
  const { profile } = await getMyProfile();

  if (
    profile.requestedRole !== "worker" ||
    profile.role !== "worker"
  ) {
    throw new Error(
      "Samo aktivan radnik može odgovoriti na zahtev."
    );
  }

  if (!requestId) {
    throw new Error("Nedostaje identifikacija zahteva.");
  }

  const requestRef = doc(
    db,
    "connectionRequests",
    requestId
  );

  await runTransaction(db, async (transaction) => {
    const requestSnap = await transaction.get(requestRef);

    if (!requestSnap.exists()) {
      throw new Error("Zahtev nije pronađen.");
    }

    const requestData = requestSnap.data();

    if (
      cleanEmail(requestData.workerEmail) !==
      cleanEmail(user.email)
    ) {
      throw new Error(
        "Ovaj zahtev nije namenjen vašem nalogu."
      );
    }

    if (requestData.status !== "pending") {
      throw new Error("O ovom zahtevu je već odlučeno.");
    }

    transaction.update(requestRef, {
      status: decision,
      workerUid: user.uid,
      respondedAt: serverTimestamp()
    });

    if (decision === "approved") {
      const connectionRef = doc(
        db,
        "connections",
        user.uid + "_" + requestData.employerUid
      );

      transaction.set(connectionRef, {
        workerUid: user.uid,
        employerUid: requestData.employerUid,
        requestId,
        status: "active",
        createdAt: serverTimestamp()
      });
    }
  });

  return decision;
}

// Poslodavac prati povezane radnike.
export function watchEmployerConnections(callback) {
  const user = requireSignedInUser();

  const connectionsQuery = query(
    collection(db, "connections"),
    where("employerUid", "==", user.uid),
    where("status", "==", "active")
  );

  return onSnapshot(
    connectionsQuery,
    (snapshot) => {
      const connections = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      callback(connections, null);
    },
    (error) => {
      callback([], error);
    }
  );
}

// NOVO: Radnik prati svoje aktivne veze sa poslodavcima.
export function watchWorkerConnections(callback) {
  const user = requireSignedInUser();

  const connectionsQuery = query(
    collection(db, "connections"),
    where("workerUid", "==", user.uid),
    where("status", "==", "active")
  );

  return onSnapshot(
    connectionsQuery,
    (snapshot) => {
      const connections = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      callback(connections, null);
    },
    (error) => {
      callback([], error);
    }
  );
}

// Odjava.
export async function signOutGenie() {
  await signOut(auth);
}

// Trenutni korisnik.
export function currentGenieUser() {
  return auth.currentUser;
}

// Praćenje prijave i odjave.
export function watchGenieAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
