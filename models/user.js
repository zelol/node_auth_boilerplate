const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const UserSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
});

// On Save Hook, encrypt password
// Before saving na model; run this function
UserSchema.pre('save', function(next){
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if(err) { return next(err); }

    // hash our password using this salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err) }

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create the model class
const ModelClass = mongoose.model('user', UserSchema);


// Export the model
module.exports = ModelClass;
