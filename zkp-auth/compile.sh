#!/bin/bash
# Compile circuit
circom circuit.circom --r1cs --wasm --sym
snarkjs groth16 setup circuit.r1cs pot.ptau circuit_final.zkey
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
