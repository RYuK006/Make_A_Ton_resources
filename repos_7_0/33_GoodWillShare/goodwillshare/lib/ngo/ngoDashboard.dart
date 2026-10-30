import 'package:flutter/material.dart';
import 'package:goodwillshare/chat_app/pages/home_page.dart';
import 'package:goodwillshare/auth/login.dart';
import 'package:goodwillshare/ngo/ngoAcceptPage.dart';
import 'package:goodwillshare/ngo/ngoPage.dart';
import 'package:firebase_auth/firebase_auth.dart';

class NGO_Dashboard extends StatefulWidget {
  @override
  _NGO_DashboardState createState() => _NGO_DashboardState();
}

class _NGO_DashboardState extends State<NGO_Dashboard> {
  int _selectedIndex = 0;

  Future<void> _logout() async {
    try {
      await FirebaseAuth.instance.signOut();
      // Navigate to login page after logout
       Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => LoginPage()),
                    (route) => false,
                  ); // Replace with your login route
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error logging out: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> widgetOptions = <Widget>[
      NGO_Page(),
      NGO_Accept_Page(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(_selectedIndex == 0 ? 'NGO Dashboard' : 'Accepted Items'),
        backgroundColor: Color.fromARGB(255, 195, 202, 243),
        actions: [
          IconButton(
            icon: Icon(Icons.chat),
            onPressed: () {
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => ChatHomePage()));
              // TODO: Implement chat functionality
              print('Open chat');
            },
          ),
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () {
              // Show confirmation dialog before logging out
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    title: Text('Logout'),
                    content: Text('Are you sure you want to logout?'),
                    actions: [
                      TextButton(
                        child: Text('Cancel'),
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                      ),
                      TextButton(
                        child: Text('Logout'),
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
          SizedBox(width: 8), // Add some padding after the logout button
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: widgetOptions,
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
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.check_circle),
            label: 'Accepted',
          ),
        ],
      ),
    );
  }

  Widget _buildAcceptedItems() {
    return Center(
      child: Text('Accepted Items will be shown here'),
    );
  }
}