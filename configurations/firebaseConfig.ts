import admin, { ServiceAccount } from "firebase-admin";
import path from "path";
import  {firebaseconfig}  from "./serviceAccountKey"
// const serviceAccountPath = path.resolve( "./configurations/serviceAccountKey.json");

// const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(firebaseconfig as ServiceAccount),
  storageBucket: "gs://lucid-splicer-426105-u4.appspot.com",
});


export const bucket = admin.storage().bucket();
export default admin;
