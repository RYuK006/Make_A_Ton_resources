import { ScanResult } from "./types";

/* ─── Full juice-shop scan ─────────────────────────────────── */
export const MOCK_SCAN: ScanResult = {
    id: "scan-juice-shop-001",
    project: "juice-shop",
    timestamp: new Date().toISOString(),
    topRisks: [
        {
            rank: 1,
            title: "SQL INJECTION IN LOGIN ENDPOINT",
            reason: "User input is directly inserted into a SQL query without proper sanitization, allowing an attacker to inject malicious SQL code.",
            businessImpact: "Unauthorized access to sensitive user data, potential database compromise.",
            remediation: "Use parameterized queries or prepared statements to prevent SQL injection.",
            vulnerableCode: `models.sequelize.query(\`SELECT * FROM Users WHERE email = '\${req.body.email || ''}' AND password = '\${security.hash(req.body.password || '')}' AND deletedAt IS NULL\`, { model: UserModel, plain: true })`,
            location: "routes/login.ts:34",
            confidence: "High",
        },
        {
            rank: 2,
            title: "HARDCODED HMAC KEY",
            reason: "A hardcoded HMAC key is used, which can be easily discovered by an attacker, allowing them to forge or tamper with data.",
            businessImpact: "Compromise of data integrity and authenticity, potential for tampering or forgery.",
            remediation: "Use an environment variable or a secure key management system to store and manage HMAC keys.",
            vulnerableCode: `export const hmac = (data: string) => crypto.createHmac('sha256', 'pa4qacea4VK9t9nGv7yZtwmj').update(data).digest('hex')`,
            location: "lib/insecurity.ts:44",
            confidence: "High",
        },
        {
            rank: 3,
            title: "ARBITRARY FILE READ VIA PATH TRAVERSAL",
            reason: "User input is used to construct a file path without proper validation, allowing an attacker to traverse the file system and read arbitrary files.",
            businessImpact: "Unauthorized access to sensitive files and data, potential for information disclosure.",
            remediation: "Validate and canonicalize file paths, use a whitelist of allowed files and directories.",
            vulnerableCode: `res.sendFile(path.resolve('ftp/', file))`,
            location: "routes/fileServer.ts:33",
            confidence: "Medium",
        },
    ],
    findings: [
        { id: 4, severity: "HIGH", file: "routes/search.ts", line: 23, message: "Detected a sequelize statement that is tainted by user-input. This could lead to SQL injection if the variable is user-controlled and is not properly sanitized." },
        { id: 5, severity: "HIGH", file: "frontend/src/app/app.guard.ts", line: 38, message: "JWT token detected." },
        { id: 6, severity: "HIGH", file: "frontend/src/app/last-login-ip.component.ts", line: 61, message: "JWT token detected." },
        { id: 7, severity: "HIGH", file: "frontend/src/app/last-login-ip.component.ts", line: 67, message: "JWT token detected." },
        { id: 8, severity: "HIGH", file: "data/static/codefixes/dbSchemaChallenge.ts", line: 5, message: "Detected a sequelize statement tainted by user-input. Could lead to SQL injection." },
        { id: 9, severity: "HIGH", file: "data/static/codefixes/dbSchemaChallenge.ts", line: 11, message: "Detected a sequelize statement tainted by user-input. Could lead to SQL injection." },
        { id: 10, severity: "HIGH", file: "data/static/codefixes/unionSqlInjection.ts", line: 6, message: "Detected a sequelize statement tainted by user-input. Could lead to SQL injection." },
        { id: 11, severity: "HIGH", file: "data/static/codefixes/unionSqlInjection.ts", line: 10, message: "Detected a sequelize statement tainted by user-input. Could lead to SQL injection." },
        { id: 12, severity: "HIGH", file: "routes/userProfile.ts", line: 62, message: "Found data from an Express request flowing to eval. Avoid eval whenever possible." },
        { id: 13, severity: "HIGH", file: "data/static/users.yml", line: 150, message: "Generic Secret detected." },
        { id: 14, severity: "HIGH", file: "frontend/src/hacking-instructor.ts", line: 122, message: "User controlled data in innerHTML, outerHTML or document.write — can lead to XSS vulnerabilities." },
        { id: 15, severity: "MED", file: "routes/b2bOrder.ts", line: 23, message: "Detected usage of the notevil package, which is unmaintained and has vulnerabilities." },
        { id: 16, severity: "MED", file: "routes/captcha.ts", line: 23, message: "Detected the use of eval(). Can be dangerous if used to evaluate dynamic content." },
        { id: 17, severity: "MED", file: "routes/chatbot.ts", line: 197, message: "User data flows into manually-constructed HTML — potential XSS. Use DOMPurify." },
        { id: 18, severity: "MED", file: "routes/fileUpload.ts", line: 83, message: "Detected use of parseXml() with noent set to true — could lead to XXE attack." },
        { id: 19, severity: "MED", file: "routes/keyServer.ts", line: 14, message: "User-input passed to res.sendFile — path traversal risk. Validate and canonicalize paths." },
        { id: 20, severity: "MED", file: "routes/logfileServer.ts", line: 14, message: "User-input passed to res.sendFile — path traversal risk. Validate and canonicalize paths." },
        { id: 21, severity: "MED", file: "routes/quarantineServer.ts", line: 14, message: "User-input passed to res.sendFile — path traversal risk. Validate and canonicalize paths." },
        { id: 22, severity: "MED", file: "routes/redirect.ts", line: 19, message: "Application redirects to user-supplied URL without validation — open redirect risk." },
        { id: 23, severity: "MED", file: "routes/userProfile.ts", line: 62, message: "Detected the use of eval(). May be a code injection vulnerability." },
        { id: 24, severity: "MED", file: "routes/videoHandler.ts", line: 58, message: "'subs' is used with a <script> tag — potential XSS. Ensure it is not user-controlled." },
        { id: 25, severity: "MED", file: "routes/videoHandler.ts", line: 71, message: "'subs' is used with a <script> tag — potential XSS. Ensure it is not user-controlled." },
        { id: 26, severity: "MED", file: "frontend/src/hacking-instructor.ts", line: 38, message: "Prototype pollution detected — attacker may add/modify attributes on every object." },
        { id: 27, severity: "MED", file: "frontend/src/index.html", line: 14, message: "Tag missing 'integrity' subresource integrity attribute — risk of XSS via CDN tampering." },
        { id: 28, severity: "MED", file: "frontend/src/index.html", line: 15, message: "Tag missing 'integrity' subresource integrity attribute — risk of XSS via CDN tampering." },
        { id: 29, severity: "MED", file: "frontend/src/index.html", line: 16, message: "Tag missing 'integrity' subresource integrity attribute — risk of XSS via CDN tampering." },
        { id: 30, severity: "MED", file: "lib/codingChallenges.ts", line: 76, message: "RegExp() called with a function argument — may allow ReDoS. Use hardcoded regexes." },
        { id: 31, severity: "MED", file: "lib/codingChallenges.ts", line: 78, message: "RegExp() called with a function argument — may allow ReDoS. Use hardcoded regexes." },
        { id: 32, severity: "MED", file: "lib/insecurity.ts", line: 56, message: "Hard-coded credential detected. Use environment variables or a secure vault." },
        { id: 33, severity: "MED", file: "lib/insecurity.ts", line: 152, message: "Hardcoded HMAC key detected. Use a config file or environment variable." },
        { id: 34, severity: "MED", file: "server.ts", line: 269, message: "Directory listing/indexing enabled — may disclose sensitive directories and files." },
        { id: 35, severity: "MED", file: "server.ts", line: 273, message: "Directory listing/indexing enabled — may disclose sensitive directories and files." },
        { id: 36, severity: "MED", file: "server.ts", line: 277, message: "Directory listing/indexing enabled — may disclose sensitive directories and files." },
        { id: 37, severity: "MED", file: "server.ts", line: 281, message: "Directory listing/indexing enabled — may disclose sensitive directories and files." },
        { id: 38, severity: "MED", file: "views/promotionVideo.pug", line: 79, message: "Explicit unescape in a Pug template using '!=' or '!{...}' — XSS risk if external data reaches here." },
        { id: 39, severity: "LOW", file: "data/static/codefixes/restfulApiChallenge.ts", line: 62, message: "replaceAll() used for HTML escaping — manually built sanitization can be bypassed. Use DOMPurify." },
        { id: 40, severity: "LOW", file: "data/static/codefixes/restfulApiChallenge.ts", line: 62, message: "replaceAll() used for HTML escaping. Use a well-known sanitization library instead." },
        { id: 41, severity: "LOW", file: "server.ts", line: 155, message: "String concatenation in console.log — attacker may inject format specifiers to forge log messages." },
    ],
};

/* ─── Repo card metadata (preview stats, no full scan) ─────── */
export interface RepoMeta {
    id: string;
    name: string;
    description: string;
    language: string;
    languageColor: string;
    lastScanned: string;
    high: number;
    med: number;
    low: number;
    scanId: string; // matches ScanResult.id to lazy-load
}

export const MOCK_REPOS: RepoMeta[] = [
    {
        id: "repo-1",
        name: "juice-shop",
        description: "OWASP Juice Shop — an intentionally vulnerable Node.js/Express web application for security training.",
        language: "TypeScript",
        languageColor: "#3178c6",
        lastScanned: new Date().toISOString(),
        high: 11, med: 24, low: 3,
        scanId: "scan-juice-shop-001",
    },
    {
        id: "repo-2",
        name: "dvwa",
        description: "Damn Vulnerable Web Application — a PHP/MySQL web application for practicing common web vulnerabilities.",
        language: "PHP",
        languageColor: "#4F5D95",
        lastScanned: new Date(Date.now() - 86400000).toISOString(),
        high: 7, med: 12, low: 5,
        scanId: "scan-dvwa-001",
    },
    {
        id: "repo-3",
        name: "webgoat",
        description: "WebGoat — a deliberately insecure Java web application maintained by OWASP.",
        language: "Java",
        languageColor: "#b07219",
        lastScanned: new Date(Date.now() - 172800000).toISOString(),
        high: 5, med: 9, low: 2,
        scanId: "scan-webgoat-001",
    },
    {
        id: "repo-4",
        name: "nodegoat",
        description: "NodeGoat — a vulnerable Node.js application to learn about OWASP Top 10 security risks.",
        language: "JavaScript",
        languageColor: "#f1e05a",
        lastScanned: new Date(Date.now() - 259200000).toISOString(),
        high: 9, med: 6, low: 4,
        scanId: "scan-nodegoat-001",
    },
    {
        id: "repo-5",
        name: "vulnerable-api",
        description: "A REST API built with Flask riddled with security flaws for penetration testing practice.",
        language: "Python",
        languageColor: "#3572A5",
        lastScanned: new Date(Date.now() - 345600000).toISOString(),
        high: 3, med: 8, low: 6,
        scanId: "scan-vulnapi-001",
    },
    {
        id: "repo-6",
        name: "railsgoat",
        description: "RailsGoat — a vulnerable Ruby on Rails application demonstrating OWASP Top 10 weaknesses.",
        language: "Ruby",
        languageColor: "#701516",
        lastScanned: new Date(Date.now() - 432000000).toISOString(),
        high: 6, med: 11, low: 2,
        scanId: "scan-railsgoat-001",
    },
];

/* Map scanId → full ScanResult (currently only juice-shop has real data) */
export const SCAN_MAP: Record<string, ScanResult> = {
    "scan-juice-shop-001": MOCK_SCAN,
};

/* ─── Scan history seed data ─────────────────────────────────── */
import { ScanSession } from "./types";

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export const MOCK_HISTORY_SEED: ScanSession[] = [
  // juice-shop — 4 scans showing progressive history
  { id: "scan-juice-shop-001", project: "juice-shop",     timestamp: d(0),  high: 11, med: 24, low: 3 },
  { id: "scan-juice-shop-002", project: "juice-shop",     timestamp: d(3),  high: 14, med: 26, low: 3 },
  { id: "scan-juice-shop-003", project: "juice-shop",     timestamp: d(7),  high: 11, med: 24, low: 3,  fixedVs: "scan-juice-shop-002", fixedCount: 3 },
  { id: "scan-juice-shop-004", project: "juice-shop",     timestamp: d(14), high: 14, med: 27, low: 4 },

  // dvwa — 3 scans
  { id: "scan-dvwa-001",       project: "dvwa",           timestamp: d(1),  high: 7,  med: 12, low: 5 },
  { id: "scan-dvwa-002",       project: "dvwa",           timestamp: d(8),  high: 9,  med: 14, low: 5 },
  { id: "scan-dvwa-003",       project: "dvwa",           timestamp: d(16), high: 6,  med: 11, low: 4,  fixedVs: "scan-dvwa-002", fixedCount: 4 },

  // webgoat — 2 scans
  { id: "scan-webgoat-001",    project: "webgoat",        timestamp: d(2),  high: 5,  med: 9,  low: 2 },
  { id: "scan-webgoat-002",    project: "webgoat",        timestamp: d(9),  high: 8,  med: 12, low: 2 },

  // nodegoat — 3 scans with good progress
  { id: "scan-nodegoat-001",   project: "nodegoat",       timestamp: d(4),  high: 9,  med: 6,  low: 4 },
  { id: "scan-nodegoat-002",   project: "nodegoat",       timestamp: d(10), high: 4,  med: 4,  low: 3,  fixedVs: "scan-nodegoat-001", fixedCount: 8 },
  { id: "scan-nodegoat-003",   project: "nodegoat",       timestamp: d(18), high: 2,  med: 3,  low: 2,  fixedVs: "scan-nodegoat-002", fixedCount: 4 },

  // vulnerable-api — 2 scans
  { id: "scan-vulnapi-001",    project: "vulnerable-api", timestamp: d(5),  high: 3,  med: 8,  low: 6 },
  { id: "scan-vulnapi-002",    project: "vulnerable-api", timestamp: d(12), high: 1,  med: 5,  low: 4,  fixedVs: "scan-vulnapi-001", fixedCount: 7 },

  // railsgoat — 2 scans
  { id: "scan-railsgoat-001",  project: "railsgoat",      timestamp: d(6),  high: 6,  med: 11, low: 2 },
  { id: "scan-railsgoat-002",  project: "railsgoat",      timestamp: d(13), high: 3,  med: 7,  low: 2,  fixedVs: "scan-railsgoat-001", fixedCount: 5 },
];
