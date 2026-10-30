import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class NGO_Page extends StatefulWidget {
  const NGO_Page({super.key});

  @override
  State<NGO_Page> createState() => _NGO_PageState();
}

class _NGO_PageState extends State<NGO_Page> {
  int _selectedIndex = 0; // This will handle selected tab, if needed

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance.collection('donations').snapshots(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
            return Center(child: Text('No data available'));
          }

          List<DocumentSnapshot> donationList = snapshot.data!.docs;

          return ListView.builder(
            itemCount: donationList.length,
            itemBuilder: (context, index) {
              // Get each individual document
              DocumentSnapshot document = donationList[index];

              // Get data from the document
              Map<String, dynamic> data =
                  document.data() as Map<String, dynamic>;

              // Now pass this data to a custom widget
              return _buildDonationCard(data, document.id);
            },
          );
        },
      ),
    );
  }
Widget _buildDonationCard(Map<String, dynamic> donation, String donationId) {
  String donerMail = donation['userEmail'];
  return Card(
    elevation: 2,
    margin: EdgeInsets.all(8),
    child: IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    donation['foodName'] ?? 'Unknown Food',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text('Quantity: ${donation['foodQuantity'] ?? 'N/A'}'),
                  Text('Expiry: ${donation['foodExpiry'] ?? 'N/A'}'),
                  Text('Address: ${donation['address'] ?? 'N/A'}'),
                  Text('Contact: ${donation['contact'] ?? 'N/A'}'),
                ],
              ),
            ),
          ),
          if (donation['status'] == "pending")
            Container(
              width: 80,
              child: Center(
                child: ElevatedButton(
                  onPressed: () async {
                    User? currentUser = FirebaseAuth.instance.currentUser;
                    String userEmail = currentUser?.email ?? 'anonymous';
                    //to add to ngo accepted list
                    await FirebaseFirestore.instance
                        .collection('ngo_accept')
                        .doc(userEmail)
                        .collection('acccepted')
                        .add(donation);
                    await FirebaseFirestore.instance
                        .collection('donations')
                        .doc(donationId)
                        .update({'status': 'accepted'});
                    //to add to doner accept list
                    await FirebaseFirestore.instance
                        .collection('doner_accept')
                        .doc(donerMail)
                        .collection('accepted')
                        .add(donation);
                    print('Accept: ${donation['foodName']}');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.amberAccent,
                    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 0),
                    minimumSize: Size(0, 40),
                  ),
                  child: Text('Accept', style: TextStyle(fontSize: 10)),
                ),
              ),
            ),
        ],
      ),
    ),
  );
}
  
  
}
