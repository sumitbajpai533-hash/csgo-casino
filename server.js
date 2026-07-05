const express = require('express');
const crypto = require('crypto'); // Native Node.js Cryptographic Engine
const path = require('path');
const app = express();

app.use(express.json());
// Tera index.html direct casino root folder se uthega:
app.use(express.static(__dirname));

// --- PROVABLY FAIR CRYPTO MEMORY ---
let currentServerSeed = crypto.randomBytes(32).toString('hex');
let currentServerHash = crypto.createHash('sha256').update(currentServerSeed).digest('hex');

app.post('/api/bet', (req, res) => {
    const { betAmount, risk, clientSeed = "BhopalProPlayer2026", nonce = 1 } = req.body;

    // 1. SHA-256 CRYPTOGRAPHIC COMBINATION (Total Hack-Proof)
    const combinedString = `${currentServerSeed}-${clientSeed}-${nonce}`;
    const sha256Hash = crypto.createHash('sha256').update(combinedString).digest('hex');

    // 2. DETERMINISTIC HASH-TO-FLOAT CONVERSION
    const intVal = parseInt(sha256Hash.substring(0, 8), 16);
    const floatVal = intVal / 4294967295; 

    // 3. HOUSE EDGE & RTP CALCULATION
    let outcome = 'RED';
    let multiplier = 0;

    if (risk === 'easy') {
        if (floatVal > 0.55) { outcome = 'BLUE'; multiplier = 1.7; }
        if (floatVal > 0.90) { outcome = 'GREEN'; multiplier = 5.0; }
    } else if (risk === 'med') {
        if (floatVal > 0.65) { outcome = 'BLUE'; multiplier = 2.0; }
        if (floatVal > 0.93) { outcome = 'GREEN'; multiplier = 10.0; }
    } else if (risk === 'hard') {
        if (floatVal > 0.75) { outcome = 'BLUE'; multiplier = 3.0; }
        if (floatVal > 0.96) { outcome = 'GREEN'; multiplier = 20.0; }
    }

    // Reveal seed for round verification and generate fresh seed for next round
    const revealedServerSeed = currentServerSeed;
    currentServerSeed = crypto.randomBytes(32).toString('hex');
    currentServerHash = crypto.createHash('sha256').update(currentServerSeed).digest('hex');

    res.json({
        outcome,
        multiplier,
        provablyFairProof: {
            sha256HashUsed: sha256Hash,
            revealedServerSeed: revealedServerSeed,
            clientSeedUsed: clientSeed,
            nonce: nonce,
            nextRoundServerHash: currentServerHash
        }
    });
});

// Cloud automatically process.env.PORT dega, warna local ke liye 5000 chalega
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🔒 SHA-256 PROVABLY FAIR CRYPTO SERVER RUNNING ON PORT ${PORT}`);
});