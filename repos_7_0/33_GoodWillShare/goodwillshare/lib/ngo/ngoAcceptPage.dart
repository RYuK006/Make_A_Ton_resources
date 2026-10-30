import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class NGO_Accept_Page extends StatefulWidget {
  const NGO_Accept_Page({super.key});

  @override
  State<NGO_Accept_Page> createState() => _NGO_Accept_PageState();
}

class _NGO_Accept_PageState extends State<NGO_Accept_Page> {
  @override
  Widget build(BuildContext context) {
   User? currentUser = FirebaseAuth.instance.currentUser;
    String userEmail = currentUser?.email ?? 'anonymous';
    return Scaffold(
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance
            .collection('ngo_accept')
            .doc(userEmail)
            .collection('acccepted')
            .snapshots(),
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
    child: Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ListTile(
            title: Text(donation['foodName'] ?? 'Unknown Food',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),),
            
            subtitle: Text(
              'Quantity: ${donation['foodQuantity'] ?? 'N/A'}\n'
              'Expiry: ${donation['foodExpiry'] ?? 'N/A'}\n'
              'Address: ${donation['address'] ?? 'N/A'}\n'
              'Contact: ${donation['contact'] ?? 'N/A'}',
            ),
            // Add the chat icon here
            trailing: IconButton(
              icon: Icon(Icons.chat, color: Colors.grey),
              onPressed: () {
                // Add your chat functionality here
                // For example, navigate to a chat screen:
                // Navigator.push(
                //   context,
                //   MaterialPageRoute(
                //     builder: (context) => ChatScreen(
                //       donerEmail: donerMail,
                //       donationId: donationId,
                //     ),
                //   ),
                // );
              },
            ),
          ),
        ],
      ),
    ),
  );
}
}
