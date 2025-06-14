// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MetadataStore {
    event HashStored(address indexed user, bytes32 hash, uint256 timestamp);
    mapping(address => bytes32[]) public userHashes;

    function storeHash(bytes32 hash) public {
        userHashes[msg.sender].push(hash);
        emit HashStored(msg.sender, hash, block.timestamp);
    }

    function getHashes(address user) public view returns (bytes32[] memory) {
        return userHashes[user];
    }
}
