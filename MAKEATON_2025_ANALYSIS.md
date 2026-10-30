# Make-A-Ton 2025: In-Depth Project Analysis & Code Review

> **Official Event**: South India's Flagship Hackathon - Make-A-Ton (Organized by CITTIC CUSAT)
> **Showcase URL**: [https://2025.makeaton.in/projects](https://2025.makeaton.in/projects)
> **Total Projects Documented**: 27

---

## Executive Table of Projects

| # | Project Name | Team Name | Domain / Track | GitHub Repository |
|---|---|---|---|---|
| 1 | [Tinkerbluds - Cultivated Land Validation Platform](#project-1) | `tinkerbluds` | kireap | [Shaan-Shoukath/Tinkerbluds](https://github.com/Shaan-Shoukath/Tinkerbluds) |
| 2 | [AI-Powered Farm Management & Decision Support System](#project-2) | `Stardust Crusaders` | software | [Alston2006/CropIntel](https://github.com/Alston2006/CropIntel) |
| 3 | [Secure.sol](#project-3) | `HackWaters` | software | [Noel9907/secure-sol](https://github.com/Noel9907/secure-sol) |
| 4 | [RiskRank](#project-4) | `Samurai` | kireap | [orgs/make-a-ton-samurai/repositories](https://github.com/orgs/make-a-ton-samurai/repositories) |
| 5 | [Traq](#project-5) | `Parallax` | hardware | [Sangeeth62880/Traq.git](https://github.com/Sangeeth62880/Traq.git) |
| 6 | [Cusatify](#project-6) | `freshers.exe` | software | [uditya22-flux/cusatify](https://github.com/uditya22-flux/cusatify) |
| 7 | [Trust Score Engine](#project-7) | `Codequest` | software | [vishnupvenmany/trustscore](https://github.com/vishnupvenmany/trustscore) |
| 8 | [COG AI](#project-8) | `EQUINOX` | software | [anugrahks19/Cog-AI-main](https://github.com/anugrahks19/Cog-AI-main) |
| 9 | [Mudra](#project-9) | `Yukti` | hardware | [Ranger-NF/Mudra](https://github.com/Ranger-NF/Mudra) |
| 10 | [STVE - Sensor Trust Verification Engine](#project-10) | `Nexus` | kireap | [HashimCodeDev/STVE](https://github.com/HashimCodeDev/STVE) |
| 11 | [HealStack AI](#project-11) | `BitCode` | kireap | [benadictjacob/Adaptive-routing-algorithm](https://github.com/benadictjacob/Adaptive-routing-algorithm) |
| 12 | [An AI Voice Assistant Application Optimised For Local Farmers](#project-12) | `HackOverflow` | kireap | [devangdileep/make-a-ton.git](https://github.com/devangdileep/make-a-ton.git) |
| 13 | [VigilX: Smart Anti-Sleep Safety System for Drivers](#project-13) | `Ton Kanakkinu Byte` | kireap | [Meegitty/VigilX](https://github.com/Meegitty/VigilX) |
| 14 | [OPTIMA – Optimization Protocol for Traffic Intelligence & Management Architecture](#project-14) | `Binary.exe` | software | [Adhwu/Optima](https://github.com/Adhwu/Optima) |
| 15 | [PCO-US](#project-15) | `Optimus Prime` | hardware | [JoanneKoshy/PCOUS](https://github.com/JoanneKoshy/PCOUS) |
| 16 | [KOLPAY](#project-16) | `Kolon` | software | [Bharath-Krishna-AB/ledger](https://github.com/Bharath-Krishna-AB/ledger) |
| 17 | [Wiki Cusat](#project-17) | `Nexus Connect` | software | [philip-thomas-12/Wiki-Cusat/tree/main](https://github.com/philip-thomas-12/Wiki-Cusat/tree/main) |
| 18 | [NEUROMOTION: AI ASSISTIVE REHABILITATION](#project-18) | `KAIZEN` | hardware | [alfi30-bat/kaizen-robotics](https://github.com/alfi30-bat/kaizen-robotics) |
| 19 | [Ravana](#project-19) | `BlueSteel` | software | [github.com/simonknowsstuff/ravana](github.com/simonknowsstuff/ravana) |
| 20 | [DEFENDER](#project-20) | `Sarvam IoT` | hardware | [Meenakshimkumar/DEFENDER-WEBSITE](https://github.com/Meenakshimkumar/DEFENDER-WEBSITE) |
| 21 | [SaveSense](#project-21) | `SaveSense` | software | [roqcodes/SaveSense](https://github.com/roqcodes/SaveSense) |
| 22 | [Ready Classified Coconuts](#project-22) | `Local Host` | hardware | [saad-latheef/ready-classified-coconut](https://github.com/saad-latheef/ready-classified-coconut) |
| 23 | [IGNIS](#project-23) | `Ignis` | kireap | [Catherin-j/AgroHunt](https://github.com/Catherin-j/AgroHunt) |
| 24 | [TRNDO](#project-24) | `Powerpuff Girls` | software | [A56-A5/make-a-ton](https://github.com/A56-A5/make-a-ton) |
| 25 | [QuantumRoute](#project-25) | `StrawHats` | kireap | [GowrishankarSMenon/makeaton](https://github.com/GowrishankarSMenon/makeaton) |
| 26 | [Clinical Action and Response Engine](#project-26) | `DarkLead!` | software | [DarkLead-Hub/C.A.R.E.](https://github.com/DarkLead-Hub/C.A.R.E.) |
| 27 | [AGNI](#project-27) | `Lakshyaas` | kireap | [DilshanCheerangan/agni-main](https://github.com/DilshanCheerangan/agni-main) |

---

## Detailed Project Descriptions

### <a id="project-1"></a>1. Tinkerbluds - Cultivated Land Validation Platform

- **Team**: `tinkerbluds`
- **Institution**: CUSAT,RSET
- **Track**: kireap
- **Tagline**: *Instant Plot Validation & Crop Suitability Service with Satellite Intelligence*
- **Repository**: [https://github.com/Shaan-Shoukath/Tinkerbluds](https://github.com/Shaan-Shoukath/Tinkerbluds)
- **Demo Link**: [Watch Video Demo](https://youtu.be/lmnmKAbwiO4)

#### Problem Statement
Automated Plot Validation and Ownership Plausibility

#### How Did They Solve It (Solution Architecture)
Tinkerbluds is an automated, API‑ready platform designed to validate farmer‑submitted plot polygons against real satellite imagery and environmental data to determine if:
1. The plot physically exists
2. It is genuine agricultural land
3. The claimed crop is plausible for that location

It integrates multiple data sources and analytical components:
•Google Earth Engine to fetch Sentinel‑2 imagery
•ESA WorldCover land‑classification to check cropland coverage
•NDVI (vegetation index) analysis for active vegetation
•Open‑Meteo weather + soil moisture data
•A REST API + interactive dashboard to make results easily accessible
•Supabase for persistent farmer & plot storage

Users upload a KML polygon defining a farm plot. The service then:
•Parses and georeferences the polygon
•Downloads or samples the relevant satellite tile automatically
•Runs land classification and NDVI analysis
•Computes cultivated area vs total plot area
•Scores and decides PASS / REVIEW / FAIL based on threshold logic
•Optionally analyzes crop suitability based on recent weather and soil moisture conditions
•Stores validated plots and alerts in the database
•Presents supporting evidence layers (satellite & NDVI thumbnails, land‐class charts, weather tables)

This system is built for automation, scalability, auditability, and explainability which is crucial for reducing fraud and incorrect submissions across diverse agricultural contexts.

#### Technologies & Tools Used
- **Core Stack**: FastAPI, Google Earth Engine, HTML, Python, Supabase
- **Package Dependencies**: `geopandas, shapely, requests, python-dotenv, fastapi, uvicorn[standard], earthengine-api, pydantic, python-multipart, supabase, xgboost, scikit-learn`
- **Codebase Scale**: ~25 source files inspected locally.

---

### <a id="project-2"></a>2. AI-Powered Farm Management & Decision Support System

- **Team**: `Stardust Crusaders`
- **Institution**: St Aloysius (Deemed to be University)
- **Track**: software
- **Tagline**: *This project proposes an AI-powered farm management assistant that uses Retrieval-Augmented Generation (RAG)*
- **Repository**: [https://github.com/Alston2006/CropIntel](https://github.com/Alston2006/CropIntel)
- **Demo Link**: [Watch Video Demo](https://youtu.be/wW4c1d0cIY0?si=JLyYulasOPDZ-AdY)

#### Problem Statement
AI-Powered Farm Management & Decision Support System

#### How Did They Solve It (Solution Architecture)
Project Description: CropIntel
CropIntel is a next-generation Agricultural Intelligence Platform that leverages Local Large Language Models (LLMs) and hyper-local data fusion to empower farmers and merchants. By bridging the gap between raw data and actionable insights, CropIntel provides a "digital brain" for the modern farm, ensuring food security and economic stability through AI-driven decision-making.

 The Core Innovation: RAG-Powered Intelligence
Unlike standard agricultural apps, CropIntel utilizes Retrieval-Augmented Generation (RAG). It connects a local Gemma2:2b model (via Ollama) directly to a real-time database of over 1,100 market price records. This allows farmers to ask natural language questions—like "Is it a good time to sell my wheat in Delhi?"—and receive answers backed by current market statistics, regional trends, and historical price anomalies.

Impact Goal
CropIntel aims to transform agriculture from a reactive industry into a predictive one. By providing 500m-resolution weather data and real-time market transparency, the platform reduces crop waste, optimizes resource usage, and stabilizes the agricultural economy.

#### Technologies & Tools Used
- **Core Stack**: CSS, FastAPI, HTML, JavaScript, Python, React
- **Package Dependencies**: `fastapi, uvicorn, requests, numpy`
- **Codebase Scale**: ~45 source files inspected locally.

---

### <a id="project-3"></a>3. Secure.sol

- **Team**: `HackWaters`
- **Institution**: Cochin University College of Engineering Kuttanad,CUSAT
- **Track**: software
- **Tagline**: *Protector of Smart Contracts, Savior of Developers*
- **Repository**: [https://github.com/Noel9907/secure-sol](https://github.com/Noel9907/secure-sol)
- **Demo Link**: [Watch Video Demo](https://youtu.be/MKiGrbRsF44?si=TTYwOkmvACOtA42T)

#### Problem Statement
Security Issues in Smart Contract unchecked leading to Millions in losses.

#### How Did They Solve It (Solution Architecture)
Secure.sol is a smart contract  security platform designed to help developers identify vulnerabilities in their smart contracts before deploying them to real blockchain networks. Smart contracts control large amounts of digital assets, and even a small mistake in the code can lead to severe financial losses.It addresses the problem by providing a safe environment where developers can simulate real-world attacks and analyze contract security.

The platform allows users to upload their smart contracts, which are then compiled and deployed on a local blockchain environment using Hardhat. Running the system locally ensures that all attack simulations are performed in a completely isolated and safe environment, meaning no real assets or live blockchain networks are affected

Once the contract is deployed locally, the system automatically executes multiple attack scripts that replicate common smart contract vulnerabilities. These simulated attacks include scenarios such as reentrancy attacks, access control vulnerabilities, integer overflows, input validation flaws. Each attack script interacts with the deployed contract exactly the way a real attacker would, allowing the system to test whether the contract is vulnerable.

#### Technologies & Tools Used
- **Core Stack**: CSS, Express, JavaScript, Next.js, React, Solidity, Tailwind CSS, TypeScript, Web3/Ethers
- **Package Dependencies**: `@radix-ui/react-slot, lucide-react, @google/generative-ai, cors, dotenv, express, multer, openai, @inquirer/password, @openzeppelin/contracts, @typechain/ethers-v6, envfile`
- **Codebase Scale**: ~191 source files inspected locally.

---

### <a id="project-4"></a>4. RiskRank

- **Team**: `Samurai`
- **Institution**: APJ abdul kalam technological university
- **Track**: kireap
- **Tagline**: *Prioritize What Breaks the Business*
- **Repository**: [https://github.com/orgs/make-a-ton-samurai/repositories](https://github.com/orgs/make-a-ton-samurai/repositories)
- **Demo Link**: [Watch Video Demo](https://youtu.be/4C8BS3kJTek?si=L2PglnKbQI6Z2Dcg)

#### Problem Statement
Developer-Friendly Security

#### How Did They Solve It (Solution Architecture)
Abstract

RiskRank is a business-first vulnerability prioritization engine designed to address the growing problem of alert fatigue and ineffective vulnerability triage in modern security operations. While existing security tools generate thousands of alerts and rely heavily on static CVSS severity scores, they lack business context, leading teams to focus on low-impact issues while critical vulnerabilities remain unpatched.

RiskRank transforms traditional vulnerability management by analyzing security findings through a business-impact lens. The system ingests outputs from SAST and DAST tools, enriches them with contextual data such as asset criticality and exposure level, and applies AI-driven prioritization to rank vulnerabilities based on their potential operational, financial, and reputational impact. It also translates technical risks into clear, actionable business insights, enabling faster and more strategic remediation decisions.

By reducing alert noise and accelerating the identification of high-impact threats, RiskRank helps organizations align security efforts with business priorities. The platform integrates seamlessly into existing DevSecOps workflows via CLI and CI/CD pipelines, ensuring minimal disruption while maximizing risk visibility and response efficiency.

#### Technologies & Tools Used
- **Core Stack**: CSS, Next.js, React, Tailwind CSS, Three.js, TypeScript
- **Package Dependencies**: `@types/bcryptjs, @types/three, bcryptjs, clsx, dotenv, framer-motion, html2canvas, jose, jspdf, lucide-react, mongoose, next`
- **Codebase Scale**: ~64 source files inspected locally.

---

### <a id="project-5"></a>5. Traq

- **Team**: `Parallax`
- **Institution**: School of Engineering CUSAT
- **Track**: hardware
- **Tagline**: *Know before you go*
- **Repository**: [https://github.com/Sangeeth62880/Traq.git](https://github.com/Sangeeth62880/Traq.git)
- **Demo Link**: [Watch Video Demo](https://youtu.be/cb7obwuuN-Q)

#### Problem Statement
Crowd management and ticket validation in railway

#### How Did They Solve It (Solution Architecture)
Traq – Intelligent Crowd & Ticket Analytics System for Railways
Project Overview

Traq is a smart railway monitoring and digital ticket validation system designed specifically for high-population railway networks like India. The system measures real-time passenger density inside general compartments and automatically detects ticketless passengers without requiring QR scanning, RFID tapping, or manual verification.

Traq integrates RF sensing, Bluetooth Low Energy (BLE), WiFi communication, and cloud analytics using InfluxDB to create a scalable railway intelligence platform.

1. Real-Time Passenger Density Detection

Each train bogie is equipped with:

RF8318 module for human presence density estimation

Bluetooth scanning

WiFi device detection

WiFi connectivity for cloud transmission

The RF module estimates the total number of people inside a compartment. Bluetooth and WiFi scanning help correlate device presence for improved accuracy.

The processed data is transmitted to the backend and stored in InfluxDB as time-series data.

The system provides:

Occupancy percentage

Overcrowding alerts

Peak-time pattern analysis

Historical density trends

This allows railway authorities to monitor congestion in real time and optimize operations.

2. RailCard – Zero-Interaction Smart Ticket Identity

Traq introduces a device called RailCard.

RailCard is:

Built using nRF52833 (ultra-low-power BLE SoC)

Very small in size

Long battery life

Assigned a permanent unique ID (similar to Aadhaar concept)

Each RailCard has a unique digital identity stored in the backend database.

When a passenger books a ticket through the app:

The ticket is digitally mapped to the RailCard’s unique ID.

No QR code is generated.

No physical ticket is required.

No tapping or scanning is needed.

After booking, the passenger does not need to perform any additional step.

3. Automatic Ticket Verification Inside Train

Each train bogie contains multiple nRF52833-based BLE receivers.

When a passenger enters:

The RailCard broadcasts its unique BLE ID.

Bogie receivers detect all RailCards inside the compartment.

The backend verifies whether each ID has a valid ticket.

The number of verified tickets inside that bogie is calculated in real time.

This process is fully automatic and requires no human interaction.

4. Ticketless Passenger Detection Logic

Traq determines ticketless passengers using a simple and scalable formula:

Ticketless Passengers =
Total People in Bogie − Total Verified RailCards

Where:

Total People is estimated using RF density sensing.

Total Verified RailCards are counted using BLE detection and backend validation.

Example:

If 300 people are detected in a bogie
and only 250 valid RailCards are verified,

Then 50 passengers are likely traveling without valid tickets.

This allows:

Real-time ticketless estimation

Targeted inspections

Reduced manpower dependency

Data-driven enforcement strategies

5. Why QR and RFID Systems Are Difficult to Implement in India

India has extremely high railway passenger density, especially in general compartments.

QR-based systems:

Require manual scanning

Create long queues

Slow passenger movement

Are impractical for unreserved compartments

Cause congestion during peak hours

RFID gate-based systems:

Require physical entry gates

Involve massive infrastructure costs

Are difficult to deploy on open railway platforms

Cannot handle extreme rush conditions

In high-density environments, gate-based or scan-based systems create bottlenecks and safety risks.

6. Why RailCard Is the Solution

RailCard removes all friction.

No scanning

No tapping

No queues

No physical verification

No additional step after booking

Passengers simply enter the train. The system automatically detects and verifies them.

This makes Traq scalable to millions of daily passengers.

7. Application Ecosystem
Public Application

Book tickets linked to RailCard

View real-time crowd density per compartment

Check live train status

Choose less crowded bogies

Railway Authority Dashboard

Monitor compartment occupancy

View ticketless passenger estimates

Access historical crowd analytics

Analyze peak congestion patterns

8. Backend & Data System

Data transmitted via WiFi

Stored in InfluxDB (time-series database)

Enables real-time analytics

Provides density trends and predictive insights

Traq is not just a ticket system.
It is a railway intelligence and crowd analytics platform designed for large-scale, high-density public transportation systems.

#### Technologies & Tools Used
- **Core Stack**: CSS, HTML, JavaScript, React
- **Package Dependencies**: `firebase, lucide-react, react, react-dom, react-router-dom`
- **Codebase Scale**: ~34 source files inspected locally.

---

### <a id="project-6"></a>6. Cusatify

- **Team**: `freshers.exe`
- **Institution**: School of engineering,Cusat
- **Track**: software
- **Tagline**: *Digital Solutions for Real Campus Problems*
- **Repository**: [https://github.com/uditya22-flux/cusatify](https://github.com/uditya22-flux/cusatify)

#### Problem Statement
CUSAT students currently navigate a fragmented academic experience, manually checking library seat availability, tracking book due dates, and monitoring attendance across different platforms or physical logs. During high-pressure exam seasons, this lack of a unified system leads to "seat-squatting" in libraries, forgotten book renewals resulting in fines, and the constant anxiety of falling below the required attendance percentage.

#### How Did They Solve It (Solution Architecture)
📘 CUSATIFY

A Unified Digital Platform for Students and Faculty


---

📌 Project Overview

CUSATIFY is a centralized digital platform designed to streamline academic and campus-related activities for both students and faculty.

The system integrates:

Library Seat Management

Attendance Tracking

Academic Notes Sharing

Assignment & Event Notifications

Timetable Management

Study Resources

Faculty Administrative Controls


The goal is to digitize and centralize campus operations into a single smart ecosystem.


---

🎓 STUDENT PORTAL – Detailed Features


---

1️⃣ Library Seat Management System

Purpose

To prevent seat blocking and ensure fair library usage.

How It Works

Student enters library.
Scans QR code placed at library entrance.
App verifies location/library ID.
Displays real-time available seats.
Student selects a seat.
Timer starts for selected time slot.

On expiry:

Automatic checkout.
Seat becomes available again.

Additional Capabilities

Manual checkout before timer ends.
Seat booking logs stored in database.
Faculty can access logs.




2️⃣ Attendance Management

Two Methods:

Method A – Faculty Direct Marking

Faculty opens attendance panel.
Selects subject & semester.
Marks present/absent manually.


Method B – QR-Based Attendance

Faculty generates QR code in class.
Students scan QR within limited time.
Attendance auto-recorded.


Benefits

Reduces proxy attendance.
Maintains digital record.
Real-time attendance percentage tracking.



3️⃣ Notes Section

Features

Faculty upload subject notes.

Students can:

View notes
Download notes
Access semester-wise content


Organization

Department-based
Semester-based
Subject-based


4️⃣ Campus Event Notifications

Students Receive:

Event announcements
Workshop notifications
Cultural program alerts
Important university circulars


Faculty Can:

Create events
Edit events
Set event deadlines
Attach details



5️⃣ Assignment Notifications

Students

View upcoming assignments
Check submission deadlines
Get reminder notifications

Faculty

Create assignments
Set due dates
Attach instructions
Monitor submission status (future scope)



6️⃣ Library Logs (Faculty Access)

Faculty can:

View which students used library
See:
Check-in time
Check-out time
Duration
Track usage patterns,Monitor discipline issues-future modifications



7️⃣ Timetable Module

Students
View semester timetable
See:
Subject
Faculty name
Time slot
Classroom



Faculty

View teaching schedule
See assigned semesters & subjects---

8️⃣ Study Resources Section

Centralized academic resource hub:
Syllabus
Previous year question papers
Reference materials
External learning links
Department materials



---

👨‍🏫 FACULTY PORTAL – Detailed Features


---

🔐 Faculty Login Information

Faculty login requires:

Name
Faculty ID
Department
Subjects teaching
Semester assigned



---

Faculty Capabilities

1️⃣ Attendance Control
Mark attendance directly
Generate QR for attendance
View attendance reports


2️⃣ Library Log Monitoring

Access student library usage
View duration logs


3️⃣ Event Creation

Create campus events
Assign target departments/semesters
Schedule event dates
Send notifications to students


4���⃣ Assignment Management

Create assignments
Add deadlines
Post instructions
Monitor submissions (future scope)



---

🏗️ System Architecture (Conceptual)

Users → Flutter App → Firebase Authentication
→ Cloud Firestore Database
→ Real-Time Data Sync
→ Role-Based Access Control


---

🔒 Security Features

Role-based login (Student / Faculty)

Department-based data access

Firestore rules for permission control

Session-based authentication

Backend-controlled timer logic



📊 Database Structure (Conceptual)

Collections may include:

attendance

events

faculty

librarySessions

students



---

🚀 Impact of the System

Digitizes campus management

Reduces manual paperwork

Prevents seat misuse

Improves transparency

Centralizes student information

Saves administrative time



---

🔮 Future Scope

Seat Management  Using cameras instead of QR

Admin Dashboard

Analytics & Reports

Push Notifications

NFC / Bluetooth validation

Multi-campus scalability

AI-based usage analytics

#### Technologies & Tools Used
- **Core Stack**: C/C++ / Arduino, Flutter / Dart, HTML, Python
- **Codebase Scale**: ~158 source files inspected locally.

---

### <a id="project-7"></a>7. Trust Score Engine

- **Team**: `Codequest`
- **Institution**: Cochin University of science and technology
- **Track**: software
- **Tagline**: *Trust Score Engine for Real-World Data*
- **Repository**: [https://github.com/vishnupvenmany/trustscore](https://github.com/vishnupvenmany/trustscore)
- **Demo Link**: [Watch Video Demo](https://youtu.be/JgA558YwoVk)

#### Problem Statement
Trust Score Engine for Real-World Data

#### How Did They Solve It (Solution Architecture)
TrustLayer is a domain-agnostic statistical trust engine that dynamically assigns confidence scores to incoming data streams.

Instead of relying on machine learning black boxes, TrustLayer uses explainable statistical methods to:

Detect anomalies in real time

Measure cross-source agreement

Track long-term reliability of each source

Automatically classify sources as Trusted, Monitor, or Isolate

Provide clear reasoning for every decision

The system ensures that downstream applications use only statistically validated, historically reliable data.

🧠 How It Works

TrustLayer evaluates each data source using three core layers:

1️⃣ Rolling Anomaly Detection

Uses a rolling window (size 5)

Computes Z-score to measure statistical deviation

Values beyond ±2.5 standard deviations are flagged

Converts deviation into a smooth anomaly score (0–1)

2️⃣ Cross-Source Consensus

Computes the median across sources at each timestamp

Measures deviation from peer agreement

Assigns a consensus score (0–1)

Penalizes sources that diverge significantly

3️⃣ Historical Trust (Adaptive Memory)

Uses exponential smoothing:

trust = 0.8 × old + 0.2 × performance

Trust builds gradually when behavior is consistent

Trust erodes when anomalies or disagreements persist

📊 Final Trust Score

Each source receives a final trust score:

0.4 × Historical Trust

0.3 × (1 − Anomaly Score)

0.3 × Consensus Score

Classification:

✅ ≥ 0.75 → Trusted

⚠️ 0.40–0.75 → Monitor

🚨 < 0.40 → Isolate

The engine also recommends:

The most reliable source

The statistically safest value

🧪 Validation & Testing

The system was stress-tested using deterministic scenarios:

Normal behavior

Single source failure

Collusion between weak sources

Gradual drift

Full system chaos

Recovery after isolation

Each scenario validates the robustness of anomaly detection, consensus logic, and historical trust adaptation.

Additionally, a Live API mode streams real Bitcoin price data and simulates adversarial disturbances to demonstrate real-time adaptability.

🎯 Key Features

Fully explainable statistical engine (no ML)

Real-time streaming support

CSV dataset ingestion

Multi-source simulation

Automatic anomaly detection

Dynamic reliability scoring

Transparent reasoning panel

Ranking and recommendation system

Domain-agnostic architecture

🌍 Real-World Applications

TrustLayer can be applied in:

Financial data validation

IoT sensor networks

Weather data aggregation

Healthcare monitoring systems

Supply chain data verification

API reliability monitoring

Any system where data trust determines decision quality.

🏁 Conclusion

TrustLayer transforms raw multi-source data into quantified, explainable trust decisions. By combining statistical anomaly detection, peer consensus, and adaptive reliability tracking, it ensures that automated systems operate on trustworthy information without requiring constant human verification.

In environments where incorrect data can lead to critical failures, TrustLayer provides a structured, transparent framework for automated trust management.

#### Technologies & Tools Used
- **Core Stack**: FastAPI, Python
- **Package Dependencies**: `pandas, numpy, plotly, streamlit, requests, fastapi, uvicorn`
- **Codebase Scale**: ~19 source files inspected locally.

---

### <a id="project-8"></a>8. COG AI

- **Team**: `EQUINOX`
- **Institution**: SAHRDAYA COLLEGE OF ENGINEERING AND TECHNOLOGY
- **Track**: software
- **Tagline**: *COG AI - EARLY DEMENTIA DETECTOR*
- **Repository**: [https://github.com/anugrahks19/Cog-AI-main](https://github.com/anugrahks19/Cog-AI-main)
- **Demo Link**: [Watch Video Demo](https://youtu.be/8uuwnBZ5ia8)

#### Problem Statement
COG AI - EARLY DEMENTIA DETECTOR

#### How Did They Solve It (Solution Architecture)
Cog.ai is a multilingual, AI-powered mobile/web application designed to screen for early signs of dementia using speech analysis, simple cognitive games, behavioral tracking, and facial pattern observations. It uses cloud-based machine learning models along with lightweight on-device processing to work even in low-connectivity regions. The tool generates a personalized risk score and suggests clinical referrals for high-risk users. It features a clinician dashboard, making it useful for hospitals, NGOs, and old-age homes. This solution is affordable, scalable, and user-friendly for rural and urban settings.

#### Technologies & Tools Used

---

### <a id="project-9"></a>9. Mudra

- **Team**: `Yukti`
- **Institution**: Nehru Arts and Science College
- **Track**: hardware
- **Tagline**: *Turning Motion into Meaning — Real-Time Gesture Intelligence.*
- **Repository**: [https://github.com/Ranger-NF/Mudra](https://github.com/Ranger-NF/Mudra)
- **Demo Link**: [Watch Video Demo](https://youtu.be/22E3ZvSfUuE)

#### Problem Statement
Current human-computer interaction methods rely heavily on manual interaction, limiting mobility, accessibility, and seamless control in modern digital environments

#### How Did They Solve It (Solution Architecture)
A multi-purpose wearable input device that combines EMG and IMU signals to recognize gestures in real time. By fusing muscle activity and motion data, our system achieves more robust and accurate gesture recognition compared to camera-based systems. The predictions are streamed instantly to a live interface via WebSockets, enabling low-latency, privacy-friendly, and hardware-efficient human–computer interaction.

#### Technologies & Tools Used
- **Core Stack**: C/C++ / Arduino, CSS, HTML, Next.js, Python, React, TypeScript
- **Package Dependencies**: `next, react, react-dom, socket.io-client, ws`
- **Codebase Scale**: ~49 source files inspected locally.

---

### <a id="project-10"></a>10. STVE - Sensor Trust Verification Engine

- **Team**: `Nexus`
- **Institution**: Govt. Model Engineering College
- **Track**: kireap
- **Tagline**: *A time-series data analysis engine that scores, validates, and filters agricultural sensor data based on real-world behavior.*
- **Repository**: [https://github.com/HashimCodeDev/STVE](https://github.com/HashimCodeDev/STVE)
- **Demo Link**: [Watch Video Demo](https://drive.google.com/file/d/1lcxJ9gV8EYVFe8XHUktqadJ79G14YciO/view?usp=drive_link)

#### Problem Statement
Trust Score Engine for Real-World Data

#### How Did They Solve It (Solution Architecture)
STVE (Sensor Trust Verification Engine) is a sensor trust verification system designed for precision agriculture, where large networks of soil sensors directly influence automated irrigation and fertilization decisions. These sensors often suffer from silent failures such as frozen readings, calibration drift, sudden spikes, or complete data loss, which can lead to incorrect actions and resource waste. STVE addresses this problem by ensuring that only reliable sensor data is trusted and used for automation.

The system works as an intelligent trust layer between sensors and decision-making systems. Sensor readings such as soil moisture, temperature, electrical conductivity, and pH are continuously ingested and stored as time-series data. Each new reading triggers an immediate evaluation of sensor behavior, allowing the system to detect faults in near real time.

STVE analyzes temporal patterns in sensor data to identify abnormal behavior, including static values, sudden spikes, and gradual drift. It also compares readings across nearby sensors within the same zone to distinguish faulty sensors from genuine field-level events like rainfall or irrigation. Physical plausibility checks further ensure that readings fall within realistic environmental limits.

Based on these analyses, STVE assigns each sensor a dynamic trust score and classifies it as healthy, warning, or anomalous. When a sensor becomes anomalous, the system automatically generates a maintenance ticket and presents the issue through a real-time dashboard. By filtering out unreliable data and enabling rapid maintenance, STVE improves decision accuracy, reduces resource waste, and increases the reliability of automated agricultural systems.

#### Technologies & Tools Used
- **Core Stack**: CSS, Express, JavaScript, Next.js, Python, React, TypeScript
- **Package Dependencies**: `@prisma/client, cors, dotenv, express, framer-motion, next, react, react-dom, recharts`
- **Codebase Scale**: ~81 source files inspected locally.

---

### <a id="project-11"></a>11. HealStack AI

- **Team**: `BitCode`
- **Institution**: CUSAT
- **Track**: kireap
- **Tagline**: *Autonomus  Ai instance  response and sandbox validation platform*
- **Repository**: [https://github.com/benadictjacob/Adaptive-routing-algorithm](https://github.com/benadictjacob/Adaptive-routing-algorithm)
- **Demo Link**: [Watch Video Demo](https://youtu.be/pX3vMn0YWp8)

#### Problem Statement
Self-Healing Data Pipeline Framework

#### How Did They Solve It (Solution Architecture)
This project is an autonomous self-healing platform that monitors microservice clusters to detect, diagnose, and resolve infrastructure failures in real-time. When a crash occurs, the system orchestrates multiple AI models to "reason" through logs and source code, identifying root causes that traditional monitoring tools would miss. Every proposed fix is automatically validated within an isolated sandbox environment to ensure safety before being presented to a human operator for one-click approval. The centralized dashboard provides a rich visual timeline of incidents, integrated chat for collaborative analysis, and multi-session persistence for tracking long-term system health. Ultimately, it transforms passive observability into a proactive "safe-to-fail" ecosystem that significantly reduces downtime and operational burden.

#### Technologies & Tools Used
- **Core Stack**: CSS, Flask, HTML, JavaScript, Python
- **Package Dependencies**: `flask>=2.0.0, flask-cors>=3.0.0, numpy>=1.21.0, scipy>=1.7.0, flask`
- **Codebase Scale**: ~400 source files inspected locally.

---

### <a id="project-12"></a>12. An AI Voice Assistant Application Optimised For Local Farmers

- **Team**: `HackOverflow`
- **Institution**: Amrita Vishwa Vidyapeetham
- **Track**: kireap
- **Tagline**: *Krishi Mithra*
- **Repository**: [https://github.com/devangdileep/make-a-ton.git](https://github.com/devangdileep/make-a-ton.git)
- **Demo Link**: [Watch Video Demo](https://youtube.com/shorts/TmNVQ9vevCs?si=o-lG9ivOHZvZcu-z)

#### Problem Statement
AI-Powered Voice Assistant for Farmers

#### How Did They Solve It (Solution Architecture)
Smart Krishi Mitra is an AI-powered agricultural assistant designed for rural farmers in low-connectivity areas. It features a multilingual voice assistant that provides accessible, localized agronomic advice. The platform generates dynamic, AI-driven farmland sustainability reports and precision action schedules by analyzing real-time weather and crop data

#### Technologies & Tools Used

---

### <a id="project-13"></a>13. VigilX: Smart Anti-Sleep Safety System for Drivers

- **Team**: `Ton Kanakkinu Byte`
- **Institution**: College of Engineering Trivandrum
- **Track**: kireap
- **Tagline**: *Smarter Sensing. Safer Driving.*
- **Repository**: [https://github.com/Meegitty/VigilX](https://github.com/Meegitty/VigilX)
- **Demo Link**: [Watch Video Demo](https://youtu.be/uLXb6wsypCk?si=rAECbspeE4T8QT9M)

#### Problem Statement
Trust Score Engine for Real-World Data

#### How Did They Solve It (Solution Architecture)
Our project is a smart helmet-based safety system that doesn’t just monitor the driver, it protects them. Using an eye blink sensor and head movement tracking, the system detects early signs of drowsiness in real time. But instead of blindly trusting raw data, we built a Trust Score Engine that continuously evaluates how reliable each sensor reading is. If a sensor becomes noisy or inconsistent, its influence is reduced automatically, ensuring smarter and more accurate fatigue detection.

If drowsiness is detected, the helmet immediately triggers vibration and sound alerts to wake the driver. In case of a severe impact, the built-in crash detection system identifies abnormal acceleration patterns and activates emergency protocols.

The helmet connects to our mobile app via Bluetooth, enabling instant SOS alerts with location details to emergency contacts. So whether it’s preventing an accident or responding to one, our system acts as an intelligent, confidence-driven safety companion.

In short:
It watches. It evaluates. It reacts. And when needed — it calls for help.

#### Technologies & Tools Used
- **Core Stack**: C/C++ / Arduino, Flutter / Dart, HTML, React
- **Codebase Scale**: ~161 source files inspected locally.

---

### <a id="project-14"></a>14. OPTIMA – Optimization Protocol for Traffic Intelligence & Management Architecture

- **Team**: `Binary.exe`
- **Institution**: AMRITA VISWA VIDYAPEETHAM , NAGERCOIL
- **Track**: software
- **Tagline**: *A Swarm-Based AI Traffic System for Real-Time Adaptive Signal Optimization*
- **Repository**: [https://github.com/Adhwu/Optima](https://github.com/Adhwu/Optima)
- **Demo Link**: [Watch Video Demo](https://youtu.be/odmx0Ed020o)

#### Problem Statement
OPTIMA - Optimization Protocol for Traffic Intelligence & Management Architecture

#### How Did They Solve It (Solution Architecture)
OPTIMA is an intelligent, swarm-based traffic management system designed to replace static fixed-time signal systems with real-time adaptive control. The system integrates AI-powered cameras, magnetometers, and acoustic sensors to monitor vehicle density and detect emergency vehicles at each junction. Data is processed locally using edge computing and shared with neighboring intersections through mesh networking to enable coordinated traffic flow.

The swarm optimization engine dynamically adjusts green signal durations based on real-time traffic density, waiting time, and inter-junction flow conditions. In emergency scenarios, the system automatically overrides normal operation to create an instant green corridor, ensuring rapid and uninterrupted passage for ambulances, fire engines, and police vehicles. A built-in hardware watchdog ensures fail-safe operation during sensor or network failures.

By combining multi-sensor fusion, decentralized swarm intelligence, and predictive traffic coordination, OPTIMA reduces congestion, minimizes fuel wastage, lowers emissions, improves emergency response time, and enhances overall urban mobility efficiency.

#### Technologies & Tools Used
- **Core Stack**: CSS, HTML, JavaScript, Python
- **Codebase Scale**: ~15 source files inspected locally.

---

### <a id="project-15"></a>15. PCO-US

- **Team**: `Optimus Prime`
- **Institution**: Muthoot Institute of Technology and Science
- **Track**: hardware
- **Tagline**: *Multi‑Signal Ovulation Intelligence System for PCOD/PCOS Patients*
- **Repository**: [https://github.com/JoanneKoshy/PCOUS](https://github.com/JoanneKoshy/PCOUS)
- **Demo Link**: [Watch Video Demo](https://youtube.com/shorts/3g-hfvnyONI?si=GN4F4PbKuwX2ZbCg)

#### Problem Statement
Women with PCOS lack a reliable, personalized, and explainable system to accurately detect ovulation and identify anovulatory cycles using multi-physiological signals.

#### How Did They Solve It (Solution Architecture)
PCO‑US is a multi-signal ovulation intelligence system designed to improve menstrual phase detection and ovulation prediction for women, especially those with irregular cycles or PCOS.

Traditional ovulation tracking methods rely heavily on calendar prediction or single-signal tracking such as LH strips. However, women with hormonal imbalances often experience inconsistent LH surges, irregular cycles, or stress-driven fluctuations that reduce prediction accuracy.

PCO‑US solves this by integrating:

• Heart Rate (HR)
• Heart Rate Variability (HRV)
• Skin Temperature
• Movement detection (for signal filtering)
• Optional LH strip image analysis

The system collects real-time physiological data using an ESP32-based wearable sensor device. Nightly readings are averaged to generate a personal baseline over the first three days. On subsequent days, deviations from this baseline are analyzed.

An AI‑lite rule-based inference engine evaluates:

• Temperature elevation
• HRV suppression
• Heart rate elevation
• Stress impact
• LH strip ratio (via OpenCV image processing)

These signals are combined to classify the user’s reproductive phase into:

• Baseline Establishing
• Pre‑Ovulatory
• Ovulation Approaching
• Ovulatory Pattern
• Anovulatory Pattern

The system also generates a confidence score and provides explainable indicators (e.g., “Mild HRV drop detected” or “LH borderline — rising”).

This multi-signal approach increases robustness compared to single-parameter tracking and is particularly valuable for women with PCOS, stress-induced irregularity, or long cycle gaps.

PCO‑US demonstrates how affordable hardware, physiological analytics, and explainable AI logic can be combined to create an accessible reproductive health intelligence platform.

#### Technologies & Tools Used
- **Core Stack**: CSS, ESP32, HTML, JavaScript, OpenCV, Python, React
- **Package Dependencies**: `firebase, react, react-dom, react-router-dom`
- **Codebase Scale**: ~23 source files inspected locally.

---

### <a id="project-16"></a>16. KOLPAY

- **Team**: `Kolon`
- **Institution**: Christ College of Engineering
- **Track**: software
- **Tagline**: *Payments are digital, but purchase details are disconnected from the payment.*
- **Repository**: [https://github.com/Bharath-Krishna-AB/ledger](https://github.com/Bharath-Krishna-AB/ledger)
- **Demo Link**: [Watch Video Demo](https://youtu.be/-nWLorhYpRg)

#### Problem Statement
Paper receipts are inconvenient to store and mobile number–based digital billing is privacy-invasive and restricted under India’s DPDP Act 2023, creating a need for a scalable, privacy-preserving digital billing alternative.

#### How Did They Solve It (Solution Architecture)
Paper receipts are inconvenient to store and mobile number–based digital billing is privacy-invasive and restricted under India’s DPDP Act 2023, creating a need for a scalable, privacy-preserving digital billing alternative.Consumers are required to retain physical bills for returns, warranties, and expense tracking. Storing these receipts long-term is inconvenient and unreliable. Some retailers send digital bills via SMS, but this requires customers to share their phone numbers.

Under the Digital Personal Data Protection (DPDP) Act 2023, retailers cannot mandate collection of mobile numbers as a condition for billing or service. Customers must have a genuine option to refuse without loss of service. This limits the scalability of phone number–based digital billing systems.

At the same time, UPI QR codes are already widely used for payments. These codes currently encode payment parameters such as merchant ID and amount (e.g., upi://merchant@bank?amount=100). There is an opportunity to extend this mechanism by embedding structured bill metadata directly into the QR payload.

If item-level bill data were included in the QR code, consumers could scan and pay as usual while simultaneously capturing a structured digital receipt. This would eliminate paper bills, avoid mandatory phone number collection, and create a searchable expense history without manual entry or screenshots.

#### Technologies & Tools Used

---

### <a id="project-17"></a>17. Wiki Cusat

- **Team**: `Nexus Connect`
- **Institution**: School of Engineering , CUSAT
- **Track**: software
- **Tagline**: *Unified Knowledge for a Smarter Campus.*
- **Repository**: [https://github.com/philip-thomas-12/Wiki-Cusat/tree/main](https://github.com/philip-thomas-12/Wiki-Cusat/tree/main)
- **Demo Link**: [Watch Video Demo](https://youtu.be/qut30BQ0e8s)

#### Problem Statement
Wiki cusat

#### How Did They Solve It (Solution Architecture)
Navigating university ecosystems often presents a fragmented experience for students, researchers, and faculty seeking accurate institutional information. CUSAT Knowledge Nexus addresses this critical information silo by providing a centralized, AI-driven platform that aggregates department data, academic procedures, and campus resources into an accessible, structured wiki format.

At the core of the platform is an intelligent conversational agent powered by advanced generative AI, which instantly retrieves relevant university data to answer complex student queries. The system features a robust, hierarchical wiki architecture with an intuitive search engine, enabling seamless exploration of campus knowledge. Institutional administrators benefit from secure access controls, allowing them to effectively manage, curate, and update platform content in real-time.

Engineered for high availability and concurrent usage, the platform utilizes a decoupled architecture separating the modern frontend from the high-performance Python backend. This scalable infrastructure ensures rapid query resolution during peak university enrollment periods and provides a foundational template that can be readily adapted and deployed across other educational institutions seeking to modernize their digital campus experience.

#### Technologies & Tools Used
- **Core Stack**: CSS, FastAPI, HTML, JavaScript, Python, React, Tailwind CSS, TypeScript
- **Package Dependencies**: `@supabase/supabase-js, clsx, date-fns, lucide-react, react, react-dom, tailwind-merge, fastapi, uvicorn, sqlalchemy, psycopg2-binary, pydantic`
- **Codebase Scale**: ~31 source files inspected locally.

---

### <a id="project-18"></a>18. NEUROMOTION: AI ASSISTIVE REHABILITATION

- **Team**: `KAIZEN`
- **Institution**: Mar Athanasius College of Engineering Kothamangalam
- **Track**: hardware
- **Tagline**: *Personalized Hybrid Mobile AI Therapist at your service!*
- **Repository**: [https://github.com/alfi30-bat/kaizen-robotics](https://github.com/alfi30-bat/kaizen-robotics)
- **Demo Link**: [Watch Video Demo](https://drive.google.com/file/d/1oOOY_zcKOkIAKqe7W6J_-_ZIVBc-aT36/view?usp=drivesdk)

#### Problem Statement
Stroke is one of the leading causes of long-term disability worldwide, leaving millions of survivors with impaired upper-limb motor function. Effective recovery requires repetitive, structured rehabilitation exercises performed with correct posture, joint alignment, and controlled movement. However, once patients leave hospital-based physiotherapy, they often lack continuous supervision and real-time feedback. As a result, many perform exercises incorrectly, develop compensatory movement patterns, or discontinue therapy altogether, significantly slowing recovery and increasing long-term disability risk. Existing solutions such as generic exercise videos, fitness trackers, or camera-based monitoring systems either fail to provide movement-quality analysis or raise concerns related to cost, complexity, and privacy. There is a critical need for an accessible, accurate, and privacy-conscious rehabilitation support system that can guide patients during home-based therapy while maintaining clinical relevance.

#### How Did They Solve It (Solution Architecture)
NeuroMotion is a hybrid rehabilitation platform designed to assist stroke survivors in performing upper-limb physiotherapy exercises accurately and consistently outside clinical environments. The system integrates wearable motion sensing, computer vision, and adaptive AI coaching to deliver real-time movement evaluation and personalized therapy recommendations.
Stroke recovery heavily depends on repetitive, correct arm movements. However, once patients leave hospital-based supervision, many perform exercises incorrectly, develop compensatory patterns, or discontinue therapy due to lack of guidance. NeuroMotion addresses this gap by acting as a home-based intelligent rehabilitation coach that augments physiotherapy rather than replacing it.
Core Objective
To provide accurate, privacy-conscious, and adaptive rehabilitation guidance that improves exercise correctness, increases adherence, and reduces long-term disability risk in stroke survivors.
System Architecture
1. Wearable Hardware Layer
The patient wears a lightweight sling-based device embedded with multiple MPU6050 inertial measurement units (IMUs) placed along the arm:
Wrist sensor — tracks fine motion and rotation
Mid-arm sensor — measures elbow angle
Upper-arm sensor — detects compensation and shoulder involvement
An ESP32 microcontroller collects motion data in real time.
The sling stabilizes the arm and ensures consistent sensor placement during physiotherapy sessions.
2. Sensor Fusion & Motion Analysis
The system uses hybrid sensor fusion:
IMU sensors provide orientation, angular velocity, and 3D motion tracking
Computer vision provides periodic spatial reference and posture validation
IMUs are precise for depth (Z-axis) tracking but suffer from long-term drift.
Computer vision recalibrates drift and detects full-body compensation movements.
This hybrid approach improves long-duration tracking accuracy compared to standalone IMU or vision systems.
3. AI Rehabilitation Intelligence
The AI layer performs:
Joint angle computation
Range-of-motion analysis
Smoothness evaluation
Repetition consistency tracking
Compensation detection
The system compares user movement against predefined physiotherapy templates stored in a structured exercise database.
Movement quality—not just activity—is evaluated.
4. Personalized Therapy Engine
Users log into the NeuroMotion web platform built with Flask (backend) and HTML/CSS/JavaScript (frontend).
Patients can upload medical documents (discharge summaries, prescriptions).
AI processes these inputs to determine:
Severity of condition
Affected limb
Suitable exercise category
Based on session performance data, the system adapts:
Exercise difficulty
Repetition count
Intensity level
Recovery progression goals
5. Real-Time AI Voice Coaching
The system integrates text-to-speech synthesis for guided rehabilitation sessions.
The AI:
Instructs exercise steps
Corrects improper posture
Encourages consistent pacing
Advises when calibration is needed
This provides a personalized and interactive rehabilitation experience rather than passive monitoring.
Data Flow
User logs in
Medical data uploaded and processed
Personalized exercise plan generated
User starts session wearing sling
IMU + vision capture movement
Sensor fusion evaluates movement quality
AI provides real-time voice and haptic feedback
Session performance stored
Adaptive recommendations updated
Privacy & Ethical Design
Primary tracking uses wearable sensors
Computer vision is session-based and not continuously recording
No facial recognition
No unnecessary video storage
Minimal data retention
User-controlled data access
NeuroMotion is designed to enhance rehabilitation without compromising patient dignity.
Societal Relevance
Stroke is a leading cause of long-term disability globally. Many patients lack continuous physiotherapy access due to cost and geographic limitations. Improper home-based exercises can delay recovery and reinforce incorrect neural patterns.
NeuroMotion bridges the gap between hospital-based rehabilitation and independent recovery by providing:
Affordable assistive technology
Continuous home-based feedback
Scalable rehabilitation support
Reduced dependency on frequent clinical visits
Uniqueness of the System
Hybrid sensor fusion (IMU + computer vision)
Rehabilitation-specific motion quality scoring
Adaptive AI-guided therapy progression
Privacy-preserving architecture
Integrated hardware + software + AI ecosystem
Unlike generic fitness trackers or object-detection systems, NeuroMotion evaluates rehabilitation quality and recovery progression rather than merely detecting motion

#### Technologies & Tools Used
- **Core Stack**: ESP32, Flask, HTML, JavaScript, Python
- **Package Dependencies**: `f l a s k ,  `
- **Codebase Scale**: ~17 source files inspected locally.

---

### <a id="project-19"></a>19. Ravana

- **Team**: `BlueSteel`
- **Institution**: Model Engineering College Thrikkakara
- **Track**: software
- **Tagline**: *Democratizing Compute via the Browser*
- **Repository**: [github.com/simonknowsstuff/ravana](github.com/simonknowsstuff/ravana)
- **Demo Link**: [Watch Video Demo](https://youtu.be/fAY8AfY40Nw)

#### Problem Statement
Democratizing Compute via the Browser

#### How Did They Solve It (Solution Architecture)
The "Hardware Gap" often prevents students and independent creators from accessing high-fidelity 3D visuals due to the extreme computational demands of professional rendering. While traditional distributed systems exist, they typically require local software installations and complex network configurations. Ravana is a zero-install, browser-based compute farm. It utilizes a master-worker architecture to parse GLTF-exported Blender scenes, distribute intensive tile-based rendering tasks to mobile devices via WebGL, and stitch the results into a final high-resolution output. This approach demonstrates that a powerful rendering cluster can be formed instantly using the collective power of the devices already in our pockets.

#### Technologies & Tools Used
- **Core Stack**: CSS, Express, HTML, JavaScript, React, Three.js, TypeScript
- **Package Dependencies**: `@react-three/drei, @react-three/fiber, express, qrcode.react, react, react-dom, socket.io, socket.io-client, three, three-mesh-bvh`
- **Codebase Scale**: ~32 source files inspected locally.

---

### <a id="project-20"></a>20. DEFENDER

- **Team**: `Sarvam IoT`
- **Institution**: CUSAT
- **Track**: hardware
- **Tagline**: *Smart Intrusion Detection System*
- **Repository**: [https://github.com/Meenakshimkumar/DEFENDER-WEBSITE](https://github.com/Meenakshimkumar/DEFENDER-WEBSITE)
- **Demo Link**: [Watch Video Demo](https://youtu.be/w5ID6pMG7Xk?si=ygMgU42DXx-RH4p-)

#### Problem Statement
Open-field agriculture faces significant crop losses due to wild animal intrusions, necessitating an automated, real-time detection and deterrent system that can reliably identify species and notify farmers across diverse environmental conditions.

#### How Did They Solve It (Solution Architecture)
DEFENDER is a smart web-based monitoring system designed to detect, track, and manage animal intrusion or movement through a centralized dashboard. It works by collecting detection data from connected monitoring devices, sending the data to a backend server where it is processed, stored, and analyzed, and then displaying real-time detections, alerts, and device status through an interactive web interface. The system automatically generates alerts when specific events are detected, allowing users to monitor activities, manage devices, and adjust system settings efficiently from one platform. The main problem it solves is the lack of intelligent, centralized monitoring for wildlife or intrusion detection, which often leads to delayed responses and manual supervision; DEFENDER provides an automated, real-time solution that improves safety, monitoring efficiency, and decision-making.

#### Technologies & Tools Used
- **Core Stack**: CSS, Flask, HTML, JavaScript, Next.js, OpenCV, PyTorch, Python, React, Tailwind CSS, TypeScript
- **Package Dependencies**: `flask, flask-cors, ultralytics, opencv-python, Pillow, werkzeug, transformers>=4.30.0, torch, soundfile, @hookform/resolvers, @radix-ui/react-accordion, @radix-ui/react-alert-dialog`
- **Codebase Scale**: ~97 source files inspected locally.

---

### <a id="project-21"></a>21. SaveSense

- **Team**: `SaveSense`
- **Institution**: SOE CUSAT
- **Track**: software
- **Tagline**: *Make Sense of your Saves*
- **Repository**: [https://github.com/roqcodes/SaveSense](https://github.com/roqcodes/SaveSense)
- **Demo Link**: [Watch Video Demo](https://youtube.com/shorts/FzTnYIWYrUM?si=nVuNfRPj2H6LzebM)

#### Problem Statement
People frequently save content from platforms like Instagram, YouTube, Reddit, and websites with the intention of revisiting it later, but most of these saved items are never accessed again. Over time, these saves accumulate across multiple platforms without context, prioritization, or reminders, creating digital clutter and information overload. Since existing systems treat saved content as static bookmarks rather than indicators of user intent, the original purpose behind saving is lost, resulting in a growing gap between intention and action.

#### How Did They Solve It (Solution Architecture)
People save hundreds of Instagram reels, YouTube videos, tweets, Reddit posts, and articles every month, but almost never come back to them. These “saved” items silently overflow across platforms and lose their value because current systems treat them as static bookmarks instead of meaningful signals.

Our idea is to build an AI-powered personal intent dashboard where users can send any content using native share buttons (or paste links/text), and the system intelligently understands why it was saved. The AI analyzes the content to extract topics, dates, events, deadlines, sales, and recurring interests, and then actively surfaces what matters at the right time.

For example, if a reel mentions an upcoming event, it gets pinned until the event date. If multiple videos or posts relate to researching a product, the app infers buying intent. Time-sensitive or actionable content is highlighted, while irrelevant items can be dismissed. The goal is not to store content, but to convert scattered saves into timely reminders, insights, and actions—reducing digital clutter and helping users act on their intent instead of forgetting it.

#### Technologies & Tools Used

---

### <a id="project-22"></a>22. Ready Classified Coconuts

- **Team**: `Local Host`
- **Institution**: College Of Engineering Trivandrum
- **Track**: hardware
- **Tagline**: *"Precision Grading for the Perfect Coconut — Where AI meets Hardware."*
- **Repository**: [https://github.com/saad-latheef/ready-classified-coconut](https://github.com/saad-latheef/ready-classified-coconut)
- **Demo Link**: [Watch Video Demo](https://youtu.be/yKDovAzjHCs)

#### Problem Statement
Automated Coconut classification in industries

#### How Did They Solve It (Solution Architecture)
The **Coconut Quality Checker** is a professional-grade industrial tool designed to standardize and accelerate the coconut grading process. By integrating high-speed hardware sensors with advanced computer vision and Generative AI, the system removes human subjectivity from quality control. It features a unique "throw-and-detect" workflow: simply place or throw a coconut onto the scale, and the system instantly captures dimensions, weight, and internal water level while performing a 360° visual health check for defects like mold, cracks, or holes.

#### Technologies & Tools Used
- **Core Stack**: C/C++ / Arduino, CSS, Next.js, Python, React, Tailwind CSS, TypeScript
- **Package Dependencies**: `@hookform/resolvers, @radix-ui/react-accordion, @radix-ui/react-alert-dialog, @radix-ui/react-aspect-ratio, @radix-ui/react-avatar, @radix-ui/react-checkbox, @radix-ui/react-collapsible, @radix-ui/react-context-menu, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-hover-card, @radix-ui/react-label`
- **Codebase Scale**: ~124 source files inspected locally.

---

### <a id="project-23"></a>23. IGNIS

- **Team**: `Ignis`
- **Institution**: School of Engineering,CUSAT
- **Track**: kireap
- **Tagline**: *Geospatial Validation for Agricultural Integrity*
- **Repository**: [https://github.com/Catherin-j/AgroHunt](https://github.com/Catherin-j/AgroHunt)
- **Demo Link**: [Watch Video Demo](https://youtu.be/CJOvpyeTbpk)

#### Problem Statement
Automated Plot Validation and Ownership Plausibility

#### How Did They Solve It (Solution Architecture)
What This Project Does:
The Agri Plot Validation System is an automated, explainable agricultural fraud-detection and validation engine that verifies whether:
A submitted polygon represents a real agricultural land parcel.

1.Crop is geometrically valid
2.The land is actively used for agriculture.
3.The claimed crop is climatically and environmentally plausible.
4.The final decision can be audited and explained transparently.
5.The system outputs a structured decision:
 PASS
 REVIEW
 FAIL
Along with detailed module-level evidence and confidence scores.


 What Problem It Solves:
This system addresses major issues in agricultural subsidy and claim validation systems:
1️⃣ Fraudulent Land Claims
Farmers may submit:
Non-agricultural land
Residential/urban land
Forest or wasteland
Random fake coordinates


2️⃣ Duplicate or Overlapping Claims
Multiple individuals may claim the same land parcel.


3️⃣ Crop Mismatch Fraud
A farmer may claim:
Rice in desert areas
Wheat in tropical coastal regions
Crops not suitable for local climate


4️⃣ Lack of Explainability
Traditional automated systems provide binary outputs without evidence.
 This system produces transparent, auditable explanations.


Agri Plot Validation System – How It Works:
 Validation Pipeline (Step-by-Step)
1️⃣ Geometry Validation
Verifies polygon structure (valid shape, no self-intersections).
Checks area is realistic.
Confirms the plot lies on actual land.
Filters out fake or suspicious shapes.


2️⃣ Vegetation Check (NDVI – Sentinel-2)
Uses satellite imagery to detect vegetation presence.
Computes NDVI score.
Rejects plots with insufficient vegetation.


3️⃣ Land-Use Classification (Dynamic World)
Confirms the area is classified as cropland.
Uses yearly majority classification for stability.
Prevents forest/urban land from being claimed as farmland.


4️⃣ Crop Plausibility Check
Uses climate data (NASA POWER).
Uses elevation data (SRTM).
Matches conditions with crop requirements.
Reduces score if crop is unsuitable for location.


Decision Engine:
Each module produces a confidence score (0–1).
Weighted scoring system combines all evidence.
Final outcome:
 PASS
 REVIEW
 FAIL

 Explainability:
Returns module-wise scores.
Provides plain-language reasoning.
Transparent and audit-ready.

#### Technologies & Tools Used
- **Core Stack**: CSS, HTML, JavaScript, Python, React, Sentinel-2
- **Package Dependencies**: `a n n o t a t e d - d o c = = 0 . 0 . 4 ,  ,  a n n o t a t e d - t y p e s = = 0 . 7 . 0 ,  a n y i o = = 4 . 1 2 . 1 ,  a t t r s = = 2 5 . 4 . 0 ,  c a c h e t o o l s = = 6 . 2 . 6 ,  c e r t i f i = = 2 0 2 6 . 1 . 4 ,  c f f i = = 2 . 0 . 0 ,  c h a r s e t - n o r m a l i z e r = = 3 . 4 . 4 , @turf/turf, leaflet, lucide-react`
- **Codebase Scale**: ~41 source files inspected locally.

---

### <a id="project-24"></a>24. TRNDO

- **Team**: `Powerpuff Girls`
- **Institution**: Christ College of Engineering, Irinjalakuda
- **Track**: software
- **Tagline**: *read the pulse*
- **Repository**: [https://github.com/A56-A5/make-a-ton](https://github.com/A56-A5/make-a-ton)
- **Demo Link**: [Watch Video Demo](https://youtu.be/jEw8Ch5t3EU)

#### Problem Statement
The Local Retail "Blind Spot"

#### How Did They Solve It (Solution Architecture)
Indian SMEs and D2C brands collect tons of customer chats and orders on WhatsApp every day, but they have no easy way to turn that real-time data into trending Instagram posts. They waste hours guessing trends, spend heavily on designers, and see low engagement because their content doesn’t connect back to actual sales.
Our simple all-in-one AI platform fixes this completely: it reads your WhatsApp conversations, predicts the next hot trends, instantly creates beautiful brand-matching images and ready-to-post Instagram content in seconds, and sends customers straight back to WhatsApp to buy with UPI — giving you higher engagement, more sales, and up to 60% lower content costs with zero extra work.

#### Technologies & Tools Used
- **Core Stack**: Flask, HTML, Python
- **Package Dependencies**: `Flask, Flask-CORS, reportlab, qrcode[pil], Pillow, marshmallow, python-dateutil, google-genai, python-dotenv, gunicorn, requests`
- **Codebase Scale**: ~33 source files inspected locally.

---

### <a id="project-25"></a>25. QuantumRoute

- **Team**: `StrawHats`
- **Institution**: SOE,CUSAT
- **Track**: kireap
- **Tagline**: *Finding the optimal route quantamastically!*
- **Repository**: [https://github.com/GowrishankarSMenon/makeaton](https://github.com/GowrishankarSMenon/makeaton)
- **Demo Link**: [Watch Video Demo](https://youtu.be/ocuBvLr5HCk)

#### Problem Statement
Quantum Optimal Delivery Path Optimization

#### How Did They Solve It (Solution Architecture)
Project Description
Quantum-Hybrid Delivery Route Optimizer is a full-stack web application that solves the Travelling Salesman Problem (TSP) for last-mile delivery logistics. Users place delivery locations on an interactive map and the system computes the optimal route using a choice of classical, quantum, or hybrid solvers.

The application features an interactive Leaflet.js map where users can click to add delivery stops, place road blocks to model street closures, and define weather zones (rain/lightning) that penalize or block routes through affected areas. A real-time delivery driver animation (top-down scooter with bearing rotation) visualizes the computed route on the map.

Route computation uses real-world road distances via the OSRM (Open Source Routing Machine) Table & Route APIs, with Haversine straight-line fallback. A preprocessing pipeline applies logistics modifiers — traffic congestion, rush hour multipliers, road type preferences, fuel efficiency, delivery priority, road blocks, and weather zones — to the distance matrix before solving.

The solver suite includes:

Nearest Neighbor — O(n²) greedy heuristic for fast approximation at any scale.
Held-Karp — O(n²·2ⁿ) exact bitmask DP solver, feasible for up to ~18–20 locations.
Hybrid Quantum-Classical (QHK) — Three-phase approach: (1) QAOA quantum exploration via IBM Quantum for globally-aware initial tour, (2) sliding-window Held-Karp refinement for local optimality, (3) 2-opt local search polish. Scales beyond the pure-quantum limit (~10 qubits) by using quantum only for exploration.
Compare Mode — Runs Held-Karp and Nearest Neighbor simultaneously, reporting both results side-by-side.
Road block avoidance uses multi-phase OSRM-based detection: route geometry checking (50m radius), distance table analysis, and straight-line fallback, with a penalty multiplier approach (100×) instead of hard-blocking. Visualization routes through blocks by requesting OSRM alternative routes and computing scaled detour waypoints.

The UI features a warm cream/muted orange theme with the Nunito font, dark borders, bouncy micro-interactions, a collapsible sidebar with drag-to-reorder locations, an algorithm picker modal, fuel cost estimation, and a quantum overlay with circuit visualization metrics.

#### Technologies & Tools Used
- **Core Stack**: C/C++ / Arduino, CSS, Flask, JavaScript, Next.js, Python, React, TypeScript
- **Package Dependencies**: `leaflet, next, react, react-dom, react-leaflet, qiskit>=1.0, qiskit-aer>=0.13, qiskit-algorithms>=0.3, qiskit-optimization>=0.6, qiskit-ibm-runtime>=0.20, python-dotenv>=1.0, flask>=3.0`
- **Codebase Scale**: ~40 source files inspected locally.

---

### <a id="project-26"></a>26. Clinical Action and Response Engine

- **Team**: `DarkLead!`
- **Institution**: SRM Institute of Science and Technology
- **Track**: software
- **Tagline**: *A plug-and-play ecosystem for predictive, secure, consent-driven healthcare(short)*
- **Repository**: [https://github.com/DarkLead-Hub/C.A.R.E.](https://github.com/DarkLead-Hub/C.A.R.E.)
- **Demo Link**: [Watch Video Demo](https://youtu.be/eQdBxY_g3Qo)

#### Problem Statement
Bridging Lethal Information Gaps through a Decentralized, Privacy-Preserving  Blockchain based Healthcare Ecosystem.

#### How Did They Solve It (Solution Architecture)
1. The Problem: Subir and the "Plastic Cover" Predicament
Meet Subir, a true Malayali living in Kochi. He loves his beef fry, his porotta, and unfortunately, his cholesterol is competing with the humidity levels.

One afternoon, Subir feels a sharp pain in his chest. He panics. His family rushes him to the hospital through the glorious bumper-to-bumper traffic. But when he finally reaches the reception, gasping for breath, he faces the Final Boss: The Receptionist Chechi.

She asks the dreaded question: “Sir, where is your file? The one in the yellow plastic cover from 2019?”

Subir doesn’t know. It’s probably under his bed, or maybe his wife used it to store electricity bills. The doctor needs his last ECG, his allergies, and his medication history now. But the hospital knows nothing about him.

In a world where we have UPI for money, Subir’s life still depends on remembering to bring a plastic bag. His data is trapped in a silo, his doctors are flying blind, and every second lost is critical.

2. Our Solution
We built C.A.R.E. to save Subir from the "Plastic Cover" era.

C.A.R.E. is a plug-and-play ecosystem that acts as a digital nervous system for hospitals. It connects real-time patient data from sensors directly to hospital systems—securely, instantly, and without the need for a physical file.

3. How It Works (Just Simple)
Real-Time Vitals: Subir wears our custom IoT Sensor Kit (ECG attached to a microcontroller). It streams his heart data live.

The "Emergency Bypass" Engine:

Routine Mode: Data is buffered, hashed, and stored on our IPFS Nodes and Blockchain for a permanent record.
Emergency Mode: If the sensor detects an arrhythmia (heart attack), the system bypasses the blockchain buffer entirely. It triggers a zero-latency "Code Red" alert directly on the Doctor’s Dashboard and Subir’s App.

Instant Access: When Subir reaches the hospital, he doesn't fill out forms. He scans his finger on the C.A.R.E. Flutter App. The doctor instantly sees his entire medical history, verified by the blockchain.

4. Key Novelty
We didn't just build a database; we built a fortress.

A. The "Invisible" Upgrade (OpenEMR Injection)

The Magic: We reverse-engineered OpenEMR (a standard hospital system) and built a custom Blockchain Injection Module. We intercept data flow and route it to our IPFS nodes instead of a dusty SQL server. The doctor uses their familiar screen, but the backend is now decentralized and immutable.

B. The "Digital Handshake" (File & Key Sharing)
This is our biggest breakthrough in user privacy.

The Problem: If Subir shares a file, he usually loses control of it.

The Solution (Proxy Re-Encryption): When Subir shares his "Key" with the doctor, he isn't giving away his password. He generates a masked session token.

The "Revoke" Power: The moment Subir leaves the cabin, he hits "Revoke" on his app. The system rotates the keys, and the doctor’s access is instantly locked. Subir owns his data, forever.

IPFS Hash Matching: The system verifies the file integrity by matching the IPFS Content Hash against the blockchain record. If even one bit of the file was tampered with, the hashes won't match, and the file won't open.

C. Ghost Mode Privacy (ERC-5542)

We implemented ERC-5542 (Stealth Addresses). Every time Subir’s data is logged, it uses a unique, one-time address. His medical history is verifiable on the public ledger, but his identity is mathematically invisible.

D. The "Trust Score" Dashboard

Subir’s app doesn’t just show his heart rate; it displays a live "Chain Trust Score." This visualizes the integrity of the blockchain connection in real-time, giving him immediate confidence that his data is tamper-proof.

E. The "Doc in Your Pocket" (AI Chatbot)

Subir doesn’t understand complex medical graphs. He just wants to know if he can eat dinner.

We integrated an AI Health Assistant that analyzes his real-time sensor data and historical records.

How it works: Subir asks, "Can I eat beef fry today?" The bot checks his current BP and cholesterol levels. If they are high, it replies: "Your pressure is 150/90, Subir. Stick to Idli and Sambhar today." It turns raw data into personalized lifestyle advice.

5. The "Gas Fee" Challenge & Solution
One major question remains: “If every heartbeat is a transaction, won’t Subir go broke paying Ethereum Gas Fees?”

We are gonna solve this using Account Abstraction (ERC-4337).

The Problem: Subir is a patient, not a crypto trader. He doesn't have an Ethereum wallet, and he shouldn't need to buy crypto just to save his heart data.

The Solution (Paymasters): We are gonna implement ERC-4337 Paymasters. This allows the hospital (or the C.A.R.E. subscription) to act as a sponsor.

When Subir's app sends data, the Paymaster Contract pays the gas fee on his behalf.

To Subir, the experience is 100% Gasless. He just sees a "Data Sent" notification, unaware that a blockchain transaction just occurred.

Future Scaling: For the backend, we are migrating to a Layer 2 Rollup (like Polygon or a dedicated Healthcare L2). This compresses thousands of medical records into a single "proof," reducing the cost from dollars to fractions of a penny.

Conclusion
C.A.R.E. solves the "Data Silo" and "Delayed Response" problems by turning static health records into a live, consent-driven, and actionable data stream.

#### Technologies & Tools Used
- **Core Stack**: C/C++ / Arduino, CSS, Express, Flutter / Dart, HTML, JavaScript, Next.js, Python, React, Solidity, Tailwind CSS, TypeScript, Web3/Ethers
- **Package Dependencies**: `@prisma/client, ethers, sqlite3, react, react-dom, @emotion/react, @emotion/styled, @mui/icons-material, @mui/material, @popperjs/core, @radix-ui/react-accordion, @radix-ui/react-alert-dialog`
- **Codebase Scale**: ~8787 source files inspected locally.

---

### <a id="project-27"></a>27. AGNI

- **Team**: `Lakshyaas`
- **Institution**: School of Engineer, CUSAT
- **Track**: kireap
- **Tagline**: *Adaptive Geo-secured Network for Intelligent Agriculture*
- **Repository**: [https://github.com/DilshanCheerangan/agni-main](https://github.com/DilshanCheerangan/agni-main)

#### Problem Statement
Cultivated Land Masking from Multi-Resolution Imagery

#### How Did They Solve It (Solution Architecture)
AGNI is a state-of-the-art precision agriculture platform designed to empower farmers, students, and researchers with AI-driven insights and advanced computer vision. It transforms raw field data into actionable intelligence, optimizing crop yields and livestock management while providing a deeply analytical view of farm health.


What it Does

AGNI serves as an all-in-one digital companion for modern farming. Its primary functions include:

Precision Land Analysis: Processes aerial or satellite images to calculate cultivated area, identifying exactly where crops are thriving and where the land is bare.
Stress Detection: Uses spectral analysis to find "stress zones" in crops, alerting farmers to nutrient deficiencies or water issues before they become visible to the naked eye.
Intelligent Recommendations: Suggests the best crops and livestock for a specific plot based on real-time weather, geographical features, and seasonal cycles.
Predictive Farm Intelligence: Estimates yield potential and provides soil profile insights based on regional data and historical trends.
Educational Gateway: Offers a "Science & Equations" section that teaches the mathematical models (like ExG and HSV) used in the analysis.


How it Works (Under the Hood)

AGNI operates on a high-performance FastAPI (Python) backend combined with a glassmorphism Vanilla JavaScript frontend.

Computer Vision Engine:

Excess Green Index (ExG): The backend uses a specialized algorithm ($2G - R - B$) to isolate chlorophyll signatures from soil and background noise.
HSV Thresholding: It leverages the Hue-Saturation-Value color space to detect crop stress (chlorosis) by targeting specific yellow-brown spectral ranges.
Polygon Boundary Logic: Integrated with Leaflet.js, it allows users to draw exact farm boundaries. The backend then masks the analysis strictly to that area for pinpoint accuracy.

AI & Data Integration:
Gemini AI: Powers the complex "Crop Advice" engine, synthesizing weather data, land-use stats, and coordinates to provide natural-language farming strategies.
Weather API: Pulls real-time agricultural metrics (humidity, wind, pressure) to adjust recommendations dynamically.
Geo-Spatial Intelligence: Calculates elevation, rainfall estimates, and daylight hours based on the latitude and longitude of the farm plots.

 Problems it Solves
Traditional farming often relies on guesswork. AGNI solves several critical challenges:

Inefficient Land Use: Farmers often don't know the exact percentage of their land being utilized. AGNI provides a precise Cultivated Area % to help maximize every square meter.
Late Detection of Crop Stress: By the time a plant looks yellow, it's often too late. AGNI's Stress % metric finds early-stage issues, saving entire harvests.
Climate & Seasonal Uncertainty: With shifting weather patterns, knowing when to sow is harder than ever. AGNI's Seasonal Context and Weather Insights provide a data-backed schedule for field work.
Lack of Access to Expert Data: Precision agriculture tech is often expensive. AGNI makes advanced computer vision and AI advice accessible through a simple web interface.
Knowledge Gap: It bridges the gap between raw data and understanding, teaching users the "Why" behind the "How" through its Science and Intelligence tabs.

Tech Stack
Backend: Python, FastAPI, OpenCV (Image Processing), NumPy (Data Science), Uvicorn.
Frontend: HTML5/Vanilla JavaScript, CSS3 (Tailwind CSS), Font Awesome.
Maps & GIS: Leaflet.js, OpenStreetMap, Leaflet Draw.
AI: Gemini AI Integration for personalized agricultural strategy.

#### Technologies & Tools Used
- **Core Stack**: FastAPI, HTML, JavaScript, OpenCV, Python, Tailwind CSS
- **Package Dependencies**: `fastapi, uvicorn, opencv-python-headless, numpy, pillow, python-multipart, python-jose[cryptography], requests`
- **Codebase Scale**: ~63 source files inspected locally.

---

