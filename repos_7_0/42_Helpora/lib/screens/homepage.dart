import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:helpora_v1/screens/postchore.dart';
import 'package:helpora_v1/screens/profile.dart';

import 'package:helpora_v1/constants.dart';

import 'choreDetails.dart';
import 'mychores.dart';

class HomePage extends StatefulWidget {
  static String id = 'home_screen';
  final String userId; // Add userId as a final variable

  // Update the constructor to accept userId
  HomePage({required this.userId}); // Use named parameter

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0; // Index for BottomNavigationBar
  int _humanityPoints = 0; // Variable to store humanity points

  // List of pages for navigation
  final List<Widget> _pages = [
    JobsPage(),
    PostChorePage(),
    MyChoresPage(),
    Profile(),
  ];

  @override
  void initState() {
    super.initState();
    _fetchHumanityPoints(); // Fetch humanity points when the page initializes
  }

  // Function to fetch humanity points from Firestore
  Future<void> _fetchHumanityPoints() async {
    try {
      DocumentSnapshot userDoc = await FirebaseFirestore.instance
          .collection('users')
          .doc(widget.userId)
          .get();

      if (userDoc.exists) {
        setState(() {
          _humanityPoints = userDoc['humanityPoints'] ?? 0; // Fetch points from the document
        });
      }
    } catch (e) {
      print("Error fetching humanity points: $e");
    }
  }

  // This function handles BottomNavigationBar item tap
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kColor4, // Background using the provided color scheme
      appBar: AppBar(
        title: Text(
          'Helpora',
          style: TextStyle(color: kColor4, fontWeight: FontWeight.w800, fontFamily: "Poppins"),
        ),



        backgroundColor: kColor1,
        automaticallyImplyLeading: false,
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                // Humanity Points Icon with Points Value
                Icon(Icons.star, color: kColor2), // Icon for humanity points
                SizedBox(width: 5),
                Text(
                  '$_humanityPoints', // Display humanity points
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Image.asset('images/logowhite.png', height: 40), // Logo on the top right
          ),
        ],
      ),
      body: _pages[_selectedIndex], // Display the selected page here
      bottomNavigationBar: Container(
        margin: EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        decoration: BoxDecoration(
          color: kColor1, // Bottom navigation using primary color (kColor1)
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: Colors.black38,
              offset: Offset(0, 5),
              blurRadius: 15,
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(30),
          child: BottomNavigationBar(
            backgroundColor: Colors.transparent, // Transparent background for custom design
            type: BottomNavigationBarType.fixed,
            items: <BottomNavigationBarItem>[
              BottomNavigationBarItem(
                icon: Icon(Icons.work, color: _selectedIndex == 0 ? kColor2 : kColor3),
                label: 'Jobs',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.add, color: _selectedIndex == 1 ? kColor2 : kColor3),
                label: 'Add',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.assignment, color: _selectedIndex == 2 ? kColor2 : kColor3),
                label: 'My Chores',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person, color: _selectedIndex == 3 ? kColor2 : kColor3),
                label: 'Profile',
              ),
            ],
            currentIndex: _selectedIndex,
            selectedItemColor: kColor2,
            unselectedItemColor: kColor3,
            showSelectedLabels: false,
            showUnselectedLabels: false,
            onTap: _onItemTapped,
            selectedFontSize: 14,
            unselectedFontSize: 14,
          ),
        ),
      ),
    );
  }
}

// Jobs Page (dummy content for now)
class JobsPage extends StatefulWidget {
  @override
  _JobsPageState createState() => _JobsPageState();
}

class _JobsPageState extends State<JobsPage> {
  TextEditingController _searchController = TextEditingController();
  String _searchText = "";

  @override
  void initState() {
    super.initState();

    _searchController.addListener(() {
      setState(() {
        _searchText = _searchController.text.toLowerCase();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Search chores by name or location',
              prefixIcon: Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(30.0),
              ),
            ),
          ),
        ),
        Expanded(
          child: StreamBuilder<QuerySnapshot>(
            stream: FirebaseFirestore.instance.collection('chores').snapshots(),
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                return Center(child: Text('Error loading data.'));
              }

              if (snapshot.connectionState == ConnectionState.waiting) {
                return Center(child: CircularProgressIndicator());
              }

              if (snapshot.hasData) {
                final chores = snapshot.data!.docs;

                // Filter chores based on search query
                final filteredChores = chores.where((chore) {
                  final choreName = chore['choreName']?.toString().toLowerCase() ?? '';
                  final location = chore['location']?.toString().toLowerCase() ?? '';
                  return choreName.contains(_searchText) || location.contains(_searchText);
                }).toList();

                if (filteredChores.isEmpty) {
                  return Center(child: Text('No chores available.'));
                }

                return GridView.builder(
                  padding: EdgeInsets.all(16.0),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2, // Two cards per row
                    childAspectRatio: 0.65, // Adjust the ratio to control height better
                    crossAxisSpacing: 16.0,
                    mainAxisSpacing: 16.0,
                  ),
                  itemCount: filteredChores.length,
                  itemBuilder: (context, index) {
                    var chore = filteredChores[index];
                    String choreName = chore['choreName'] ?? 'Unnamed Chore';
                    String contact = chore['contact'] ?? 'No Contact Info';
                    String location = chore['location'] ?? 'No Location';
                    String reward = chore['reward'] ?? 'No Reward';
                    String? imageUrl = chore['imageUrl']; // May be null
                    String choreId = chore['choreId'];
                    bool isUrgent = chore['isUrgent'] ?? false; // Default to false if not available

                    return Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20), // Rounded corners
                      ),
                      elevation: 5,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Image or icon placeholder
                          ClipRRect(
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(20),
                              topRight: Radius.circular(20),
                            ),
                            child: imageUrl != null
                                ? Image.network(
                              imageUrl,
                              height: 100,
                              width: double.infinity,
                              fit: BoxFit.cover,
                            )
                                : Container(
                              height: 100,
                              width: double.infinity,
                              color: kColor3,
                              child: Icon(Icons.work, size: 50, color: Colors.white),
                            ),
                          ),
                          Expanded(
                            child: SingleChildScrollView(
                              padding: const EdgeInsets.all(8.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Chore name with optional urgent icon
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          choreName,
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                            color: kColor1,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      if (isUrgent) // Show urgent icon if isUrgent is true
                                        Icon(
                                          Icons.warning_amber_rounded,
                                          color: Colors.redAccent,
                                          size: 18,
                                        ),
                                    ],
                                  ),
                                  SizedBox(height: 5),
                                  // Contact
                                  Row(
                                    children: [
                                      Icon(Icons.phone, color: kColor2, size: 16),
                                      SizedBox(width: 5),
                                      Expanded(
                                        child: Text(
                                          contact,
                                          style: TextStyle(fontSize: 12, color: Colors.black54),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                  SizedBox(height: 5),
                                  // Location
                                  Row(
                                    children: [
                                      Icon(Icons.location_on, color: kColor3, size: 16),
                                      SizedBox(width: 5),
                                      Expanded(
                                        child: Text(
                                          location,
                                          style: TextStyle(fontSize: 12, color: Colors.black54),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                  SizedBox(height: 5),
                                  // Reward
                                  Row(
                                    children: [
                                      Icon(Icons.monetization_on, color: kColor2, size: 16),
                                      SizedBox(width: 5),
                                      Expanded(
                                        child: Text(
                                          reward,
                                          style: TextStyle(fontSize: 12, color: Colors.black54),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => ChoreDetailsPage(choreId: choreId),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: kColor1,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.only(
                                    bottomLeft: Radius.circular(20),
                                    bottomRight: Radius.circular(20),
                                  ),
                                ),
                                padding: EdgeInsets.symmetric(vertical: 12), // Adjust vertical padding for the button
                              ),
                              child: Text(
                                'View',
                                style: TextStyle(color: kColor4),
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                );
              }

              return Center(child: Text('No data available.'));
            },
          ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}





