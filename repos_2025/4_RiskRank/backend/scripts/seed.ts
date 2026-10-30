/**
 * Seed MongoDB with demo user + 6 repos + scan history
 * Run: npx tsx scripts/seed.ts
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

/* ── Inline model definitions (avoid Next.js module issues) ── */
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const RepositorySchema = new mongoose.Schema({
    name: String,
    description: String,
    language: String,
    languageColor: String,
    ownerId: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
});
const TopRiskSchema = new mongoose.Schema({ rank: Number, title: String, reason: String, businessImpact: String, remediation: String, vulnerableCode: String, location: String, confidence: String }, { _id: false });
const FindingSchema = new mongoose.Schema({ id: Number, severity: String, file: String, line: Number, message: String }, { _id: false });
const ScanResultSchema = new mongoose.Schema({
    repoId: mongoose.Schema.Types.ObjectId,
    project: String,
    timestamp: Date,
    topRisks: [TopRiskSchema],
    findings: [FindingSchema],
    high: Number,
    med: Number,
    low: Number,
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Repository = mongoose.model("Repository", RepositorySchema);
const ScanResult = mongoose.model("ScanResult", ScanResultSchema);

/* ── Mock findings ── */
const FINDINGS = [
    { id: 1, severity: "HIGH", file: "src/auth/login.js", line: 42, message: "SQL injection via unsanitized user input" },
    { id: 2, severity: "HIGH", file: "src/api/users.js", line: 87, message: "Hardcoded JWT secret in source code" },
    { id: 3, severity: "HIGH", file: "src/utils/crypto.js", line: 15, message: "Weak MD5 hashing for passwords" },
    { id: 4, severity: "MED", file: "src/routes/admin.js", line: 23, message: "Missing authentication middleware" },
    { id: 5, severity: "MED", file: "src/config/server.js", line: 67, message: "CORS wildcard allows all origins" },
    { id: 6, severity: "MED", file: "src/middleware/rate.js", line: 12, message: "Rate limiting not configured" },
    { id: 7, severity: "LOW", file: "src/views/profile.js", line: 99, message: "Verbose error messages exposed" },
    { id: 8, severity: "LOW", file: "src/utils/logger.js", line: 34, message: "Sensitive data logged to console" },
];

const TOP_RISKS = [
    { rank: 1, title: "SQL Injection in Login", reason: "Direct user input in query", businessImpact: "Full database compromise", remediation: "Use parameterized queries", vulnerableCode: "db.query(`SELECT * FROM users WHERE id = ${req.body.id}`)", location: "src/auth/login.js:42", confidence: "High" },
    { rank: 2, title: "Hardcoded JWT Secret", reason: "Secret committed to version control", businessImpact: "Token forgery & auth bypass", remediation: "Move to environment variables", vulnerableCode: "const secret = 'my-super-secret-123'", location: "src/api/users.js:87", confidence: "High" },
    { rank: 3, title: "Weak Password Hashing", reason: "MD5 is cryptographically broken", businessImpact: "Password cracking in seconds", remediation: "Upgrade to bcrypt or argon2", vulnerableCode: "crypto.createHash('md5').update(password)", location: "src/utils/crypto.js:15", confidence: "High" },
];

/* ── Repos to seed ── */
const REPOS = [
    { name: "juice-shop", description: "OWASP Juice Shop — intentionally vulnerable web app", language: "JavaScript", languageColor: "#f7df1e" },
    { name: "railsgoat", description: "Vulnerable Ruby on Rails application for education", language: "Ruby", languageColor: "#cc342d" },
    { name: "dvwa", description: "Damn Vulnerable Web Application in PHP", language: "PHP", languageColor: "#777bb4" },
    { name: "webgoat", description: "WebGoat — insecure Java web application", language: "Java", languageColor: "#b07219" },
    { name: "pygoat", description: "OWASP PyGoat — Python/Django vulnerable app", language: "Python", languageColor: "#3572a5" },
    { name: "nodegoat", description: "Vulnerable Node.js web application by OWASP", language: "TypeScript", languageColor: "#3178c6" },
];

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([User.deleteMany({}), Repository.deleteMany({}), ScanResult.deleteMany({})]);
    console.log("🗑  Cleared existing collections");

    // Create admin user
    const passwordHash = await bcrypt.hash("zerohour", 12);
    const user = await User.create({ email: "admin@zerohour.dev", passwordHash });
    console.log("👤 Created admin user: admin@zerohour.dev / zerohour");

    // Create repos + scan results
    for (const repoData of REPOS) {
        const repo = await Repository.create({ ...repoData, ownerId: user._id });

        // Create 3 scan sessions per repo (simulating history)
        const dates = [
            new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        ];
        for (const ts of dates) {
            const h = FINDINGS.filter(f => f.severity === "HIGH").length;
            const m = FINDINGS.filter(f => f.severity === "MED").length;
            const l = FINDINGS.filter(f => f.severity === "LOW").length;
            await ScanResult.create({
                repoId: repo._id,
                project: repo.name,
                timestamp: ts,
                topRisks: TOP_RISKS,
                findings: FINDINGS,
                high: h, med: m, low: l,
            });
        }
        console.log(`📦 Seeded repo: ${repoData.name} (3 scans)`);
    }

    console.log("\n🎉 Seed complete!");
    console.log("   Login: admin@zerohour.dev / zerohour");
    await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
