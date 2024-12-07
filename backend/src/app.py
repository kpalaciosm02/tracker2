from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)

# Initialize Firestore
cred = credentials.Certificate("../key/allowance-tracker-84ada-firebase-adminsdk-ah9d3-7f59fae16c.json")  # Replace with your service account JSON path
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/get-users', methods=['GET'])
def get_data():
    collection_name = request.args.get('collection', 'users')  # Pass collection name as query param
    docs = db.collection(collection_name).stream()
    data = {doc.id: doc.to_dict() for doc in docs}
    return jsonify(data)

@app.route('/get-user', methods=['GET'])
def get_user():
    try:
        user_id = request.args.get('userId')  # Get userId from query parameters
        if not user_id:
            return jsonify({"error": "Missing userId parameter"}), 400

        # Query Firestore for the user
        doc_ref = db.collection('users').document(user_id)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({"error": f"No user found with userId: {user_id}"}), 404

        return jsonify(doc.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
