// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <=0.9.0;
pragma experimental ABIEncoderV2;

import "./evidence.sol";

contract Sharding {

    uint public shardCount;
    uint public shardSize;

    struct validator{
        uint [] blockNo;
        uint validatorNo;
        address validatorAddress;
    }

    struct Shard{
        uint shardNo;
        bytes32 shardAddress;
        validator[] v;
        uint shardSize;
    } 

    Shard[] s;

    event ShardHashUpdated(uint shardNumber, bytes32 shardHash);

    function setshardParameters(uint _shardCount, uint _shardSize) public {
        shardCount = _shardCount;
        shardSize = _shardSize;
    }

    function setShardHash(uint shardNumber, bytes32 shardHash) public {
        require(shardNumber < shardCount);
        s.push();
        uint index = s.length - 1;
        s[index].shardNo = shardNumber;
        s[index].shardAddress = shardHash;
        s[index].shardSize = 0;
        emit ShardHashUpdated(shardNumber, shardHash);
    }


    function addValidator(uint shardNumber, address _validator) public {
        require(shardNumber < shardCount);
        require(s[shardNumber].shardSize < shardSize);
        //validator memory vv= validator([],s[shardNumber].shardSize, _validator);
        s[shardNumber].v.push();
        s[shardNumber].v[s[shardNumber].shardSize].validatorNo=s[shardNumber].shardSize;
        s[shardNumber].v[s[shardNumber].shardSize].validatorAddress=_validator;
        s[shardNumber].shardSize++;
    }

    function getShard(uint256 shardNumber) public view returns (Shard memory) {
        for (uint i = 0; i < s.length; i++) {
            if (s[i].shardNo == shardNumber) {
                return s[i];
            }
        }
        revert("Shard not found");
    }

    function getValidator(uint256 shardNumber,uint validatorNo) public view returns (validator memory) {
        for (uint i = 0; i < s.length; i++) {
            if (s[i].shardNo == shardNumber) {
                for (uint j = 0; j < s[i].shardSize; j++)
                {
                    if(s[i].v[j].validatorNo == validatorNo)
                        return s[i].v[j];
                }
            }
        }
        revert("Shard not found");
    }

    // function isValidator(address validator, uint shardNumber) public view returns (bool) {
    //     address[] memory validators = shardValidators[shardNumber];
    //     for (uint i = 0; i < validators.length; i++) {
    //         if (validators[i] == validator) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

     uint [][]  _map;
    
    //Evidence e=new Evidence();
    function getBlocks() public{
        for(uint i=1;i<6;i++){
            _map.push();
            for(uint j=1;j<6;j++){
                // if(e.getBlockNumber(i,j)==0)
                    // break;
                // _map[i][j] = e.getBlockNumber(i,j);
                //_map[i][j] = i*10+j;
                _map[_map.length-1].push(i*10+j);
            }
        }
    }

    function getArray() public view returns (uint[][] memory) {
        return _map;
    }

    
    // function random(uint max) public view returns (uint) {
    //     return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % max;
    // }

    uint private nonce = 0;

    function random(uint max) public returns (uint) {
        uint randomnumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % max;
        nonce++;
        return randomnumber;
    } 

    function assignBlocks() public  {
        
        for(uint i=0;i<5;i++){
            for(uint j=0;j<5;j++){
                // if(e.getBlockNumber(i,j)==0)
                    // break;
                // _map[i][j] = e.getBlockNumber(i,j);
                for(uint i=0;i<10;i++)
                {

                }
                uint shardNo=random(shardCount);
                uint vNo=random(s[shardNo].shardSize);
                
                s[shardNo].v[vNo].blockNo.push(_map[i][j]);

            }
        }
    }

    uint []  array;
    function rebalanceNodes() public {
        
        for(uint i=0;i<s.length;i++)
        {
            for(uint j=0;j<s[i].shardSize;j++)
            {
                while(s[i].v[j].blockNo.length>1)
                {
                    array.push(s[i].v[j].blockNo[s[i].v[j].blockNo.length-1]);
                    s[i].v[j].blockNo.pop();
                }
            }
        }

        for(uint i=0;i<s.length;i++)
        {
            for(uint j=0;j<s[i].shardSize;j++)
            {
                if(s[i].v[j].blockNo.length==0)
                {
                    //array.push(s[i].v[j].blockNo[s[i].v[j].blockNo.length-1])
                    s[i].v[j].blockNo.push(array[array.length-1]);
                    array.pop();
                }
            }
        }
    
    }

     mapping (uint => uint) public Names;

       bool []b;
    function interShard() public returns (bool []memory){
       for(uint i=0;i<5;i++){
            mapping (uint => uint) storage l= Names;
                for(uint j=0;j<5;j++){
                    uint k=_map[i][j];

                    for(uint i=0;i<s.length;i++)
                    {
                        for(uint j=0;j<s[i].shardSize;j++)
                        {
                            if(s[i].v[j].blockNo[0]==k)
                            {
                                l[i]++;
                            }
                        }
                    }
            }
            b[i]=true;
            for(uint i=0;i<s.length;i++)
            {
                if(l[i]==5)
                {
                    b[i]=false;
                }
            }
       }
       return b;

    }

     mapping(uint => uint) public _map1;
     uint[] public keys1;
     mapping(uint => uint) public _map2;
     uint[] public keys2;

    function DPOS() public returns(uint[] memory) {

        for(uint i=0;i<5;i++){
            _map1[i+1]=_map[i].length;
            keys1.push(i+1);
        }

        for (uint i = 0; i < keys1.length; i++) {
            for (uint j = i + 1; j < keys1.length; j++) {
                if (_map1[keys1[i]] < _map1[keys1[j]]) {
                    uint temp = keys1[i];
                    keys1[i] = keys1[j];
                    keys1[j] = temp;
                }
            }
        }

        uint candidates=keys1.length/3;
        uint voters=keys1.length-candidates;

        for(uint i=voters+1;i<keys1.length;i++)
        {
            keys2.push(i);
        }

        for(uint i=0;i<voters;i++)
        {
            _map2[random(candidates)+voters+1]++;
        }

        for (uint i = 0; i < keys2.length; i++) {
            for (uint j = i + 1; j < keys2.length; j++) {
                if (_map2[keys2[i]] < _map2[keys2[j]]) {
                    uint temp = keys2[i];
                    keys2[i] = keys2[j];
                    keys2[j] = temp;
                }
            }
        }

        for(uint i=1;i<voters+1;i++)
        {
            keys2.push(i);
        }

        return keys2;    
    }
}