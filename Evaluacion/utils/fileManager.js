const fs = require('fs');
const path = require('path');


const readJson = (filename) => {
const full = path.join(__dirname, '..', 'data', filename);
if (!fs.existsSync(full)) return [];
const raw = fs.readFileSync(full, 'utf8');
try {
return JSON.parse(raw || '[]');
} catch (e) {
throw new Error(`Error parseando ${filename}: ${e.message}`);
}
};


const writeJson = (filename, data) => {
const full = path.join(__dirname, '..', 'data', filename);
fs.writeFileSync(full, JSON.stringify(data, null, 2), 'utf8');
};


module.exports = { readJson, writeJson };