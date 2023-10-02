var express = require("express");
const app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var apiResponse = require("./helpers/apiResponse");
var cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//To allow cross-origin requests
app.use(cors());


var port = process.env.SERVER_PORT || "3001";
app.listen(port, () => {
	console.log(`Node server is running at ${port}`);
});

// EJS
app.set("view engine", "ejs");
app.set("views", "./views");


// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	if (process.env.NODE_ENV !== "test") {
		console.log("Connected to MongoDB");
		console.log("App is running ... \n");
		console.log("Press CTRL + C to stop the process. \n");
	}
})
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});
mongoose.connection;

//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}


// Routes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

app.all("*", function (req, res) {
	return res.send({
		status: 0,
		message: "Page not found"
	});
});

app.use((err, req, res) => {
	if (err.name == "UnauthorizedError") {
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});

module.exports = app;
