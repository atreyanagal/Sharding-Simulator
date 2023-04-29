// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.21 <=0.9.0;
pragma experimental ABIEncoderV2;


contract userStorage {
    struct User {
        uint256 id;
        string name;
        string role;
        uint256 age;
        string password;
        string email;
        uint256[] createdCases;
        uint256[] onChainCases;
        uint256[] ownershipCases;
    }

    mapping(uint256 => User) users;
    uint256 public noOfUsers = 0;

    event createUser(string message, uint256);

    function register(string memory _name,string memory _role,uint256 _age,string memory _password,string memory _email) public {
        uint256[] memory array1;
        noOfUsers++;
        users[noOfUsers].id=noOfUsers;
        users[noOfUsers].name=_name;
        users[noOfUsers].role=_role;
        users[noOfUsers].age=_age;
        users[noOfUsers].password=_password;
        users[noOfUsers].email=_email;
        users[noOfUsers].createdCases=array1;
        users[noOfUsers].onChainCases=array1;
        users[noOfUsers].ownershipCases=array1;
        emit createUser("User Created", noOfUsers);
    }

    function login(uint256 _id,string memory _email,string memory _password) public view returns (string memory) {
        if (_id > 0 && users[_id].id == _id) {
            if (bytes(_email).length != bytes(users[_id].email).length) {
                return ("Invalid Email");
            }

            if (uint(keccak256(abi.encodePacked(_email))) != uint(keccak256(abi.encodePacked(users[_id].email)))) {
                return ("Invalid Email");
            }

            if (bytes(_password).length != bytes(users[_id].password).length) {
                return ("Invalid Password");
            }

            if (uint(keccak256(abi.encodePacked(_password))) != uint(keccak256(abi.encodePacked(users[_id].password)))) {
                return ("Invalid Password");
            }

            return ("Logged in");
        } else {
            return ("Invalid ID");
        }
    }

    function getUserDetails(uint256 _id) public view returns (User memory) {
        return (users[_id]);
    }
    function getCreatedCases(uint256 _id) public view returns (uint256 [] memory) {
        return (users[_id].createdCases);
    }
    function getOnChainCases(uint256 _id) public view returns (uint256 [] memory) {
        return (users[_id].onChainCases);
    }
    function getOwnershipCases(uint256 _id) public view returns (uint256 [] memory) {
        return (users[_id].ownershipCases);
    }

    // function readName(uint256 _id) public view returns (string memory) {
    //     if (_id > 0 && users[_id].id == _id) {
    //         return (users[_id].name);
    //     } else {
    //         return ("null");
    //     }
    // }

    // function readJob(uint256 _id) public view returns (string memory) {
    //     if (_id > 0 && users[_id].id == _id) {
    //         return (users[_id].role);
    //     } else {
    //         return ("null");
    //     }
    // }

    // function readAge(uint256 _id) public view returns (uint256) {
    //     if (_id > 0 && users[_id].id == _id) {
    //         return (users[_id].age);
    //     } else {
    //         // return ("null");
    //         return (0);
    //     }
    // }

    // function readEmail(uint256 _id) public view returns (string memory) {
    //     if (_id > 0 && users[_id].id == _id) {
    //         return (users[_id].email);
    //     } else {
    //         return ("null");
    //     }
    // }

    event appendChain(string message);
    function appendIntoChain(uint256 _senderId,uint256 _receiverId,uint256 _caseId) public {
        if (_senderId > 0 && users[_senderId].id == _senderId) {
            for (uint256 i = 0; i < users[_senderId].createdCases.length; i++) {
                if (users[_senderId].createdCases[i] == _caseId) {
                    if (_receiverId > 0 && users[_receiverId].id == _receiverId) {
                        if (_caseId > 0) {
                            users[_receiverId].onChainCases.push(_caseId);
                            emit appendChain("You are in authenticated network");
                            return;
                        } else {
                            emit appendChain("Case ID is invalid");
                            return;
                        }
                    } else {
                        emit appendChain("User ID is invalid");
                        return;
                    }
                }
            }

            for (uint256 i = 0;i < users[_senderId].ownershipCases.length;i++) {
                if (users[_senderId].ownershipCases[i] == _caseId) {
                    if (_receiverId > 0 && users[_receiverId].id == _receiverId) {
                        if (_caseId > 0) {
                            users[_receiverId].onChainCases.push(_caseId);
                            emit appendChain("You are in authenticated network");
                            return;
                        } else {
                            emit appendChain("Case ID is invalid");
                            return;
                        }
                    } else {
                        emit appendChain("User ID is invalid");
                        return;
                    }
                }
            }

            emit appendChain("No ownership");
        } else {
            emit appendChain("Owner ID is Invalid");
        }
    }

    event createCaseInfo(string message);

    function createCase(uint256 _id, uint256 _caseId) public {
        if (_id > 0 && users[_id].id == _id) {
            if (_caseId > 0) {
                users[_id].createdCases.push(_caseId);
                users[_id].ownershipCases.push(_caseId);
                users[_id].onChainCases.push(_caseId);
                emit createCaseInfo("Case added to account");
            }
        }
    }

    event transferOwnerShipInfo(string message);

    function transferOwnerShip(uint256 _senderId,uint256 _receiverId,uint256 _caseId
    ) public {
        if (_senderId > 0 && users[_senderId].id == _senderId) {
            for (uint256 i = 0;i < users[_senderId].ownershipCases.length;i++) {
                if (users[_senderId].ownershipCases[i] == _caseId) {
                    if (_receiverId > 0 && users[_receiverId].id == _receiverId) {
                        if (_caseId > 0) {
                            users[_receiverId].ownershipCases.push(_caseId);
                            users[_senderId].ownershipCases[i] = users[_senderId].ownershipCases[users[_senderId].ownershipCases.length - 1];
                            users[_senderId].ownershipCases.pop();
                            emit transferOwnerShipInfo("OwnerShip Transferred");
                            return;
                        } else {
                            emit transferOwnerShipInfo("Case ID is invalid");
                            return;
                        }
                    } else {
                        emit transferOwnerShipInfo("User ID is invalid");
                        return;
                    }
                }
            }
            emit transferOwnerShipInfo("No ownership");
        } else {
            emit transferOwnerShipInfo("Owner ID is Invalid");
        }
    }

    // function updateName(uint256 _id, string memory _name) public {
    //     users[_id - 1].name = _name;
    // }

    // function updateJob(uint256 _id, string memory _job) public {
    //     users[_id - 1].role = _job;
    // }

    // function updateAge(uint256 _id, uint256 _age) public {
    //     users[_id - 1].age = _age;
    // }

    // function updateEmail(uint256 _id, string memory _email) public {
    //     users[_id - 1].name = _email;
    // }

    // function updateAllInfo(
    //     uint256 _id,
    //     string memory _name,
    //     string memory _job,
    //     uint256 _age,
    //     string memory _email
    // ) public {
    //     users[_id - 1].name = _name;
    //     users[_id - 1].role = _job;
    //     users[_id - 1].age = _age;
    //     users[_id - 1].email = _email;
    // }

    // function remove(uint256 _id) public {
    //     delete users[_id - 1];
    // }
}