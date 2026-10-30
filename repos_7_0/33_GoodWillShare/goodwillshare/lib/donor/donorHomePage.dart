import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DonorHomePage extends StatefulWidget {
  const DonorHomePage({Key? key}) : super(key: key);

  @override
  State<DonorHomePage> createState() => _DonorHomePageState();
}

class _DonorHomePageState extends State<DonorHomePage> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    User? currentUser = FirebaseAuth.instance.currentUser;
    String userEmail = currentUser?.email ?? 'anonymous';

    return Scaffold(
      body: Column(
        children: [
          Container(
            color: Colors.teal,
            child: TabBar(
              controller: _tabController,
              tabs: const [
                Tab(text: 'Accepted Food'),
                Tab(text: 'Expired Food'),
              ],
              labelColor: Colors.white,
              unselectedLabelColor: Colors.white70,
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildAcceptedFoodTab(userEmail),
                _buildExpiredFoodWidget(context),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAcceptedFoodTab(String userEmail) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance
          .collection('doner_accept')
          .doc(userEmail)
          .collection('accepted')
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }

        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        }

        if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
          return Center(child: Text('No accepted food data available'));
        }

        List<DocumentSnapshot> donationList = snapshot.data!.docs;

        return ListView.builder(
          itemCount: donationList.length,
          itemBuilder: (context, index) {
            DocumentSnapshot document = donationList[index];
            Map<String, dynamic> data = document.data() as Map<String, dynamic>;

            return _buildDonationCard(data, document.id); // Call custom widget to display data
          },
        );
      },
    );
  }

 Widget _buildExpiredFoodWidget(BuildContext context) {
  User? currentUser = FirebaseAuth.instance.currentUser;
  String userEmail = currentUser?.email ?? 'anonymous';

  return StreamBuilder<QuerySnapshot>(
    stream: FirebaseFirestore.instance.collection('donations').snapshots(),
    builder: (context, snapshot) {
      if (snapshot.hasError) {
        return Text('Error: ${snapshot.error}');
      }

      if (snapshot.connectionState == ConnectionState.waiting) {
        return CircularProgressIndicator();
      }

      List<DocumentSnapshot> expiredDonations = snapshot.data!.docs.where((doc) {
        Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
        DateTime? expiryDate = data['foodExpiry'] != null
            ? DateFormat('yyyy-MM-dd').parse(data['foodExpiry'])
            : null;
        DateTime currentDate = DateTime.now();
        DateTime currentDateWithoutTime = DateTime(currentDate.year, currentDate.month, currentDate.day);
        return expiryDate != null && expiryDate.isBefore(currentDateWithoutTime);
      }).toList();

      return ListView.builder(
        itemCount: expiredDonations.length,
        itemBuilder: (context, index) {
          Map<String, dynamic> donation = expiredDonations[index].data() as Map<String, dynamic>;
          String donationId = expiredDonations[index].id;

          return Card(
            elevation: 2,
            margin: const EdgeInsets.all(8),
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
                    ),
                    ),
                   
                    subtitle: Text(
                      'Quantity: ${donation['foodQuantity'] ?? 'N/A'}\n'
                      'Expiry: ${donation['foodExpiry'] ?? 'N/A'}\n'
                      'Address: ${donation['address'] ?? 'N/A'}\n'
                      'Contact: ${donation['contact'] ?? 'N/A'}',
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      'EXPIRED',
                      style: TextStyle(
                        color: Colors.red,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () async {
                      if (currentUser != null) {
                        await FirebaseFirestore.instance
                            .collection('expired_food')
                            .add(
                          donation
                        );
                        
                        // Delete the expired donation from the 'donations' collection
                        await FirebaseFirestore.instance
                            .collection('donations')
                            .doc(donationId)
                            .delete();

                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                          content: Text('${donation['foodName']} added to organic harvesters'),
                        ));
                      }
                    },
                    child: const Text('Add to Organic Harvesters'),
                  ),
                ],
              ),
            ),
          );
        },
      );
    },
  );
}

  Widget _buildDonationCard(Map<String, dynamic> donation, String donationId) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.all(8),
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
                    ),
              ),
              subtitle: Text(
                'Quantity: ${donation['foodQuantity'] ?? 'N/A'}\n'
                'Expiry: ${donation['foodExpiry'] ?? 'N/A'}\n'
                'Address: ${donation['address'] ?? 'N/A'}\n'
                'Contact: ${donation['contact'] ?? 'N/A'}',
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ChatScreen extends StatelessWidget {
  const ChatScreen({Key? key}) : super(key: key); // Added const constructor

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: const Center(
        child: Text('Chat Messages'),
      ),
    );
  }
}
