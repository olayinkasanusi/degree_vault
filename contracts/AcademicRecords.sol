// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcademicRecords {
    address public owner;
    
    struct Record {
        address institution;
        address student;
        string recordType;
        string metadata;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(string => Record) public records;
    mapping(address => bool) public authorizedInstitutions;
    mapping(address => string[]) public studentRecords;
    
    event RecordIssued(
        address indexed institution,
        address indexed student,
        string recordHash,
        uint256 timestamp
    );
    
    event InstitutionAuthorized(address indexed institution);
    event InstitutionRevoked(address indexed institution);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAuthorizedInstitution() {
        require(
            authorizedInstitutions[msg.sender] || msg.sender == owner,
            "Only authorized institutions can issue records"
        );
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedInstitutions[msg.sender] = true;
    }
    
    function addAuthorizedInstitution(address institution) external onlyOwner {
        authorizedInstitutions[institution] = true;
        emit InstitutionAuthorized(institution);
    }
    
    function removeAuthorizedInstitution(address institution) external onlyOwner {
        authorizedInstitutions[institution] = false;
        emit InstitutionRevoked(institution);
    }
    
    function issueRecord(
        address student,
        string memory recordHash,
        string memory recordType,
        string memory metadata
    ) external onlyAuthorizedInstitution {
        require(!records[recordHash].exists, "Record already exists");
        require(student != address(0), "Invalid student address");
        require(bytes(recordHash).length > 0, "Record hash cannot be empty");
        
        records[recordHash] = Record({
            institution: msg.sender,
            student: student,
            recordType: recordType,
            metadata: metadata,
            timestamp: block.timestamp,
            exists: true
        });
        
        studentRecords[student].push(recordHash);
        
        emit RecordIssued(msg.sender, student, recordHash, block.timestamp);
    }
    
    function verifyRecord(string memory recordHash) 
        external 
        view 
        returns (
            bool exists,
            address institution,
            address student,
            uint256 timestamp
        ) 
    {
        Record memory record = records[recordHash];
        return (
            record.exists,
            record.institution,
            record.student,
            record.timestamp
        );
    }
    
    function getRecordDetails(string memory recordHash)
        external
        view
        returns (
            address institution,
            address student,
            string memory recordType,
            string memory metadata,
            uint256 timestamp,
            bool exists
        )
    {
        Record memory record = records[recordHash];
        return (
            record.institution,
            record.student,
            record.recordType,
            record.metadata,
            record.timestamp,
            record.exists
        );
    }
    
    function getStudentRecords(address student) 
        external 
        view 
        returns (string[] memory) 
    {
        return studentRecords[student];
    }
    
    function getStudentRecordCount(address student) 
        external 
        view 
        returns (uint256) 
    {
        return studentRecords[student].length;
    }
    
    function isAuthorizedInstitution(address institution) 
        external 
        view 
        returns (bool) 
    {
        return authorizedInstitutions[institution];
    }
}
