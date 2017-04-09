var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var LinkedInStrategy = require('passport-linkedin').Strategy;

var User = require('../models/user');
var configAuth = require('./auth');

module.exports = function(passport) {


  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });


  passport.use('local-signup', new LocalStrategy({
    usernameField: 'signup_email',
    passwordField: 'signup_password',
    passReqToCallback: true
  },
  function(req, signup_email, signup_password, done){
    process.nextTick(function(){
      var confirm_password = req.body.signup_confirm_password;
      req.check('signup_email', 'Invalid Email').isEmail();
      req.check('signup_password', 'Passwords do not match').equals(confirm_password);

      var errors = req.validationErrors();
      if(errors) {
        var messages = errors[0].msg;
        return done(null, false, req.flash('error', messages));
      }
      User.findOne({'local.username': signup_email}, function(err, user){
        if(err){
          return done(err);
        }
        if(user){
          return done(null, false, req.flash('error', 'That email already taken'));
        } else {
          var newUser = new User();
          newUser.local.username = signup_email;
          newUser.local.password = newUser.generateHash(signup_password);

          newUser.save(function(err){
            if(err){
              return done(err);
            }
            return done(null, newUser);
          })
        }
      })

    });
  }));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'login_email',
      passwordField: 'login_password',
      passReqToCallback: true
    },
    function(req, login_email, login_password, done){
      process.nextTick(function(){
        req.check('login_email', 'Invalid Email / Password').isEmail();

        var errors = req.validationErrors();
        if(errors) {
          var messages = errors[0].msg;
          return done(null, false, req.flash('error', messages));
        }
        User.findOne({ 'local.username': login_email}, function(err, user){
          if(err)
            return done(err);
          if(!user || !user.validPassword(login_password))
            return done(null, false, req.flash('error', 'Invalid Email / Password'));
          return done(null, user);

        });
      });
    }
  ));


  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: configAuth.facebookAuth.profileFields,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
          // user is not logged in yet
          if(!req.user) {
            User.findOne({'facebook.id': profile.id}, function(err, user){
              if(err)
                return done(err);
              if(user){
                if(!user.facebook.token){
                  user.facebook.token = accessToken;
                  user.facebook.name = profile.displayName;
                  user.facebook.email = profile.emails[0].value;
                  user.save(function(err){
                  if(err)
                    throw err;
                  })
                }
                return done(null, user);
              }
              else {
                var newUser = new User();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.name = profile.displayName;
                newUser.facebook.email = profile.emails[0].value;
                newUser.save(function(err){
                  if(err)
                    throw err;
                  return done(null, newUser);
                })
              }
            });
          }

          // user is logged in, and needs to be merged
          else {
            var user = req.user;
            user.facebook.id = profile.id;
            user.facebook.token = accessToken;
            user.facebook.name = profile.displayName;
            user.facebook.email = profile.emails[0].value;

            user.save(function(err) {
              if(err)
                  throw err;
              return done(null, user);
            })
          }
        });
      console.log(profile);
      }
  ));

  passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
          // user is not logged in yet
          if(!req.user) {
            User.findOne({'google.id': profile.id}, function(err, user){
              if(err)
                return done(err);
              if(user){
                if(!user.google.token) {
                  user.google.token = accessToken;
                  user.google.name = profile.displayName;
                  user.google.email = profile.emails[0].value;
                  user.save(function(err){
                    if(err)
                      throw err;
                  })
                  return done(null, user);
                }
              } else {
                var newUser = new User();
                newUser.google.id = profile.id;
                newUser.google.token = accessToken;
                newUser.google.name = profile.displayName;
                newUser.google.email = profile.emails[0].value;
                newUser.save(function(err){
                  if(err)
                    throw err;
                  return done(null, newUser);
                })
              }
            });
          }

          // user is logged in, and needs to be merged
          else {
            var user = req.user;
            user.google.id = profile.id;
            user.google.token = accessToken;
            user.google.name = profile.displayName;
            user.google.email = profile.emails[0].value;

            user.save(function(err) {
              if(err)
                  throw err;
              return done(null, user);
            })
          }
        });
      console.log(profile);
      }
  ));

  passport.use(new LinkedInStrategy({
      consumerKey: configAuth.linkedinAuth.consumerKey,
      consumerSecret: configAuth.linkedinAuth.consumerSecret,
      callbackURL: configAuth.linkedinAuth.callbackURL,
      profileFields: configAuth.linkedinAuth.profileFields,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
          // user is not logged in yet
          if(!req.user) {
            User.findOne({'linkedin.id': profile.id}, function(err, user){
              if(err)
                return done(err);
              if(user){
                if(!user.linkedin.token) {
                  user.linkedin.token = accessToken;
                  user.linkedin.name = profile.displayName;
                  user.linkedin.email = profile.emails[0].value;
                  user.save(function(err){
                    if(err)
                      throw err;
                  })
                }
                return done(null, user);
              }
              else {
                var newUser = new User();
                newUser.linkedin.id = profile.id;
                newUser.linkedin.token = accessToken;
                newUser.linkedin.name = profile.displayName;
                newUser.linkedin.email = profile.emails[0].value;
                newUser.save(function(err){
                  if(err)
                    throw err;
                  return done(null, newUser);
                })
              }
            });
          }

          // user is logged in, and needs to be merged
          else {
            var user = req.user;
            user.linkedin.id = profile.id;
            user.linkedin.token = accessToken;
            user.linkedin.name = profile.displayName;
            user.linkedin.email = profile.emails[0].value;

            user.save(function(err) {
              if(err)
                  throw err;
              return done(null, user);
            })
          }
        });
      console.log(profile);
      }
  ));

  passport.use(new BearerStrategy({},
    function(token, done){
      User.findOne({ _id: token }, function(err, user) {
        if(!user)
          return done(null, false);
        return done(null, user);
      })
    }))


};