///
/// @brief Helper functions for User information access.
/// @author Jeff Jia
///

///
/// check session cookie, and return user obj or empty obj.
///
exports.getCurrentUser = function (req) {
  console.log('In function getCurrentUser');
  console.log(req.session);
  var email = req.session.email;
  var id = req.session.userId;
  if (email && id) {
    return {
      email: email
      , id: id
    };
  }
  else {
    return {
    };
  }
};
