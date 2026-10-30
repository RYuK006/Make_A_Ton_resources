import 'package:flutter/material.dart';

const kColor1 = Color(0xFF477B72);
const kColor2 = Color(0xFFF7BA34);
const kColor3 = Color(0xFFEFAA7C);
const kColor4 = Color(0xFFFCF1E2);

const kTextPoppins = TextStyle(fontFamily: "Poppins");
const kText2 = TextStyle(fontSize: 16, fontFamily: "Poppins");
const kText1 = TextStyle(fontFamily: "Poppins", fontSize: 18, color: kColor1, fontWeight: FontWeight.w500);

const kTextFieldDecoration = InputDecoration(
  hintText: '',
  hintStyle: TextStyle(fontFamily: "Poppins"),
  contentPadding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
  border: OutlineInputBorder(
    borderRadius: BorderRadius.all(Radius.circular(32.0)),
  ),
  enabledBorder: OutlineInputBorder(
    borderSide: BorderSide(color: kColor1, width: 1.0),
    borderRadius: BorderRadius.all(Radius.circular(32.0)),
  ),
  focusedBorder: OutlineInputBorder(
    borderSide: BorderSide(color: kColor1, width: 2.0),
    borderRadius: BorderRadius.all(Radius.circular(32.0)),
  ),
);