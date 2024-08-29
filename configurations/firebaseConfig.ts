import admin from "firebase-admin";
import path from "path";
const serviceAccountPath = path.resolve( "./configurations/serviceAccountKey.json");

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  storageBucket: "gs://lucid-splicer-426105-u4.appspot.com",
});

export const bucket = admin.storage().bucket();
export default admin;
