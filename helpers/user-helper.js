///
/// @brief Helper functions for User information access.
/// @author Jeff Jia
///

///
/// check session cookie, and return user obj or empty obj.
///
exports.getCurrentUser = function (req) {
  var email = req.session.email;
  if (email) {
    return {
      email: email
    };
  }
  else {
    return {
    };
  }
};

/// check whether the user has the authority to create a new contest.
exports.canCreateContest = function (email) {
  // return true for debugging.
  return true;
};
