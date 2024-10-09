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
    uint[] public allLandList;
    uint[] public paymentDoneList;

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
        address _addr, 
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
    function returnAllLandInspectorList() public view returns (address[] memory) {
        return allLandInspectorList;
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

    // Verify user
    function verifyUser(address _userId) public {
        require(isLandInspector(msg.sender), "Only inspectors can verify users");
        UserMapping[_userId].isUserVerified = true;
    }

    function isUserVerified(address id) public view returns (bool) {
        return UserMapping[id].isUserVerified;
    }

    // Return all users
    function returnAllUserList() public view returns (address[] memory) {
        return allUsersList;
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

    // Verify land
    function verifyLand(uint _id) public {
        require(isLandInspector(msg.sender), "Only inspectors can verify land");
        lands[_id].isLandVerified = true;
    }

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
     function makePaymentTestFun(address payable _reveiver) public payable
    {
        _reveiver.transfer(msg.value);
    }




}