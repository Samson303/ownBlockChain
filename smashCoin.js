const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = " ") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

class BlockChain {
  constructor() {
    this.blockchain = [this.genesisBlock()];
    this.difficulty = 4;
  }
  genesisBlock() {
    return new Block(0, "01/01/2020", "Initial Block in the Chain", "0");
  }

  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  addNewBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }
}

let samsonCoin = new BlockChain();
console.log("samsonCoin is  mining in progress....");
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
