const fs = require('fs');
const https = require('https');

https.get('https://2025.makeaton.in/assets/index-BC9p98ah.js', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const startToken = 'Xp=JSON.parse(';
        const start = data.indexOf(startToken);
        const end = data.indexOf('`)', start);
        const expr = data.substring(start + 'Xp='.length, end + 2);
        try {
            const parsed = eval(expr);
            console.log('Parsed projects count:', parsed.length);
            fs.writeFileSync('makeaton_2025_projects.json', JSON.stringify(parsed, null, 2));
            console.log('Successfully saved to makeaton_2025_projects.json');
            parsed.forEach((p, idx) => {
                console.log((idx + 1) + '. ' + p.title + ' (' + p.teamName + ') -> ' + p.github);
            });
        } catch (e) {
            console.log('Error parsing:', e.message);
        }
    });
});
