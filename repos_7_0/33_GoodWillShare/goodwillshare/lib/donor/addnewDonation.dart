import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:intl/intl.dart'; // Add this import for date formatting

class addnewDonation extends StatefulWidget {
  @override
  _addnewDonationState createState() => _addnewDonationState();
}

class _addnewDonationState extends State<addnewDonation> {
  final _formKey = GlobalKey<FormState>();

  // Controllers for form fields
  final TextEditingController _foodNameController = TextEditingController();
  final TextEditingController _foodQuantityController = TextEditingController();
  final TextEditingController _foodExpiryController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _contactController = TextEditingController();

  // Function to post donation to Firebase
  Future<void> _postDonation() async {
    if (_formKey.currentState!.validate()) {
      // Parse food quantity to integer
      int foodQuantity = int.parse(_foodQuantityController.text);

      // Get the current user
      User? currentUser = FirebaseAuth.instance.currentUser;
      String userEmail = currentUser?.email ??
          'anonymous'; // Default to 'anonymous' if no user is logged in

      String unique = DateTime.now().toIso8601String();
      await FirebaseFirestore.instance
          .collection('donations')
          .doc('$userEmail$unique')
          .set({
        'foodName': _foodNameController.text,
        'foodQuantity': foodQuantity, // Store as an integer
        'foodExpiry': _foodExpiryController.text,
        'address': _addressController.text,
        'contact': _contactController.text,
        'userEmail': userEmail, // Add the user's email
        'status': 'pending', // Default status when a new donation is created
      });

      // Show a success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Donation Posted Successfully!')),
      );

      // Clear the form
      _foodNameController.clear();
      _foodQuantityController.clear();
      _foodExpiryController.clear();
      _addressController.clear();
      _contactController.clear();
    }
  }

  // Function to show date picker
  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime(2101),
    );
    if (picked != null) {
      setState(() {
        _foodExpiryController.text = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextFormField(
                  controller: _foodNameController,
                  decoration: const InputDecoration(
                    labelText: 'Food Name',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the food name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: _foodQuantityController,
                  decoration: const InputDecoration(
                    labelText: 'Food Quantity (Enter as a number)',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the food quantity';
                    }
                    // Check if the input is a valid integer
                    if (int.tryParse(value) == null) {
                      return 'Please enter a valid number';
                    }
                    return null;
                  },
                  keyboardType: TextInputType.number, // Show number keyboard
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: _foodExpiryController,
                  decoration: InputDecoration(
                    labelText: 'Food Expiry Date',
                    border: OutlineInputBorder(),
                    suffixIcon: IconButton(
                      icon: Icon(Icons.calendar_today),
                      onPressed: () => _selectDate(context),
                    ),
                  ),
                  readOnly: true, // Make the text field read-only
                  onTap: () => _selectDate(context), // Show date picker on tap
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please select the expiry date';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: _addressController,
                  decoration: const InputDecoration(
                    labelText: 'Address',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the address';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: _contactController,
                  decoration: const InputDecoration(
                    labelText: 'Contact',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the contact details';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _postDonation,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.teal,
                    minimumSize: const Size(double.infinity, 50),
                  ),
                  child: const Text('Post Donation'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}