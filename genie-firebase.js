

/*
  GENIE – FIREBASE POVEZIVANJE
  Projekat: genie-255f7
  Prijava, veze radnika i poslodavaca i obračuni plata.
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
  getFirestore,
  doc,
  collection,
  setDoc,
    updateDoc,
  getDoc,
  getDocs,
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

function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validateRole(role) {
  if (role !== "worker" && role !== "employer") {
    throw new Error("Izaberite Radnik ili Poslodavac.");
  }
}

function requireSignedInUser() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Prvo se prijavite u Genie.");
  }

  return user;
}

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

export async function getCurrentGenieProfile() {
  return await getMyProfile();
}

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
    await setDoc(doc(db, "users", result.user.uid), profile);
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

/* -----------------------------------------
   GENIE PORUKE — FIREBASE
----------------------------------------- */

export async function sendGenieMessage(data) {
  const { user, profile } = await getMyProfile();

  if (profile.requestedRole !== "employer") {
    throw new Error("Samo poslodavac može poslati novu poruku.");
  }

  const workerUid = String(data.workerUid || "").trim();
  const message = String(data.message || "").trim();

  if (!workerUid || !message) {
    throw new Error("Nedostaje radnik ili tekst poruke.");
  }

  const connectionId = workerUid + "_" + user.uid;
  const connectionSnap = await getDoc(
    doc(db, "connections", connectionId)
  );

  if (!connectionSnap.exists() ||
      connectionSnap.data().status !== "active") {
    throw new Error("Radnik nema aktivnu vezu sa ovim poslodavcem.");
  }

  const messageRef = doc(collection(db, "messages"));

  await setDoc(messageRef, {
    workerUid,
    employerUid: user.uid,
    employee: String(data.employee || ""),
    payType: String(data.payType || ""),
    message,
    reply: "",
    status: "Ny kommentar",
    periodStart: String(data.periodStart || ""),
    periodEnd: String(data.periodEnd || ""),
    periodKey: String(data.periodKey || ""),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return messageRef.id;
}

export async function sendGenieMessageToEmployee(data) {
  const { user } = await getMyProfile();

  const employeeName = String(data.employee || "")
    .trim()
    .toLocaleLowerCase();

  if (!employeeName) {
    throw new Error("Nedostaje ime radnika.");
  }

  const connectionsQuery = query(
    collection(db, "connections"),
    where("employerUid", "==", user.uid),
    where("status", "==", "active")
  );

  const connectionsSnapshot = await getDocs(connectionsQuery);
  const workerUids = new Set();

  for (const connectionDoc of connectionsSnapshot.docs) {
    const connection = connectionDoc.data();
    const workerUid = String(connection.workerUid || "").trim();

    if (!workerUid) continue;

    const recordsQuery = query(
      collection(db, "salaryRecords"),
      where("employerUid", "==", user.uid),
      where("workerUid", "==", workerUid)
    );

    const recordsSnapshot = await getDocs(recordsQuery);

    recordsSnapshot.forEach((item) => {
      const record = item.data();

      if (
        String(record.employee || "")
          .trim()
          .toLocaleLowerCase() === employeeName &&
        record.workerUid
      ) {
        workerUids.add(record.workerUid);
      }
    });
  }

  if (workerUids.size === 0) {
    throw new Error(
      "Radnik nije pronađen u Firebase obračunima. " +
      "Proverite da li je njegova plata već poslata."
    );
  }

  if (workerUids.size > 1) {
    throw new Error(
      "Više radnika ima isto ime. Potrebna je dodatna provera."
    );
  }

  return await sendGenieMessage({
    ...data,
    workerUid: [...workerUids][0]
  });
}

export function watchGenieMessages(callback) {
  const user = requireSignedInUser();
  let stopListening = null;
  let stopped = false;

  getMyProfile()
    .then(({ profile }) => {
      if (stopped) return;

      const field =
        profile.requestedRole === "worker"
          ? "workerUid"
          : "employerUid";

      const messagesQuery = query(
        collection(db, "messages"),
        where(field, "==", user.uid)
      );

      stopListening = onSnapshot(
        messagesQuery,
        (snapshot) => {
          const messages = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }));

          messages.sort((a, b) => {
            const timeA = a.createdAt?.toMillis?.() || 0;
            const timeB = b.createdAt?.toMillis?.() || 0;
            return timeB - timeA;
          });

          callback(messages, null);
        },
        (error) => callback([], error)
      );
    })
    .catch((error) => callback([], error));

  return () => {
    stopped = true;
    if (stopListening) stopListening();
  };
}

export async function replyToGenieMessage(messageId, reply) {
  const { user, profile } = await getMyProfile();

  if (profile.requestedRole !== "worker") {
    throw new Error("Samo radnik može odgovoriti na poruku.");
  }

  const text = String(reply || "").trim();

  if (!messageId || !text) {
    throw new Error("Unesite odgovor.");
  }

  const messageRef = doc(db, "messages", messageId);
  const messageSnap = await getDoc(messageRef);

  if (!messageSnap.exists()) {
    throw new Error("Poruka nije pronađena.");
  }

  const data = messageSnap.data();

  if (data.workerUid !== user.uid) {
    throw new Error("Ova poruka nije namenjena ovom radniku.");
  }

  await updateDoc(messageRef, {
    reply: text,
    status: "Svar från arbetstagaren",
    updatedAt: serverTimestamp()
  });
}

export async function markGenieMessageFixed(messageId) {
  const { user, profile } = await getMyProfile();

  if (profile.requestedRole !== "employer") {
    throw new Error("Samo poslodavac može označiti poruku kao rešenu.");
  }

  const messageRef = doc(db, "messages", messageId);
  const messageSnap = await getDoc(messageRef);

  if (!messageSnap.exists()) {
    throw new Error("Poruka nije pronađena.");
  }

  if (messageSnap.data().employerUid !== user.uid) {
    throw new Error("Ova poruka ne pripada ovom poslodavcu.");
  }

  await updateDoc(messageRef, {
    status: "Åtgärdad",
    updatedAt: serverTimestamp()
  });
}

/* -----------------------------------------
   KRAJ GENIE PORUKA
----------------------------------------- */

/* -----------------------------------------
   POVEZIVANJE RADNIKA I POSLODAVCA
----------------------------------------- */

export async function sendConnectionRequest(workerEmail) {
  const { user, profile } = await getMyProfile();

  if (
    profile.requestedRole !== "employer" ||
    (
      profile.role !== "employer" &&
      profile.role !== "pending"
    )
  ) {
    throw new Error("Samo nalog poslodavca može slati zahtev.");
  }

  const targetEmail = cleanEmail(workerEmail);

  if (!targetEmail || !targetEmail.includes("@")) {
    throw new Error("Unesite ispravnu e-mail adresu radnika.");
  }

  if (targetEmail === cleanEmail(user.email)) {
    throw new Error("Ne možete poslati zahtev sebi.");
  }

  const requestRef = doc(collection(db, "connectionRequests"));

  await setDoc(requestRef, {
    employerUid: user.uid,
    employerEmail: cleanEmail(user.email),
    workerEmail: targetEmail,
    status: "pending",
    createdAt: serverTimestamp()
  });

  return requestRef.id;
}

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
    (error) => callback([], error)
  );
}

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

  const requestRef = doc(db, "connectionRequests", requestId);

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
      throw new Error("Ovaj zahtev nije namenjen vašem nalogu.");
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
    (error) => callback([], error)
  );
}

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
    (error) => callback([], error)
  );
}

/* -----------------------------------------
   OBRAČUNI PLATA – PRIPREMA ZA FIREBASE
----------------------------------------- */

function makeSalaryRecordId(workerUid, employerUid, record) {
  const type = encodeURIComponent(String(record.type || "Timlon"));
  const period = encodeURIComponent(
    String(record.periodKey || record.periodStart || "period")
  );

  return workerUid + "_" + employerUid + "_" + type + "_" + period;
}

/*
  Poziva se sa stranice obračuna kada radnik sačuva platu.
  Čuva poseban primerak za svakog aktivno povezanog poslodavca.
  Firestore pravila za salaryRecords još moraju biti podešena
  pre nego što ovaj prenos može uspešno da radi.
*/
export async function saveWorkerSalaryRecord(record) {
  const { user, profile } = await getMyProfile();

  if (
    profile.requestedRole !== "worker" ||
    profile.role !== "worker"
  ) {
    throw new Error("Samo radnik može poslati svoj obračun plate.");
  }

  if (!record || typeof record !== "object") {
    throw new Error("Podaci obračuna nisu pronađeni.");
  }

  if (!record.type || !record.periodKey) {
    throw new Error(
      "Obračunu nedostaje vrsta plate ili obračunski period."
    );
  }

  const connectionsQuery = query(
    collection(db, "connections"),
    where("workerUid", "==", user.uid),
    where("status", "==", "active")
  );

  const connectionSnapshot = await getDocs(connectionsQuery);

  if (connectionSnapshot.empty) {
    return {
      uploaded: 0,
      message: "Nema aktivno povezanog poslodavca."
    };
  }

  let uploaded = 0;

  for (const connectionDoc of connectionSnapshot.docs) {
    const connection = connectionDoc.data();

    if (
      connection.workerUid !== user.uid ||
      !connection.employerUid ||
      connection.status !== "active"
    ) {
      continue;
    }

    const salaryRecord = {
      workerUid: user.uid,
      employerUid: connection.employerUid,
      workerEmail: cleanEmail(user.email),
      employee: String(record.employee || ""),
      employer: String(record.employer || ""),
      type: String(record.type),
      periodStart: String(record.periodStart || ""),
      periodEnd: String(record.periodEnd || ""),
      periodKey: String(record.periodKey),
      hours: record.hours || {},
      rates: record.rates || {},
      holidayPay: Number(record.holidayPay || 0),
      tax: Number(record.tax || 0),
      calculation: record.calculation || {},
      updatedAt: serverTimestamp()
    };

    const recordId = makeSalaryRecordId(
      user.uid,
      connection.employerUid,
      record
    );

    await setDoc(
      doc(db, "salaryRecords", recordId),
      salaryRecord,
      { merge: true }
    );

    uploaded++;
  }

  return {
    uploaded,
    message: "Obračun je poslat povezanim poslodavcima."
  };
}

/*
  Poslodavac prati obračune koji pripadaju njegovom nalogu.
  Pravila baze moraju dozvoliti samo čitanje obračuna
  radnika sa kojima postoji aktivna veza.
*/
export function watchEmployerSalaryRecords(callback) {
  const user = requireSignedInUser();

  const recordsQuery = query(
    collection(db, "salaryRecords"),
    where("employerUid", "==", user.uid)
  );

  return onSnapshot(
    recordsQuery,
    (snapshot) => {
      const records = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      callback(records, null);
    },
    (error) => callback([], error)
  );
}

/*
  Radnik prati svoje obračune sa Firebasea.
*/
export function watchWorkerSalaryRecords(callback) {
  const user = requireSignedInUser();

  const recordsQuery = query(
    collection(db, "salaryRecords"),
    where("workerUid", "==", user.uid)
  );

  return onSnapshot(
    recordsQuery,
    (snapshot) => {
      const records = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      callback(records, null);
    },
    (error) => callback([], error)
  );
}

/* -----------------------------------------
   PRIJAVA I ODJAVA
----------------------------------------- */

export async function signOutGenie() {
  await signOut(auth);
}

export function currentGenieUser() {
  return auth.currentUser;
}

export function watchGenieAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
