const SHA256 = require("crypto-js/sha256");
class Block {
    constructor(index, timestamp, data, previousHash = "") {
        // Index is where the block is on the chain, data is any data we want to store on this block
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        // this is going to use the props of this block and run it through a Hash
        return SHA256(
            this.index +
            this.timestamp +
            this.previousHash +
            JSON.stringify(this.data) +
            this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("")
        ) {
            // making a string of zeros
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined" + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]; // Array of blocks
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2020", "Genesis Black", "8");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let samsonCoin = new Blockchain();

console.log("Mining block 1....");
samsonCoin.addBlock(new Block(1, "10/08/2020", { amount: 199 }));

console.log("Mining block 1....");
samsonCoin.addBlock(new Block(2, "01/09/2020", { amount: 199 }));