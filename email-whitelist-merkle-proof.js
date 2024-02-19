const crypto = require('crypto');

// Function to generate a Merkle root from the list of email addresses
function generateMerkleRoot(emails) {
    const leaves = emails.map(email => crypto.createHash('sha256').update(email).digest('hex'));
    return merkleRoot(leaves);
}

// Function to calculate Merkle root from the list of leaves
function merkleRoot(leaves) {
    if (leaves.length === 0) {
        return crypto.createHash('sha256').update('').digest('hex');
    } else if (leaves.length === 1) {
        return leaves[0];
    } else {
        const concatenatedHashes = leaves.reduce((acc, leaf) => acc + leaf, '');
        return crypto.createHash('sha256').update(concatenatedHashes).digest('hex');
    }
}

// Function to generate Merkle proof for a given email address
function generateMerkleProof(email, emails) {
    const leaf = crypto.createHash('sha256').update(email).digest('hex');
    const proof = [];
    const index = emails.indexOf(email);

    if (index === -1) {
        return null; // Email not found in whitelist
    }

    let siblingIndex;
    for (let i = 0; i < Math.ceil(Math.log2(emails.length)); i++) {
        if (index % 2 === 0) {
            siblingIndex = index + 1;
        } else {
            siblingIndex = index - 1;
        }
        proof.push(emails[siblingIndex]);
        index = Math.floor(index / 2);
    }

    return { leaf, proof };
}

//  Test case
const emails = ['jonathan@gmail.com', 'jonathan@hey.com', 'jonathan@protonmail.com'];
const merkleRoot = generateMerkleRoot(emails);
console.log('Merkle Root:', merkleRoot);

const emailToCheck = 'jonathan@hey.com';
const proof = generateMerkleProof(emailToCheck, emails);
if (proof) {
    console.log(`Email ${emailToCheck} is whitelisted.`);
    console.log('Proof:', proof);
} else {
    console.log(`Email ${emailToCheck} is not whitelisted.`);
}
