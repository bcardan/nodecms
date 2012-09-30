var Photo = require('../lib/photo')
  , path = require('path')
  , fs = require('fs')
  , join = path.join;

exports.list = function(req, res, next){
  Photo.getRange(0, -1, function(err, photos){
  	if (err) return next(err);
  	res.render('photos', {
  		title: 'photos',
  		photos: photos
  	});
  });
};

exports.form = function(req, res){
   res.render('photos/upload', {
     title: 'Photo upload'
   });
};

exports.submit = function(dir) {
	return function(req, res, next){
		var img = req.files.photo.image
		,	name = req.body.photo.name || img.name
		, path = join(dir, img.name);

		fs.rename(img.path, path, function(err){
			if (err) return next(err);

			var photo = new Photo({
				name: name,
				path: img.name,
				user: req.user.id
			});

			photo.save(function(err){
				if (err) return next(err);
				res.redirect('/photos');
			});
		});
	};
};