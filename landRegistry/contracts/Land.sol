// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract Land {
    address public contractOwner;

    constructor() {
        contractOwner = msg.sender;
    }

    struct LandInspector {
        uint id;
        address addr;
        string name;
        uint age;
        string designation;
        string city;
    }

    struct User {
        address id;
        string name;
        uint age;
        string city;
        string aadharNumber;
        string panNumber;
        string document;
        string email;
        bool isUserVerified;
    }

    struct LandRequest {
        uint reqId;
        address payable sellerId;
        address payable buyerId;
        uint landId;
        reqStatus requestStatus;
        bool isPaymentDone;
    }

    struct LandReg {
        uint id;
        uint area;
        string landAddress;
        uint landPrice;
        string allLatitudeLongitude;
        uint propertyPID;
        string physicalSurveyNumber;
        string document;
        bool isForSell;
        address payable ownerAddress;
        bool isLandVerified;
    }

    enum reqStatus {requested, accepted, rejected, paymentdone, completed}

    uint inspectorCount;
    uint public userCount;
    uint public landsCount;
    uint public documentId;
    uint requestCount;
   // address[] public allLandInspectorList; // new added
  // mapping(uint => bool) public landVerificationStatus; //new added pending

    mapping(address => LandInspector) public InspectorMapping;
    address[] public allLandInspectorList;
    mapping(address => bool) RegisteredInspectorMapping;
    mapping(address => User) public UserMapping;
    address[] public allUsersList;
    mapping(address => bool) RegisteredUserMapping;
    mapping(address => uint[]) MyLand;
    mapping(uint => LandReg) public lands;
    mapping(uint => LandRequest) public landRequestMapping;
    mapping(address => uint[]) MyReceivedLandRequest;
    mapping(address => uint[]) MySentLandRequest;
    //new added
    mapping(uint => bool) public isPaymentMade;

    uint[] public allLandList;
     mapping(uint => uint[])  paymentDoneList;
    //new added
    event PaymentSuccessful(uint landId, address buyer, uint amount);

function getContractOwner() public view returns (address) {
    return contractOwner;
}

    // Checking contractOwner
    function isContractOwner(address _addr) public view returns (bool) {
        return (_addr == contractOwner);
    }

    // Change Contract Owner
    function changeContractOwner(address _addr) public {
        require(msg.sender != contractOwner, "You are not contract owner");
        contractOwner = _addr;
    }

    // LandInspector
    function addLandInspector(
             address _addr , 
             string memory _name,
             uint _age,
             string memory _designation,
             string memory _city
    ) public returns (bool) {
        require(contractOwner == msg.sender, "You are not the contract owner");
        RegisteredInspectorMapping[_addr] = true;
        inspectorCount++;
        allLandInspectorList.push(_addr);
        InspectorMapping[_addr] = LandInspector(inspectorCount, _addr, _name, _age, _designation, _city);
        return true;
    }

    // All land Inspector List
    function returnAllLandInspectorList() public view returns (LandInspector[] memory) {
        uint length = allLandInspectorList.length;
        LandInspector[] memory inspectors = new LandInspector[](length);

        for(uint i = 0; i < length ; i++){
            inspectors[i] = InspectorMapping[allLandInspectorList[i]];
        }
            return inspectors;

    }

    // Remove landInspector
    function removeLandInspector(address _addr) public {
        require(msg.sender == contractOwner, "You are not contract owner");
        require(RegisteredInspectorMapping[_addr], "Land Inspector not found");
        bool found = false;
        uint len = allLandInspectorList.length;

        for (uint i = 0; i < len; i++) {
            if (allLandInspectorList[i] == _addr) {
                allLandInspectorList[i] = allLandInspectorList[len - 1];
                allLandInspectorList.pop();
                found = true;
                break;
            }
        }

        if (found) {
            RegisteredInspectorMapping[_addr] = false;
        } else {
            revert("Inspector not found in the list");
        }
    }

    // isLandInspector
    function isLandInspector(address _id) public view returns (bool) {
        return RegisteredInspectorMapping[_id];
    }

    // User registration
    function isUserRegistered(address _addr) public view returns (bool) {
        return RegisteredUserMapping[_addr];
    }

    // User registration
    function registerUser(
        string memory _name,
        uint _age,
        string memory _city,
        string memory _aadharNumber,
        string memory _panNumber,
        string memory _document,
        string memory _email
    ) public {
        require(!RegisteredUserMapping[msg.sender], "User is already registered");
        userCount++;
        RegisteredUserMapping[msg.sender] = true;
        allUsersList.push(msg.sender);
        UserMapping[msg.sender] = User(msg.sender, _name, _age, _city, _aadharNumber, _panNumber, _document, _email, false);
    }

    // get single user data
   function getUser(address userAddress) public view returns (
    address id,
    string memory name,
    uint age,
    string memory city,
    string memory aadharNumber,
    string memory panNumber,
    string memory document,
    string memory email,
    bool isUserVerified
) {
    require(RegisteredUserMapping[userAddress], "User is not registered");

    User memory user = UserMapping[userAddress];
    return (
        user.id,
        user.name,
        user.age,
        user.city,
        user.aadharNumber,
        user.panNumber,
        user.document,
        user.email,
        user.isUserVerified
    );
}


    // Verify user
    function verifyUser(address _userId) public {
        require(isLandInspector(msg.sender), "Only inspectors can verify users");
        UserMapping[_userId].isUserVerified = true;
    }

    function isUserVerified(address id) public view returns (bool) {
        return UserMapping[id].isUserVerified;
    }

    // Return all users
    function returnAllUserList() public view returns (User[] memory) {
        User[] memory userList = new User[](allUsersList.length);
          for (uint256 i = 0; i < allUsersList.length; i++) {
            userList[i] = UserMapping[allUsersList[i]];
          }
            return userList;
    }

    // Land registration
    function addLand(
        uint _area,
        string memory _landAddress,
        uint _landPrice,
        string memory _allLatiLongi,
        uint propertyPID,
        string memory _surveyNumber,
        string memory _document
    ) public {
        require(isUserVerified(msg.sender), "User must be verified to add land");
        landsCount++;
        lands[landsCount] = LandReg(
            landsCount, 
            _area, 
            _landAddress, 
            _landPrice, 
            _allLatiLongi, 
            propertyPID, 
            _surveyNumber, 
            _document, 
            false, 
            payable(msg.sender), 
            false
        );
        MyLand[msg.sender].push(landsCount);
        allLandList.push(landsCount);
    }

    // Return all land
    function returnAllLandList() public view returns (uint[] memory) {
        return allLandList;
    }

    // my lands
    function myAllLands(address id) public view returns (uint[] memory) {
    return MyLand[id]; 
}
    // make it for sell
    function makeItforSell(uint id) public {
    require(lands[id].ownerAddress == msg.sender, "Only the owner can sell this land");
    require(lands[id].id == id, "Invalid land ID"); // Ensure land exists
    lands[id].isForSell = true;
}
    // get land details
//     function getLandDetails(uint landId) public view returns (
//     uint, uint, string memory, uint, string memory, uint, string memory, bool, address, bool
// ) {
//     LandReg storage land = lands[landId]; // Keep this as storage

//     return (
//         land.id,
//         land.area,
//         land.landAddress,
//         land.landPrice,
//         land.allLatitudeLongitude,
//         land.propertyPID,
//         land.physicalSurveyNumber,
//         land.isForSell,
//         land.ownerAddress,
//         land.isLandVerified
//     );
// }

function getLandDetails(uint landId) public view returns (
    uint, uint, string memory, uint, string memory, uint, string memory, bool, address, bool, string memory
) {
    LandReg storage land = lands[landId]; // Keep this as storage

    return (
        land.id,
        land.area,
        land.landAddress,
        land.landPrice,
        land.allLatitudeLongitude,
        land.propertyPID,
        land.physicalSurveyNumber,
        land.isForSell,
        land.ownerAddress,
        land.isLandVerified,
        land.document 
    );
}



    // Verify land
    // function verifyLand(uint _id) public {
    //     require(isLandInspector(msg.sender), "Only inspectors can verify land");
    //     lands[_id].isLandVerified = true;
    // }
    function verifyLand(uint _id) public{
        require(isLandInspector(msg.sender), "Only inspectors can verify land");
        lands[_id].isLandVerified = true;
    }
//     function verifyLand(uint _id) public {
//     require(isLandInspector(msg.sender), "Only inspectors can verify land");
//     lands[_id].isLandVerified = true;
//     landVerificationStatus[_id] = true; // Mark as verified
// }
//     function verifyLand(uint _id) public {
//     // Ensure the land exists and is not already verified
//     require(lands[_id].id == _id, "Land does not exist");
//     require(lands[_id].isLandVerified == false, "Land is already verified");

//     // Ensure only a registered inspector can verify land
//     require(isLandInspector(msg.sender), "Only inspectors can verify land");

//     // Verify the land
//     lands[_id].isLandVerified = true;
// }


    function isLandVerified(uint id) public view returns (bool) {
        return lands[id].isLandVerified;
    }

    // Make land for sell
    function makeLandForSell(uint id) public {
        require(lands[id].ownerAddress == msg.sender, "Only the owner can sell the land");
        lands[id].isForSell = true;
    }

    // Request for buying
    function requestForBuy(uint _landId) public {
        require(isUserVerified(msg.sender) && isLandVerified(_landId), "User or land not verified");
        requestCount++;
        landRequestMapping[requestCount] = LandRequest(
            requestCount,
            payable(lands[_landId].ownerAddress),
            payable(msg.sender),
            _landId,
            reqStatus.requested,
            false
        );
        MyReceivedLandRequest[lands[_landId].ownerAddress].push(requestCount);
        MySentLandRequest[msg.sender].push(requestCount);
    }

    function myReceivedLandRequests() public view returns (uint[] memory) {
        return MyReceivedLandRequest[msg.sender];
    }

    function mySentLandRequests() public view returns (uint[] memory) {
        return MySentLandRequest[msg.sender];
    }

    function acceptRequest(uint _requestId) public {
        require(landRequestMapping[_requestId].sellerId == msg.sender, "Only seller can accept the request");
        landRequestMapping[_requestId].requestStatus = reqStatus.accepted;
    }

    function rejectRequest(uint _requestId) public {
        require(landRequestMapping[_requestId].sellerId == msg.sender, "Only seller can reject the request");
        landRequestMapping[_requestId].requestStatus = reqStatus.rejected;
    }
     function requestStatus(uint id) public view returns(bool)
    {
        return landRequestMapping[id].isPaymentDone;
    }

    function landPrice(uint id) public view returns(uint)
    {
        return lands[id].landPrice;
    }



 function makePayment(uint _requestId) public payable
    {
        require(landRequestMapping[_requestId].buyerId==msg.sender && landRequestMapping[_requestId].requestStatus==reqStatus.accepted);

        landRequestMapping[_requestId].requestStatus=reqStatus.paymentdone;
        //LandRequestMapping[_requestId].sellerId.transfer(lands[LandRequestMapping[_requestId].landId].landPrice);
        //lands[LandRequestMapping[_requestId].landId].ownerAddress.transfer(lands[LandRequestMapping[_requestId].landId].landPrice);
        lands[landRequestMapping[_requestId].landId].ownerAddress.transfer(msg.value);
        landRequestMapping[_requestId].isPaymentDone=true;
        paymentDoneList[1].push(_requestId);
    }

    function returnPaymentDoneList() public view returns(uint[] memory)
    {
        return paymentDoneList[1];
    }
    function transferOwnerShip(uint _requestId , string memory documentUrl) public returns(bool){
          require(isLandInspector(msg.sender));
            if(landRequestMapping[_requestId].isPaymentDone==false)
                return false;
            documentId++;
            landRequestMapping[_requestId].requestStatus=reqStatus.completed;
            MyLand[landRequestMapping[_requestId].buyerId].push(landRequestMapping[_requestId].landId);

            uint len=MyLand[landRequestMapping[_requestId].sellerId].length;
        for(uint i=0;i<len;i++)
        {
            if(MyLand[landRequestMapping[_requestId].sellerId][i]==landRequestMapping[_requestId].landId)
            {
                MyLand[landRequestMapping[_requestId].sellerId][i]=MyLand[landRequestMapping[_requestId].sellerId][len-1];
                //MyLands[LandRequestMapping[_requestId].sellerId].length--;
                MyLand[landRequestMapping[_requestId].sellerId].pop();
                break;
            }
        }
        lands[landRequestMapping[_requestId].landId].document=documentUrl;
        lands[landRequestMapping[_requestId].landId].isForSell=false;
        lands[landRequestMapping[_requestId].landId].ownerAddress=landRequestMapping[_requestId].buyerId;
        return true;
    }
 

    // Smart Contract (Solidity)
// function getPaymentDoneList() public view returns (uint[] memory) {
//     return paymentDoneList;
// }

//     function makePaymentTestFun(uint _landId, address payable _receiver) public payable {
//     require(msg.value > 0, "Payment must be greater than zero");
//     require(!isPaymentMade[_landId], "Payment already done for this land");

//     _receiver.transfer(msg.value);

//     isPaymentMade[_landId] = true; // Update payment status
//     paymentDoneList.push(_landId); // Store the land ID of completed payments

//     emit PaymentSuccessful(_landId, msg.sender, msg.value); // Emit event
// }




}