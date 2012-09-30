var redis = require('redis')
  , bcrypt = require('bcrypt')
  , db = redis.createClient();

module.exports = User;

function User(obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
}

User.prototype.save = function(fn){
  if (this.id) {
    this.update(fn);
  } else {
    var self = this;
    db.incr('user:ids', function(err, id){
      if (err) return fn(err);
      self.id = id.toString();
      self.hashPassword(function(err){
      	if (err) return fn(err);
      	self.update(fn);
      });
		}); 
  }
};

User.prototype.update = function(fn){
  db.set('user:id:' + this.name, this.id);
  db.hmset('user:' + this.id, this, fn);
};

User.prototype.hashPassword = function(fn){
  var self = this;
  bcrypt.genSalt(12, function(err, salt){
    if (err) return fn(err);
    self.salt = salt;
    bcrypt.hash(self.pass, salt, function(err, hash){
      if (err) return fn(err);
      self.pass = hash;
      fn();
		}) 
  });
};

var tobi = new User({
  name: 'Tobi',
  pass: 'imaferret',
  age: '2'
});

tobi.save(function(err){
  if (err) throw err;
  console.log('user id %d', tobi.id);
});


