var express = require("express");
var authRouter = require("./auth");
var postRouter = require("./post");

var app = express();

app.use("/auth/", authRouter);
app.use("/posts/", postRouter);

module.exports = app;