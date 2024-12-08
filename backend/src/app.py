from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

app = Flask(__name__)

# Initialize Firestore
cred = credentials.Certificate("../key/allowance-tracker-84ada-firebase-adminsdk-ah9d3-7f59fae16c.json")  # Replace with your service account JSON path
firebase_admin.initialize_app(cred)
db = firestore.client()

CORS(app)

@app.route('/get-users', methods=['GET'])
def get_data():
    collection_name = request.args.get('collection', 'profile')  # Pass collection name as query param
    docs = db.collection(collection_name).stream()
    data = {doc.id: doc.to_dict() for doc in docs}
    return jsonify(data)

@app.route('/get-user', methods=['GET'])
def get_user():
    try:
        user_id = request.args.get('userId')  # Get userId from query parameters
        if not user_id:
            return jsonify({"error": "Missing userId parameter"}), 400

        # Query Firestore for the user where userId field matches the provided userId
        docs = db.collection('profile').where('userId', '==', user_id).stream()

        # Collect matching documents
        user_data = []
        for doc in docs:
            user_data.append(doc.to_dict())

        if not user_data:
            return jsonify({"error": f"No user found with userId: {user_id}"}), 404

        return jsonify(user_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add-profile', methods=['POST'])
def add_profile():
    try:
        # Get data from the request
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'pin', 'balance', 'userType', 'userId']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Prepare the profile document
        profile = {
            'name': data['name'],
            'pin': data['pin'],
            'currentBalance': data['balance'],
            'userType': data['userType'],
            'userId': data['userId'],
        }
        
        # Add the profile to Firestore
        # This will create a new document each time, allowing multiple profiles per userId
        doc_ref = db.collection('profile').add(profile)
        
        return jsonify({
            "message": "Profile added successfully",
            "documentId": doc_ref[1].id
        }), 201
    
    except Exception as e:
        print(f"Error adding profile: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/delete-profile', methods=['DELETE'])
def delete_profile():
    try:
        # Get the 'name' and 'userId' from the request JSON body
        data = request.json
        name = data.get('name')
        user_id = data.get('userId')

        # Validate required fields
        if not name or not user_id:
            return jsonify({"error": "Missing 'name' or 'userId' in request body"}), 400

        # Query Firestore for the document matching 'name' and 'userId'
        docs = db.collection('profile') \
                 .where('name', '==', name) \
                 .where('userId', '==', user_id) \
                 .stream()

        # Collect matching documents
        found = False
        for doc in docs:
            found = True
            # Delete the document
            db.collection('profile').document(doc.id).delete()

        if not found:
            return jsonify({"error": "No matching profile found"}), 404

        return jsonify({"message": "Profile deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
