module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("success", "You must be Logged In");
        res.redirect("/login");
      }
      next();
};