module.exports = function(router, passport){

  //localhost:3000/auth/signup
  router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
      })
  );

  // localhost:3000/auth/login
  router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
      }));


  router.get('/facebook', passport.authenticate('facebook',  { authType: 'rerequest', scope: ['email'] }));

  router.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/profile',
                                        failureRedirect: '/' }));

  router.get('/google', passport.authenticate('google',  { authType: 'rerequest', scope: ['profile', 'email'] }));

  router.get('/google/callback',
    passport.authenticate('google', { successRedirect: '/profile',
                                        failureRedirect: '/' }));

  router.get('/linkedin', passport.authenticate('linkedin',  { authType: 'rerequest', scope: ['r_basicprofile', 'r_emailaddress'] }));

  router.get('/linkedin/callback',
    passport.authenticate('linkedin', { successRedirect: '/profile',
                                        failureRedirect: '/' }));

  /*router.get('/connect/facebook', passport.authorize('facebook', { authType: 'rerequest', scope: ['email'] }));

  router.get('/connect/google', passport.authorize('google',  { authType: 'rerequest', scope: ['profile', 'email'] }));

  router.get('/connect/linkedin', passport.authenticate('linkedin',  { authType: 'rerequest', scope: ['r_basicprofile', 'r_emailaddress'] }));

  router.post('/connect/local/signup', function(req, res) {
    // Variables to store input data
    var email = req.body.signup_email;
    var password = req.body.signup_password;
    var confirm_password = req.body.signup_confirm_password;

    // Validation
    req.check('email', 'Please fill up all fields').notEmpty();
    req.check('password', 'Please fill up all fields').notEmpty();
    req.check('confirm_password', 'Please fill up all fields').notEmpty();
    req.check('email', 'Invalid email').isEmail();
    req.check('confirm_password', 'Passwords do not match').equals(password);

    var errors = req.validationErrors();
    if(errors) {
      req.session.errors = errors;
      req.session.success = false;
      res.redirect("/profile");
    } else {
      passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/profile',
        failureFlash: true
      })(req, res);
      req.session.success = true;
    };
  });

  router.post('/connect/local/login', function(req,res) {

    // Variables to store input data
    var email = req.body.login_email;
    var password = req.body.login_password;

    req.check('email', 'Please fill up all fields').notEmpty();
    req.check('password', 'Please fill up all fields').notEmpty();

    var errors = req.validationErrors();
    if(errors) {
      req.session.errors = errors;
      req.session.success = false;
      res.redirect("/profile");
    } else {
      passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/profile',
        failureFlash: true
      })(req, res);
      req.session.success = true;
    };
  });

  router.get('/unlink/local', function(req, res) {
    var user = req.user;

    user.local.username = null;
    user.local.password = null;

    user.save(function(err) {
      if(err)
        throw err;
      res.redirect('/profile');
    })
  });

  router.get('/unlink/facebook', function(req, res) {
    var user = req.user;

    user.facebook.token = null;

    user.save(function(err) {
      if(err)
          throw err;
      res.redirect('/profile');
    })
  });

  router.get('/unlink/google', function(req, res) {
    var user = req.user;

    user.google.token = null;

    user.save(function(err) {
      if(err)
          throw err;
      res.redirect('/profile');
    })
  });

  router.get('/unlink/linkedin', function(req, res) {
    var user = req.user;

    user.linkedin.token = null;

    user.save(function(err) {
      if(err)
          throw err;
      res.redirect('/profile');
    })
  });*/


  router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
  });
};