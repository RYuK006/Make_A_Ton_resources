import 'package:flutter/material.dart';
import 'package:helpora_v1/screens/homepage.dart';
import 'package:helpora_v1/rounded_button.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart';
import 'package:helpora_v1/constants.dart';

class LoginScreen extends StatefulWidget {
  static String id = 'login_screen';
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _auth = FirebaseAuth.instance;
  bool showSpinner = false;
  String? email;
  String? password;

  Future<void> _resetPassword() async {
    if (email == null  || email!.isEmpty) {
      // Show error if the email is not entered
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Please enter your email to reset password.'),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 3),
        ),
      );
      return;
    }

    try {
      await _auth.sendPasswordResetEmail(email: email!);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Password reset email sent!'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 3),
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: kColor4,
        body: ModalProgressHUD(
        inAsyncCall: showSpinner,
        child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
    child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
    Flexible(
    child: Hero(
    tag: 'logo',
    child: Container(
    height: 200.0,
    child: Image.asset('images/logo.png'),
    ),
    ),
    ),
    const SizedBox(height: 48.0),
    Text(
    "Welcome Back!",
    style: TextStyle(
    color: kColor1,
    fontFamily: "Poppins",
    fontSize: 30.0,
    fontWeight: FontWeight.w500,
    ),
    textAlign: TextAlign.center,
    ),
    const SizedBox(height: 30.0),
    TextField(
    keyboardType: TextInputType.emailAddress,
    textAlign: TextAlign.center,
    onChanged: (value) {
    email = value;
    },
    decoration: kTextFieldDecoration.copyWith(
    hintText: "Enter your email",
    ),
    ),
    const SizedBox(height: 8.0),
    TextField(
    obscureText: true,
    textAlign: TextAlign.center,
    onChanged: (value) {
    password = value;
    },
    decoration: kTextFieldDecoration.copyWith(
    hintText: "Enter your password",
    ),
    ),
    const SizedBox(height: 24.0),
    RoundedButton(
    colour: kColor2,
    title: 'Log In',
    onPressed: () async {
    setState(() {
    showSpinner = true; // Show spinner while processing
    });

    try {
    if (email == null || password == null || email!.isEmpty || password!.isEmpty) {
    throw Exception("Email and password cannot be empty");
    }
    final userCredential =
    await _auth.signInWithEmailAndPassword(
      email: email!,
      password: password!,
    );

    if (userCredential.user != null) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => HomePage(
            userId: userCredential.user!.uid,
          ),
        ),
      );
    }
    } catch (e) {
      String errorMessage;
      if (e is FirebaseAuthException) {
        errorMessage = e.message ?? 'An unknown error occurred.';
      } else {
        errorMessage = e.toString();
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errorMessage),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 3),
        ),
      );
    } finally {
      setState(() {
        showSpinner = false; // Hide spinner
      });
    }
    },
    ),
      const SizedBox(height: 16.0), // Add space between buttons
      Center(
        child: TextButton(
          onPressed: _resetPassword,
          child: const Text(
            'Forgot Password?',
            style: TextStyle(
              color: Colors.red,
              fontFamily: "Poppins",
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ),
    ],
    ),
        ),
        ),
    );
  }
}