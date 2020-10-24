const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = " ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.computeHash();
    }

    computeHash() {
        return SHA256(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data).toString()
        );
    }
}

class BlockChain {
    constructor() {
        this.blockchain = [this.genesisBlock()];
    }
    genesisBlock() {
        return new Block(0, "01/01/2020", "Initial Block in the Chain", "0");
    }

    getLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    addNewBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.computeHash();
        this.blockchain.push(newBlock);
    }

    checkChainValidity() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const current = this.blockchain[i];
            const previous = this.blockchain[i - 1];

            if (current.hash !== current.computeHash()) {
                return false;
            }
            if (current.previousHash !== previous.hash) {
                return false;
            }
        }
        return true;
    }
}

let samsonCoin = new BlockChain();
samsonCoin.addNewBlock(
    new Block(1, "01/05/2020", {
        sender: "Samson",
        recipient: "Malte",
        amount: 1000,
    })
);
samsonCoin.addNewBlock(
    new Block(2, "01/06/2020", {
        sender: "Malte",
        recipient: "Samson",
        amount: 1000,
    })
);

console.log(JSON.stringify(samsonCoin, null, 4));
console.log(samsonCoin.checkChainValidity());