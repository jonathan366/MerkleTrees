# MerkleTrees
A Merkle tree, or a hash tree, is a vital data structure used in computer science and cryptography. It was first introduced by Ralph Merkle who patented the concept in 1979. Merkle trees are extensively used in distributed systems, peer-to-peer networks, and blockchain technologies to efficiently verify the integrity and consistency of vast amounts of data.


## How Merkle Trees Work
At its core, a Merkle tree is a binary tree where each leaf node represents a cryptographic hash of a data block, and each non-leaf node represents the cryptographic hash of the concatenation of its child nodes' hashes. This hierarchical structure allows for efficient and secure verification of large datasets by recursively hashing pairs of nodes until a single hash, known as the root hash or Merkle root, is obtained.


## Benefits of Merkle Trees
Some of the advantages of using Merkle trees include:
- **Efficient Verification**: By comparing only the root hash, users can verify the integrity of large datasets without downloading or storing the entire dataset.
- **Tamper Detection**: Any alteration to the data, no matter how small, will result in a completely different root hash, making it easy to detect tampering.
- **Parallel Processing**: Since the tree can be constructed in parallel, it is well-suited for distributed systems and parallel computing environments.


## Implementing Merkle Trees
Now that we have seen the benefits of using Merkle trees, let us have a look at how they are implemented.

Consider a set of four data blocks: A1, B2, C3, and D4.

- The first step would be to compute the hash of each data block: 
```css
Hash(A1) = H(A1)
Hash(B2) = H(B2)
Hash(C3) = H(C3)
Hash(D4) = H(D4)
```

- Next, pair and hash adjacent blocks:
```css
Hash(AB) = Hash(Hash(A1) + Hash(B2))
Hash(CD) = Hash(Hash(C3) + Hash(D4))
```

- Once again hash the combined hashes:
```css
RootHash = Hash(Hash(AB) + Hash(CD))
```

The resulting hash is the Merkle root, representing the integrity of the entire dataset.


If the process had to be graphically illustrated, the structure of the Merkle tree would look something like this:


```css
                RootHash
               /       \
          Hash(AB)   Hash(CD)
          /    \       /    \
    Hash(A1)  Hash(B2)  Hash(C3)  Hash(D4)
```


## Example

Now with a sense of how a Merkle Tree can be implemented, here is an example of a Merkle Tree implementation. 

In this example, explore how a Merkle Proof can be used for whitelisting three email addresses.

- As in the implementation, the first step would be to generate a Merkle root from a list of email addresses

```javascript
function generateMerkleRoot(emails) {
    const leaves = emails.map(email => crypto.createHash('sha256').update(email).digest('hex'));
    return merkleRoot(leaves);
```

Since we want to create hashes, we will use the `crypto` module in Node.js. With that module, the `generateMerkleRoot` will take an array of email addresses as input and hash each email address using SHA-256. The resulting hash is stored in an array named `leaves`. 


- Next, the Merkle root needs to be calculated from the list of leaves

```javascript
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
```

The hash in `leaves` is then pushed into the `merkleRoot` function with the array of hashed email addresses to calculate the Merkle root.


- Then finally, the Merkle proof for a given email address can be generated 

```javascript
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
```

The `generateMerkleProof` calculates the hash of the email address to find its corresponding leaf in the Merkle tree and iterates through the Merkle tree to find the siblings of each node on the path from the leaf to the root. These siblings form the Merkle Proof.

If the email address is found in the list of email addresses, it prints the proof. If the email address is not found, it indicates that the email address is not whitelisted.


The entire code can be viewed [here](https://github.com/jonathan366/MerkleTrees/blob/main/email-whitelist-merkle-proof.js).


## Conclusion
In conclusion, Merkle Trees play a fundamental role in ensuring integrity and efficiency. By organizing transactions into a hierarchical structure and hashing them together, Merkle Trees enable quick verification of large sets of data with minimal computational resources. Their use in blockchain allows for secure and efficient validation of transactions, enhances the immutability of data, and facilitates faster synchronization among network participants. Overall, Merkle Trees are a cornerstone in maintaining the trust and reliability of blockchain systems, contributing significantly to their widespread adoption and functionality in various industries.
