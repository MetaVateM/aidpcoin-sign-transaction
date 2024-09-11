import {Buffer as $5n8iY$Buffer} from "buffer";
import {chains as $5n8iY$chains, toBitcoinJS as $5n8iY$toBitcoinJS} from "@hyperbitjs/chains";
import {Transaction as $5n8iY$Transaction, TransactionBuilder as $5n8iY$TransactionBuilder, ECPair as $5n8iY$ECPair} from "bitcoinjs-lib";

var $c3f6c693698dc7cd$exports = {};

var $c3f6c693698dc7cd$require$Buffer = $5n8iY$Buffer;
"use strict";
Object.defineProperty($c3f6c693698dc7cd$exports, "__esModule", {
    value: true
});
$c3f6c693698dc7cd$exports["default"] = void 0;
$c3f6c693698dc7cd$exports.sign = $c3f6c693698dc7cd$var$sign;


function $c3f6c693698dc7cd$var$sign(network, rawTransactionHex, UTXOs, privateKeys) {
    var networkMapper = {
        aidp: $5n8iY$chains.aidp.main,
        "aidp-test": $5n8iY$chains.aidp.test,
        evr: $5n8iY$chains.evr.main,
        "evr-test": $5n8iY$chains.evr.test
    };
    var coin = networkMapper[network];
    if (!coin) throw new Error("Validation error, first argument network must be aidp, aidp-test, evr or evr-test");
    //@ts-ignore
    var AIDPCOIN = (0, $5n8iY$toBitcoinJS)(coin);
    var tx = $5n8iY$Transaction.fromHex(rawTransactionHex);
    var txb = $5n8iY$TransactionBuilder.fromTransaction(tx, AIDPCOIN);
    function getKeyPairByAddress(address) {
        var wif = privateKeys[address];
        var keyPair = $5n8iY$ECPair.fromWIF(wif, AIDPCOIN);
        return keyPair;
    }
    function getUTXO(transactionId, index) {
        return UTXOs.find(function(utxo) {
            return utxo.txid === transactionId && utxo.outputIndex === index;
        });
    }
    for(var i = 0; i < tx.ins.length; i++){
        var input = tx.ins[i];
        var txId = $c3f6c693698dc7cd$require$Buffer.from(input.hash, "hex").reverse().toString("hex");
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
var $c3f6c693698dc7cd$var$_default = $c3f6c693698dc7cd$exports["default"] = {
    sign: $c3f6c693698dc7cd$var$sign
};


export {$c3f6c693698dc7cd$exports as default};
//# sourceMappingURL=index.mjs.map
