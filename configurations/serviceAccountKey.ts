export  const firebaseconfig = {
  type: "service_account" as string,
  project_id: "lucid-splicer-426105-u4" as string,
  private_key_id: process.env.PRIVATE_KEY_ID as string,
  private_key:( process.env.PRIVATE_KEY as string).replace(/\\n/g, "\n"),
  client_email:
    "firebase-adminsdk-99h12@lucid-splicer-426105-u4.iam.gserviceaccount.com" as string,
  client_id: "103529159814701260362" as string,
  auth_uri: "https://accounts.google.com/o/oauth2/auth" as string,
  token_uri: "https://oauth2.googleapis.com/token" as string,
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs" as string,
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-99h12%40lucid-splicer-426105-u4.iam.gserviceaccount.com" as string,
  universe_domain: "googleapis.com" as string,
};
