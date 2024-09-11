const bitcoin = require("bitcoinjs-lib");
import { chains, toBitcoinJS } from "@hyperbitjs/chains";

interface IUTXO {
  address: string;
  assetName: string;
  txid: string;
  outputIndex: number;
  script: string;
  satoshis: number;
  height?: number;
  value: number;
}

export function sign(
  network: "aidp" | "aidp-test" | "evr" | "evr-test",
  rawTransactionHex: string,
  UTXOs: Array<IUTXO>,
  privateKeys: any
): string {
  const networkMapper = {
    aidp: chains.aidp.main,
    "aidp-test": chains.aidp.test,
    evr: chains.evr.main,
    "evr-test": chains.evr.test,
  };

  const coin = networkMapper[network];

  if (!coin) {
    throw new Error(
      "Validation error, first argument network must be aidp, aidp-test, evr or evr-test"
    );
  }

  //@ts-ignore
  const AIDPCOIN = toBitcoinJS(coin);

  const tx = bitcoin.Transaction.fromHex(rawTransactionHex);
  const txb = bitcoin.TransactionBuilder.fromTransaction(tx, AIDPCOIN);

  function getKeyPairByAddress(address) {
    const wif = privateKeys[address];
    const keyPair = bitcoin.ECPair.fromWIF(wif, AIDPCOIN);
    return keyPair;
  }

  function getUTXO(transactionId, index) {
    return UTXOs.find((utxo) => {
      return utxo.txid === transactionId && utxo.outputIndex === index;
    });
  }

  for (let i = 0; i < tx.ins.length; i++) {
    const input = tx.ins[i];

    const txId = Buffer.from(input.hash, "hex").reverse().toString("hex");
    const utxo = getUTXO(txId, input.index);
    if (!utxo) {
      throw Error("Could not find UTXO for input " + input);
    }
    const address = utxo.address;
    const keyPair = getKeyPairByAddress(address);

    const signParams = {
      prevOutScriptType: "p2pkh",
      vin: i,
      keyPair,
      UTXO: utxo,
    };
    txb.sign(signParams);
  }
  const signedTxHex = txb.build().toHex();
  return signedTxHex;
}
export default {
  sign,
};
