const BouvetCoin = require("./lib/bouvetcoin.js");

var bouvetCoin = new BouvetCoin.BlockChain();

console.log("Mining block 1 ...");
bouvetCoin.addBlock(
    new BouvetCoin.Block(
        bouvetCoin.getNextIndex(),
        [new BouvetCoin.Transaction("ole.talgo@bouvet.no", "test@bouvet.no", 2)],
        bouvetCoin.getLatestBlock().hash,
        "ole.talgo@bouvet.no"
    )
);

console.log("Mining block 2 ...");
bouvetCoin.addBlock(
    new BouvetCoin.Block(
        bouvetCoin.getNextIndex(),
        [new BouvetCoin.Transaction("ole.talgo@bouvet.no", "test2@bouvet.no", 10)],
        bouvetCoin.getLatestBlock().hash,
        "ole.talgo@bouvet.no"
    )
);

console.log("BlockChain is valid: " + bouvetCoin.isChainValid());

bouvetCoin.showBalance();