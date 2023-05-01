// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <=0.9.0;
pragma experimental ABIEncoderV2;

contract Evidence {
   uint public noOfCases=0;
   uint public noOfDocss=0;
//    constructor ()public{
//       noOfCases=0;
//    }
   struct CaseInfo{
      uint docId;
      string baseAdd;
      uint blockNo;
   }
   struct Case{
      uint caseId;
      uint noOfDocs;
      string description;
      mapping(uint => CaseInfo) allDocs;
   }
   

   mapping(uint => Case) allCases;

   event CaseCreated(
        string message,
        uint caseId
   );

   function createCase(string memory _description)public{
      noOfCases++;
      allCases[noOfCases].caseId=noOfCases;
      allCases[noOfCases].description=_description;
      emit  CaseCreated("Succesfully created a Case",allCases[noOfCases].caseId);
   }
   
   event EvidenceCreated(
        string message
   );

   function insertEvidence(uint caseId,uint docId,string memory baseAdd)public {
      if(caseId!=0 && allCases[caseId].caseId==caseId){
         if(docId!=0 && allCases[caseId].allDocs[docId].docId!=docId){
            // if(bytes(baseAdd).length==0){
            //    emit EvidenceCreated("Cannot create empty Evidence");
            // }
            allCases[caseId].allDocs[docId].docId=docId;
            allCases[caseId].allDocs[docId].baseAdd=baseAdd;
            allCases[caseId].allDocs[docId].blockNo=block.number;
            allCases[caseId].noOfDocs++;
            noOfDocss++;
            emit EvidenceCreated("Evdience Added Successfully");
         }
         else{
            emit EvidenceCreated("Invalid DocID");
         }
      }
      else{
         emit EvidenceCreated("Invalid CaseID");
      }
   }

   function getEvidenceInfo(uint caseId,uint docId) public view returns(uint,uint,string memory,uint){
      if(caseId!=0 && allCases[caseId].caseId==caseId){
         if(docId!=0 && allCases[caseId].allDocs[docId].docId==docId){
               return (allCases[caseId].caseId,
            allCases[caseId].allDocs[docId].docId,  
            allCases[caseId].allDocs[docId].baseAdd,
            allCases[caseId].allDocs[docId].blockNo
            );
         }
         else{
            return(0,0,"DocID doesn't Exist",0);
         }
      }
      else{
         return(0,0,"CaseID doesn't Exist",0);
      }
      
   }


   function getCaseInfo(uint caseId) public view returns(string memory,uint,string memory,CaseInfo[] memory){
      if(caseId!=0 && allCases[caseId].caseId==caseId){
         if(allCases[caseId].noOfDocs==0){
            CaseInfo[] memory M;
            return("Case Exist but Evidences are not uploaded",caseId,"",M);
         }
         CaseInfo[] memory m=new CaseInfo[](allCases[caseId].noOfDocs);
         for(uint i = 1; i <=allCases[caseId].noOfDocs; i++) {
               m[i-1] = allCases[caseId].allDocs[i];
         }
         return("Successfully Fetched",caseId,allCases[caseId].description,m);
      }
      else{
         CaseInfo[] memory m;
         return("Invalid ID",0,"",m);
      }
   } 

   function getBlockNumber(uint caseId, uint docId) public view returns (uint) {
      if(caseId<= noOfCases && docId<=allCases[caseId].noOfDocs)
            return allCases[caseId].allDocs[docId].blockNo;
      return 0;
   }

   event noOfDOCS(uint);
   function getDocsCount() public {
      emit  noOfDOCS(noOfDocss);
   }




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
    event Shardss(Shard []);

    Shard ss;
    function setShardHash(uint shardNumber, bytes32 shardHash) public {
        require(shardNumber < shardCount);
        s.push(ss);
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
        validator memory vv;
        s[shardNumber].v.push(vv);
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
    
    function getBlocks() public{
        uint [] memory m;
        for(uint i=1;i<20;i++){
            _map.push(m);
            for(uint j=1;j<20;j++){
                if(getBlockNumber(i,j)==0)
                    break;
                _map[_map.length-1].push(getBlockNumber(i,j));
                //_map[i][j] = i*10+j;
                // _map[i-1][j-1] = e.getBlockNumber(i,j);
            }
            if(_map[_map.length-1].length==0)
                break;
        }
    }

    function getArray() public view returns (uint[][] memory) {
        return _map;
    }

    uint private nonce = 0;

    function random(uint max) public returns (uint) {
        uint randomnumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % max;
        nonce++;
        return randomnumber;
    } 

    function assignBlocks() public  {
        
        for(uint i=0;i<_map.length-1;i++){
            for(uint j=0;j<_map[i].length;j++){
                // if(e.getBlockNumber(i,j)==0)
                    // break;
                // _map[i][j] = e.getBlockNumber(i,j);
                for(uint k=0;k<10;k++)
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
                    s[i].v[j].blockNo.push(array[array.length-1]);
                    array.pop();
                }
            }
        }
    }

    mapping (uint => uint) public Names;

    bool []b;
    event InterShard(bool []);
    function interShard() public{
       for(uint i=0;i<_map.length-1;i++){
            mapping (uint => uint) storage l= Names;
                for(uint j=0;j<_map[i].length;j++){
                    uint k=_map[i][j];

                    for(uint w=0;w<s.length;w++)
                    {
                        for(uint x=0;x<s[w].shardSize;x++)
                        {
                            if(s[w].v[x].blockNo[0]==k)
                            {
                                l[w]++;
                            }
                        }
                    }
                }
            b.push(true);
            for(uint w=0;w<s.length;w++)
            {
                if(l[w]==5)
                {
                    b[i]=false;
                }
            }
       }
       emit InterShard(b);
    }

     mapping(uint => uint) public _map1;
     uint[] public keys1;
     mapping(uint => uint) public _map2;
     uint[] public keys2;

    event DPOS_Event(uint []);
    function DPOS() public{

        for(uint i=0;i<_map.length-1;i++){
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

        for(uint i=voters+1;i<=keys1.length;i++)
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

        emit DPOS_Event(keys2);
    }

    function setshardParameters(uint _shardCount, uint _shardSize) public{
        shardCount = _shardCount;
        shardSize = _shardSize;
        for(uint i=0;i<shardCount;i++){
            setShardHash(i, 0xa0ea57091e7f1d8d0c29ae04029d50d67440988ddd1bba093ef9281745d2c08c);
            for(uint j=0;j<shardSize;j++){
                addValidator(i, 0x9801689c36151683B789Ec22Fcd0b7fe9DBCc88e);
            }
        }
        getBlocks();
        assignBlocks();
        emit Shardss(s);
        rebalanceNodes();
        emit Shardss(s);
        interShard();
        DPOS();
    }

}