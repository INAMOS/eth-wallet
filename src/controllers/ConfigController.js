const mysql = require("mysql");
// const config = require(".././config/Database/database");
const pool=require(".././config/Database/db")
const path = require("path");
const migrate = require("../config/Module/module");

module.exports = {
  getConfig: function(req, res, next) {
    res.render("Module/module", {
      err: req.flash("uploadError"),
      succ: req.flash("uploadSuccess")
    });
  },

  postConfig: function(req, res, next) {
    let files = req.files;

    migrate(files, pool)
      .then(response => {
        req.flash("uploadSuccess", response);
        res.redirect("/config");
      })
      .catch(error => {
        req.flash("uploadError", error);
        res.redirect("/config");
      });

  
  }
};
