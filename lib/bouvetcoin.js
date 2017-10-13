const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

class Block {
    constructor(index, transactions, previousHash, miner) {
        this.index = index;
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.miner = miner;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== new Array(difficulty + 1).join("b")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Successfully mined block " + this.hash);
        console.log("This took " + this.nonce + " tries (" + Math.floor((Date.now() - this.timestamp)/1000) + " seconds).")
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.nonce +
            this.timestamp + JSON.stringify(this.transactions) + this.miner).toString();
    }

    getMinerTransaction() {
        return new Transaction("BouvetCoin", this.miner, 10);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
        this.minerValue = 10;
    }

    addBlock(newBlock) {
        let latestBlock = this.getLatestBlock();
        newBlock.previousHash = latestBlock.hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    getNextIndex() {
        return this.chain[this.chain.length - 1].index + 1;
    }
    
    createGenesisBlock() {
        return new Block(0, [], "BouvetCoin", "devnull@bouvet.no");
    }

    isChainValid() {
        if (this.chain[0].previousHash !== "BouvetCoin") {
            console.log("Invalid genesis block hash seed");
            return false;
        }
        if (this.chain[0].hash !== this.chain[0].calculateHash()) {
            console.log("Invalid genesis block hash");
            console.log("Hash....: " + this.chain[0].hash);
            console.log("Expected: " + this.chain[0].calculateHash());
            return false;
        }

        for(let i = 1; i < this.chain.length; i++) {
            if (this.chain[i].previousHash !== this.chain[i - 1].hash) {
                console.log("Invalid previous hash in id " + i);
                return false;
            }
            if (this.chain[i].hash !== this.chain[i].calculateHash()) {
                console.log("Invalid hash in id " + i);
                return false;
            }
        }
        return true;
    }
    getBalance() {
        let balance = {};
        for (let i = 1; i < this.chain.length; i++) {
            if (balance[this.chain[i].miner] === undefined) {
                balance[this.chain[i].miner] = 0;
            }
            balance[this.chain[i].miner] += this.minerValue;
            for (let t of this.chain[i].transactions) {
                if (balance[t.from] === undefined) {
                    balance[t.from] = 0;
                }
                if (balance[t.to] === undefined) {
                    balance[t.to] = 0;
                }
                balance[t.from] -= t.amount;
                balance[t.to] += t.amount;
            }
        }
        return balance;
    }

    showBalance() {
        let balance = this.getBalance();
        console.log("* * * * * * * * * * * * * * * * ")
        console.log("*     BOUVETCOIN WALLETS      * ")
        console.log("* * * * * * * * * * * * * * * * ")
        for (let u of Object.keys(balance)) {
            console.log(u + ": " + balance[u] + " bouvetcoin");
        }
        console.log("* * * * * * * * * * * * * * * * ")
    }
}

module.exports = { Transaction, Block, BlockChain };
