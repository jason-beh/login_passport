module.exports = function(router, passport) {

  // localhost:3000/auth
  router.get('/', function(req, res){
    var messages = req.flash('error');
    res.render('index.ejs', { messages: messages, hasErrors: messages.length > 0 });//message: req.flash('message') });
  });

  router.get('/blog', function(req, res, next) {
    var db = req.configDB;
    var posts = db.get('posts');
    posts.find({},{},function(err, posts) {
      res.render('blog.ejs', {
        "posts": posts
      })
    })
  });

  router.use(function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  });

  router.get('/profile', function(req,res) {
    res.render('profile.ejs', { user: req.user, success: req.session.success});
  });

  router.get('/*', function(req, res) {
    res.redirect('/profile');
  })
}