// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <=0.9.0;
pragma experimental ABIEncoderV2;

contract Evidence {
   uint noOfCases;
   constructor ()public{
      noOfCases=0;
   }
   struct CaseInfo{
      uint docId;
      string baseAdd;
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
            allCases[caseId].noOfDocs++;
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

   function getEvidenceInfo(uint caseId,uint docId) public view returns(uint,uint,string memory){
      if(caseId!=0 && allCases[caseId].caseId==caseId){
         if(docId!=0 && allCases[caseId].allDocs[docId].docId==docId){
               return (allCases[caseId].caseId,
            allCases[caseId].allDocs[docId].docId,  
            allCases[caseId].allDocs[docId].baseAdd);
         }
         else{
            return(0,0,"DocID doesn't Exist");
         }
      }
      else{
         return(0,0,"CaseID doesn't Exist");
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
}

