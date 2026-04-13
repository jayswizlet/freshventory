import firebase_admin
from firebase_admin import credentials, firestore

# Provide the path to your Firebase service account JSON file
cred = credentials.Certificate("BackendApp/.env")

# Initialize Firebase app
firebase_admin.initialize_app(cred)

# Example: Initialize Firestore
db = firestore.client()

# Example: Add data to Firestore
doc_ref = db.collection("users").document("user_id")
doc_ref.set({
    "name": "Test",
    "email": "Test@email.com"
})

print("Data written to Firestore")
