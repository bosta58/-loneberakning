const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

initializeApp();

const db = getFirestore();

const TRIAL_DAYS = 60;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

// Pokreće probni period ili vraća već postojeći.
// Datum početka određuje Firebase server.
exports.startOrGetTrial = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Morate biti prijavljeni."
    );
  }

  const uid = request.auth.uid;
  const trialRef = db.collection("userTrials").doc(uid);

  const now = Timestamp.now();

  try {
    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(trialRef);

      if (snapshot.exists) {
        const data = snapshot.data();

        if (!data.trialStartedAt || !data.trialEndsAt) {
          throw new HttpsError(
            "failed-precondition",
            "Podaci o probnom periodu nisu ispravni."
          );
        }

        return data;
      }

      const trialEndsAt = Timestamp.fromMillis(
        now.toMillis() + TRIAL_DAYS * DAY_IN_MS
      );

      const trialData = {
        uid: uid,
        trialStartedAt: now,
        trialEndsAt: trialEndsAt,
        status: "trial",
        createdAt: now
      };

      transaction.create(trialRef, trialData);

      return trialData;
    });

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
