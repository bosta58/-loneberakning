
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

initializeApp();

const db = getFirestore();

const TRIAL_DAYS = 60;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

// Postojeći testni nalozi – izuzeti od probnog perioda.
const EXEMPT_UIDS = [
  "r1D0EHrc1ccocp5NxxoIj6412BJ2",
  "tdzmcSgglsZI4H66V5Bdr6HHJMu2"
];

exports.startOrGetTrial = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Morate biti prijavljeni."
    );
  }

  const uid = request.auth.uid;

  // Postojeći testni nalozi nemaju probni period.
  if (EXEMPT_UIDS.includes(uid)) {
    return {
      status: "exempt",
      trialStartedAt: null,
      trialEndsAt: null
    };
  }

  try {
    // Datum registracije uzima se direktno od Firebase servera.
    const user = await getAuth().getUser(uid);
    const registrationTime = Date.parse(
      user.metadata.creationTime
    );

    if (!Number.isFinite(registrationTime)) {
      throw new HttpsError(
        "failed-precondition",
        "Nije moguće proveriti datum registracije."
      );
    }

    const trialStartedAt = Timestamp.fromMillis(
      registrationTime
    );

    const trialEndsAt = Timestamp.fromMillis(
      registrationTime + TRIAL_DAYS * DAY_IN_MS
    );

    const trialRef = db.collection("userTrials").doc(uid);

    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(trialRef);

      if (snapshot.exists) {
        const data = snapshot.data();

        if (
          data.uid !== uid ||
          !(data.trialStartedAt instanceof Timestamp) ||
          !(data.trialEndsAt instanceof Timestamp)
        ) {
          throw new HttpsError(
            "failed-precondition",
            "Podaci o probnom periodu nisu ispravni."
          );
        }

        return data;
      }

      const trialData = {
        uid: uid,
        trialStartedAt: trialStartedAt,
        trialEndsAt: trialEndsAt,
        status: "trial",
        createdAt: Timestamp.now()
      };

      transaction.create(trialRef, trialData);

      return trialData;
    });

    const now = Timestamp.now();

    return {
      status: now.toMillis() < result.trialEndsAt.toMillis()
        ? "trial"
        : "expired",
      trialStartedAt: result.trialStartedAt.toMillis(),
      trialEndsAt: result.trialEndsAt.toMillis()
    };

  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError(
      "internal",
      "Greška pri proveri probnog perioda."
    );
  }
});
