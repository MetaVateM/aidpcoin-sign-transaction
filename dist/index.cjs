var $74Dkp$buffer = require("buffer");
var $74Dkp$hyperbitjschains = require("@hyperbitjs/chains");
var $74Dkp$bitcoinjslib = require("bitcoinjs-lib");


var $80bd448eb6ea085b$require$Buffer = $74Dkp$buffer.Buffer;
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports["default"] = void 0;
module.exports.sign = $80bd448eb6ea085b$var$sign;


function $80bd448eb6ea085b$var$sign(network, rawTransactionHex, UTXOs, privateKeys) {
    var networkMapper = {
        aidp: $74Dkp$hyperbitjschains.chains.aidp.main,
        "aidp-test": $74Dkp$hyperbitjschains.chains.aidp.test,
        evr: $74Dkp$hyperbitjschains.chains.evr.main,
        "evr-test": $74Dkp$hyperbitjschains.chains.evr.test
    };
    var coin = networkMapper[network];
    if (!coin) throw new Error("Validation error, first argument network must be aidp, aidp-test, evr or evr-test");
    //@ts-ignore
    var AIDPCOIN = (0, $74Dkp$hyperbitjschains.toBitcoinJS)(coin);
    var tx = $74Dkp$bitcoinjslib.Transaction.fromHex(rawTransactionHex);
    var txb = $74Dkp$bitcoinjslib.TransactionBuilder.fromTransaction(tx, AIDPCOIN);
    function getKeyPairByAddress(address) {
        var wif = privateKeys[address];
        var keyPair = $74Dkp$bitcoinjslib.ECPair.fromWIF(wif, AIDPCOIN);
        return keyPair;
    }
    function getUTXO(transactionId, index) {
        return UTXOs.find(function(utxo) {
            return utxo.txid === transactionId && utxo.outputIndex === index;
        });
    }
    for(var i = 0; i < tx.ins.length; i++){
        var input = tx.ins[i];
        var txId = $80bd448eb6ea085b$require$Buffer.from(input.hash, "hex").reverse().toString("hex");
        var utxo = getUTXO(txId, input.index);
        if (!utxo) throw Error("Could not find UTXO for input " + input);
        var address = utxo.address;
        var keyPair = getKeyPairByAddress(address);
        var signParams = {
            prevOutScriptType: "p2pkh",
            vin: i,
            keyPair: keyPair,
            UTXO: utxo
        };
        txb.sign(signParams);
    }
    var signedTxHex = txb.build().toHex();
    return signedTxHex;
}
var $80bd448eb6ea085b$var$_default = module.exports["default"] = {
    sign: $80bd448eb6ea085b$var$sign
};


//# sourceMappingURL=index.cjs.map
