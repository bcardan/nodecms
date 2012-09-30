var photos = [];

photos.push({
	name: 'one',
	path: '1.png'
});

photos.push({
	name: 'two',
	path: '2.png'
});

photos.push({
	name: 'three',
	path: '3.png'
});

exports.list = function(req, res){
  res.render('photos', {
    title: 'Photos',
    photos: photos
  });
};