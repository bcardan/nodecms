
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./lib/middleware/user')
  , login = require('./routes/login')
  , register = require('./routes/register')
  , photos = require('./routes/photos')
  , helpers = require('./helpers')
  , http = require('http')
  , path = require('path')
  , md = require('github-flavored-markdown').parse
  , fs = require('fs');

var app = express();

var i18n = {
    prev: 'Prev'
  , next: 'Next'
  , save: 'Save'
};
app.locals(i18n);
app.locals(helpers);

app.engine('md', function(path, options, fn){
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    try {
      var html = md(str);
      html = html.replace(/\{([^}]+)\}/g, function(_, name){
        return options[name] || '';
      });
      fn(null, html);
    } catch (err) {
  fn(err); }
}); });

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('barnacle'));
  app.use(express.cookieSession());
  app.use(user);
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/photos', photos.list);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
app.get('/register', register.form);
app.post('/register', register.submit);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

