class Account {
    constructor(accountName, pin, userId, userType, pictureUrl, currentBalance) {
        this.accountName = accountName; // The name of the account holder
        this.pin = pin;                 // The account's PIN
        this.userId = userId;           // Unique identifier for the user
        this.userType = userType;       // Type of user (e.g., "parent", "child", etc.)
        this.pictureUrl = pictureUrl;
        this.currentBalance = currentBalance;
    }

    // Method to check if a given PIN is correct
    validatePin(inputPin) {
        return this.pin === inputPin;
    }

    // Method to display the user's role
    getUserRole() {
        return `This account belongs to a ${this.userType}`;
    }

    // Method to anonymize sensitive data (useful for logs or display)
    anonymize() {
        return {
            accountName: this.accountName,
            userId: this.userId,
            userType: this.userType,
        };
    }

    // Example of how you might format account information for display
    getAccountInfo() {
        return `Account Name: ${this.accountName}\nUser ID: ${this.userId}\nUser Type: ${this.userType}`;
    }

    getDisplayInfo() {
        return {
            name: this.accountName,
            status: this.userType,
            pictureUrl: this.pictureUrl,
            pin: this.pin
        };
    }
}

export default Account;