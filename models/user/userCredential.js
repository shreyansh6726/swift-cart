const mongoose = require('mongoose');

const userCredentialSchema = new mongoose.Schema({
   user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User', // Links to your user_details / user model
      unique: true // Ensures each user has only one password record
   },
   password: {
      type: String,
      required: [true, 'Password is required']
   }
}, {
   timestamps: true // Automatically manages createdAt and updatedAt
});

// Create and export the model
const UserCredential = mongoose.model('UserCredential', userCredentialSchema);

module.exports = UserCredential;