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
      self.id = id;
      self.hashPassword(function(err){
      	if (err) return fn(err);
      	self.update(fn);
      });
}); }
};

User.prototype.update = function(fn){
  db.set('user:id:' + this.name, this.id);
  db.hmset('user:' + this.id, this, fn);
};
