import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class OrganicFarmersPage extends StatefulWidget {
  const OrganicFarmersPage({super.key});

  @override
  State<OrganicFarmersPage> createState() => _OrganicFarmersPageState();
}

class _OrganicFarmersPageState extends State<OrganicFarmersPage> {
  int _selectedIndex = 0; // Handle selected tab or status, if needed

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance.collection('expired_food').snapshots(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
            return const Center(child: Text('No data available'));
          }

          List<DocumentSnapshot> donationList = snapshot.data!.docs;

          return ListView.builder(
            itemCount: donationList.length,
            itemBuilder: (context, index) {
              // Get each document
              DocumentSnapshot document = donationList[index];

              // Extract data from the document
              Map<String, dynamic> data =
                  document.data() as Map<String, dynamic>;

              // Pass the data to a custom widget to display it
              return _buildDonationCard(data, document.id);
            },
          );
        },
      ),
    );
  }

  Widget _buildDonationCard(Map<String, dynamic> donation, String donationId) {
    String donorEmail = donation['userEmail'];
    return Card(
      elevation: 2,
      margin: const EdgeInsets.all(8),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ListTile(
              title: Text(donation['foodName'] ?? 'Unknown Food'),
              subtitle: Text(
                'Quantity: ${donation['foodQuantity'] ?? 'N/A'}\n'
                'Expiry: ${donation['foodExpiry'] ?? 'N/A'}\n'
                'Address: ${donation['address'] ?? 'N/A'}\n'
                'Contact: ${donation['contact'] ?? 'N/A'}',
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (_selectedIndex == 0) // Only show 'Accept' button if needed
                  ElevatedButton(
                    onPressed: () async {
                      User? currentUser = FirebaseAuth.instance.currentUser;
                      String farmerEmail = currentUser?.email ?? 'anonymous';

                      // Add to organic farmers' accepted list
                      await FirebaseFirestore.instance
                          .collection('farmers_accept')
                          .doc(farmerEmail)
                          .collection('accepted')
                          .add(donation);

                      // Add to donor's accepted list
                      await FirebaseFirestore.instance
                          .collection('doner_expired')
                          .doc(donorEmail)
                          .collection('accepted')
                          .add(donation);

                      // Confirmation message
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                        content: Text('${donation['foodName']} expired'),
                      ));

                      print('Accept: ${donation['foodName']}');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.greenAccent,
                    ),
                    child: const Text('Accept'),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
