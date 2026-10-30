let quiz;
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const cloudinary = require("cloudinary").v2;
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const axios = require("axios");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const User = require("./model/clogin.js");
const CompanyProfile = require("./model/companyProfile.js");
const StudentProfile = require("./model/student.js");


const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const flash = require("connect-flash");
const { isLoggedIn } = require("./middleware.js");
const multer = require("multer");

const dbUrl = process.env.ATLASDB_URL;
// const { storage } = require("./cloudConfig.js");

async function extractImage(url) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (error) {
    console.error("Error extracting image:", error);
    throw error;
  }
}


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", (error) => {
  console.log("Error in MONGO SESSION STORE: ", error);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("public/images/", express.static("./public/images"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.json());

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connection Succeeded");
  })
  .catch((err) => console.log(err));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

let port = 8080;
app.listen(port, () => {
  console.log("listening to the port: https://localhost:" + port);
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});


app.get("/updatedDash", isLoggedIn, async (req, res) => {
  try {
    let user = await User.findOne({ username: req.session.user.username });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    let profile = await StudentProfile.findOne({ owner: user._id });
    if (!profile) {
      // Create a new profile if it doesn't exist
      profile = new StudentProfile({ owner: user._id });
      await profile.save();
    }
    const company = await CompanyProfile.find();
    res.render("updatedDash.ejs", { user, profile, company });
  } catch (error) {
    console.error("Error in /updatedDash route:", error);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/login");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    try {
      let { username } = req.body;
      req.session.user = { username };
      let user = await User.findOne({ username: username });
      if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/login");
      }

      let profile = await StudentProfile.findOne({ owner: user._id });
      if (!profile) {
        // Create a new profile if it doesn't exist
        profile = new StudentProfile({ owner: user._id });
        await profile.save();
      }
      const company = await CompanyProfile.find();
    
      req.flash("success", "Welcome to Placement Management System!");
      if (user.designation == "student") {
        res.render("updatedDash.ejs", { user, profile, company });
      } else {
        res.render("coordinator.ejs");
      }
    } catch (error) {
      console.error("Error in /login route:", error);
      req.flash("error", "An error occurred. Please try again.");
      res.redirect("/login");
    }
  }
);

app.post("/studentdash", async (req, res) => {
  try {
    let { name, course, year, cgpa, backlog, resume } = req.body;
    let user = await User.findOne({ username: req.session.user.username });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    user = await User.findOneAndUpdate(
      { username: req.session.user.username },
      { name: name },
      { new: true }
    );

    let profile = await StudentProfile.findOneAndUpdate(
      { owner: user._id },
      { course, year, cgpa, backlog, resume },
      { new: true, upsert: true } // This will create a new document if it doesn't exist
    );
    const company = await CompanyProfile.find();
    res.render("updatedDash.ejs", { user, profile , company});
  } catch (error) {
    console.error("Error in /studentdash route:", error);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/updatedDash");
  }
});

app.put("/updatedDash", async (req, res) => {
  try {
    let { name, course, year, cgpa, backlog, resume } = req.body;
    let user = await User.findOne({ username: req.session.user.username });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    user = await User.findOneAndUpdate(
      { username: req.session.user.username },
      { name: name },
      { new: true }
    );

    let profile = await StudentProfile.findOneAndUpdate(
      { owner: user._id },
      { course, year, cgpa, backlog, resume },
      { new: true, upsert: true } // This will create a new document if it doesn't exist
    );

    const company = await CompanyProfile.find();

    res.render("updatedDash.ejs", { user, profile, company });
  } catch (error) {
    console.error("Error in /updatedDash PUT route:", error);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/updatedDash");
  }
});



app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    let { username, name, email, phone, designation, department, password } = req.body;
    req.session.user = { username, email, name, designation };
    const newUser = new User({
      username,
      name,
      email,
      phone,
      designation,
      department,
    });

    await User.register(newUser, password);
    const company = await CompanyProfile.find();

    await newUser.save();
    if (designation == "student") {
      res.render("studentdash.ejs", {name,company});
    } else {
      res.render("coordinator.ejs");
    }
  } catch (e) {
    res.redirect("/login");
  }
});

app.get("/coordinator", async (req, res) => { 
  res.render("coordinator.ejs");
});

app.post("/coordinator", async (req, res) => {
  let { name, base, cgpa, role } = req.body;
  let newCompany = new CompanyProfile({ name, base, cgpa, role });
  req.session.cname = name;
  await newCompany.save();
  res.redirect("/coordinator");
});




app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.error("Error logging out:", err);
      return next(err);
    }

    res.redirect("/login");
  });
});




const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function quizGenerator(topic) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Based on the topic of ${topic} in the context of Engineering, create a multiple-choice quiz with 10 questions. Please format the response only in JSON (no extra things) with the following structure:
{
  "title": "MCQ Quiz on ${topic}",
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct answer text here"
    },
    {
      "question": "Next question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct answer text here"
    }
    // Repeat for all 10 questions
  ]
}
Make sure that:
- Strictly Do not include any preamble.
- Each question has 4 answer options.
- Provide the correct answer for each question under "correctAnswer".
`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}

app.get("/practice", (req, res) => {
  res.render("practice.ejs");
});

app.post("/practice", async (req, res) => {
  try {
    const { topic } = req.body;
    const generatedQuiz = await quizGenerator(topic);
    // Log the raw generated quiz

    // Attempt to parse the generated quiz string into an object
    const quiz = JSON.parse(generatedQuiz);
    req.session.quiz = quiz; // Store the generated quiz in the session

    res.render("quiz.ejs", { quiz }); // Render the quiz page with the generated quiz
  } catch (err) {
    console.error("Error generating quiz:", err);
    res.status(500).send("Error generating quiz. Please try again.");
  }
});

app.post("/submit-quiz", (req, res) => {


  const userAnswers = req.body.userAnswers;
  const quiz = req.session.quiz;

  if (!quiz) {
    console.error("Quiz not found in session");
    return res.status(400).json({ error: "Quiz not found in session." });
  }

  let correctCount = 0;
  const results = quiz.questions.map((question, index) => {
    const correctAnswer = question.correctAnswer;
    const userAnswer = userAnswers[`q${index}`];
    const isCorrect = userAnswer === correctAnswer;
    if (isCorrect) correctCount++;
    return {
      question: question.question,
      userAnswer,
      correctAnswer,
      isCorrect,
    };
  });

  res.json({
    correctCount,
    totalQuestions: quiz.questions.length,
    results,
  });
});


app.all("*", (req, res, next) => {
  res.redirect("/login");
});