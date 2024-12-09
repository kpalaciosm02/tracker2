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

@app.route('/get-children', methods=['GET'])
def get_children():
    try:
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({"error": "Missing userId parameter"}), 400

        docs = db.collection('profile') \
                 .where('userId', '==', user_id) \
                 .where('userType', '==', 'Child') \
                 .stream()

        children = [doc.to_dict() for doc in docs]

        if not children:
            return jsonify({"message": f"No children found for userId: {user_id}"}), 404

        return jsonify(children), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/deposit', methods=['POST'])
def deposit_money():
    try:
        data = request.json
        
        required_fields = ['userId', 'childName', 'amount', 'reason']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        user_id = data['userId']
        child_name = data['childName']
        amount = data['amount']
        reason = data['reason']

        if not isinstance(amount, (int, float)) or amount <= 0:
            return jsonify({"error": "Amount must be a positive number"}), 400
        
        child_docs = db.collection('profile') \
                       .where('userId', '==', user_id) \
                       .where('name', '==', child_name) \
                       .stream()

        child_found = None
        for doc in child_docs:
            child_found = doc
            break

        if not child_found:
            return jsonify({"error": "No matching child found"}), 404
        
        child_ref = db.collection('profile').document(child_found.id)
        current_balance = child_found.to_dict().get('currentBalance', 0)
        new_balance = current_balance + amount
        child_ref.update({'currentBalance': new_balance})

        transactions_ref = db.collection('transactions')
        transactions_ref.add({
            'userId': user_id,
            'childName': child_name,
            'amount': amount,
            'reason': reason,
            'type': 'deposit',
            'timestamp': firestore.SERVER_TIMESTAMP
        })

        return jsonify({
            "message": f"Successfully deposited {amount} to {child_name}'s account.",
            "newBalance": new_balance
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/withdraw', methods=['POST'])
def withdraw_money():
    try:
        data = request.json
        
        required_fields = ['userId', 'childName', 'amount', 'reason']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        user_id = data['userId']
        child_name = data['childName']
        amount = data['amount']
        reason = data['reason']

        if not isinstance(amount, (int, float)) or amount <= 0:
            return jsonify({"error": "Amount must be a positive number"}), 400
        
        child_docs = db.collection('profile') \
                       .where('userId', '==', user_id) \
                       .where('name', '==', child_name) \
                       .stream()

        child_found = None
        for doc in child_docs:
            child_found = doc
            break

        if not child_found:
            return jsonify({"error": "No matching child found"}), 404
        
        child_ref = db.collection('profile').document(child_found.id)
        current_balance = child_found.to_dict().get('currentBalance', 0)

        if amount > current_balance:
            return jsonify({"error": "Insufficient balance"}), 400
        
        new_balance = current_balance - amount
        child_ref.update({'currentBalance': new_balance})

        transactions_ref = db.collection('transactions')
        transactions_ref.add({
            'userId': user_id,
            'childName': child_name,
            'amount': amount,
            'reason': reason,
            'type': 'withdraw',
            'timestamp': firestore.SERVER_TIMESTAMP
        })

        return jsonify({
            "message": f"Successfully withdrew {amount} from {child_name}'s account.",
            "newBalance": new_balance
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-child-transactions', methods=['GET'])
def get_child_transactions():
    try:
        user_id = request.args.get('userId')
        child_name = request.args.get('childName')

        if not user_id or not child_name:
            return jsonify({"error": "Both userId and childName are required"}), 400

        transaction_docs = db.collection('transactions') \
                              .where('userId', '==', user_id) \
                              .where('childName', '==', child_name) \
                              .stream()

        transactions = [
            {**doc.to_dict(), "id": doc.id}
            for doc in transaction_docs
        ]

        if not transactions:
            return jsonify({"message": "No transactions found for the given userId and childName"}), 404

        return jsonify({"transactions": transactions}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-user-transactions', methods=['GET'])
def get_user_transactions():
    try:
        user_id = request.args.get('userId')

        if not user_id:
            return jsonify({"error": "userId is required"}), 400

        transaction_docs = db.collection('transactions') \
                              .where('userId', '==', user_id) \
                              .stream()

        transactions = [
            {**doc.to_dict(), "id": doc.id}
            for doc in transaction_docs
        ]

        if not transactions:
            return jsonify({"message": "No transactions found for the given userId"}), 404

        return jsonify({"transactions": transactions}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-profile', methods=['GET'])
def get_profile():
    try:
        # Get the 'name' and 'userId' from the request JSON body
        name = request.args.get('name')
        user_id = request.args.get('userId')

        # Validate required fields
        if not name or not user_id:
            return jsonify({"error": "Missing 'name' or 'userId' in request body"}), 400

        # Query Firestore for the document matching 'name' and 'userId'
        docs = db.collection('profile') \
                 .where('name', '==', name) \
                 .where('userId', '==', user_id) \
                 .stream()

        # Collect matching documents
        profile = None
        for doc in docs:
            profile = doc.to_dict()

        if not profile:
            return jsonify({"error": "No matching profile found"}), 404

        return jsonify({"profile": profile}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    app.run(debug=True)
