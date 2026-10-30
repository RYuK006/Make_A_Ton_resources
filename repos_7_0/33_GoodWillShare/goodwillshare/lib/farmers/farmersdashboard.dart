import 'package:flutter/material.dart';
import 'package:goodwillshare/auth/login.dart';
import 'package:goodwillshare/chat_app/pages/home_page.dart';
import 'package:goodwillshare/farmers/farmerpage.dart';
import 'package:goodwillshare/farmers/farmerprofile.dart';
import 'package:goodwillshare/farmers/farmersacceptpage.dart';
import 'package:firebase_auth/firebase_auth.dart';

class OrganicFarmersDashboard extends StatefulWidget {
  @override
  _OrganicFarmersDashboardState createState() =>
      _OrganicFarmersDashboardState();
}

class _OrganicFarmersDashboardState extends State<OrganicFarmersDashboard> {
  int _selectedIndex = 0;

  // Get appropriate title based on selected index
  String _getTitle() {
    switch (_selectedIndex) {
      case 0:
        return 'Organic Farmer';
      case 1:
        return 'Accepted Items';
      case 2:
        return 'Profile';
      default:
        return 'Organic Farmer';
    }
  }

  Future<void> _logout() async {
    try {
      await FirebaseAuth.instance.signOut();
      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => LoginPage()),
          (route) => false,
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error logging out: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> widgetOptions = <Widget>[
      OrganicFarmersPage(),
      OrganicHarvestersAcceptPage(),
      FarmerProfile(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(_getTitle()),
        backgroundColor: const Color.fromARGB(255, 195, 202, 243),
        elevation: 2,
        actions: [
          IconButton(
            icon: const Icon(Icons.chat),
            tooltip: 'Chat',
            onPressed: () {
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => ChatHomePage()));
              // TODO: Implement chat functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Chat feature coming soon!'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    title: const Text('Logout'),
                    content: const Text('Are you sure you want to logout?'),
                    actions: [
                      TextButton(
                        child: const Text(
                          'Cancel',
                          style: TextStyle(color: Colors.grey),
                        ),
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                      ),
                      TextButton(
                        child: const Text(
                          'Logout',
                          style: TextStyle(color: Colors.red),
                        ),
                        onPressed: () {
                          Navigator.of(context).pop();
                          _logout();
                        },
                      ),
                    ],
                  );
                },
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: IndexedStack(
          index: _selectedIndex,
          children: widgetOptions,
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        selectedItemColor: Colors.green,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
            tooltip: 'Home Page',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.check_circle),
            label: 'Accepted',
            tooltip: 'Accepted Items',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
            tooltip: 'User Profile',
          ),
        ],
      ),
    );
  }
}
