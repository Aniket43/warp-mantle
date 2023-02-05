pragma solidity ^0.8.11;

contract HistoryManager{
    struct History{
      address sender;
      string filecid;
      string fileName;
      string time;
    }

    mapping (address => History[]) warpUserHistory;
    mapping (address => uint) count;

    function pushToHistory(address reciever, string memory filecid, string memory fileName, string memory time) public{
        warpUserHistory[reciever].push(History(msg.sender,filecid,fileName,time));
        count[reciever] += 1;
    }

    function getUserHistory(address user, uint key) public view returns(address, string memory, string memory, string memory){
        return (warpUserHistory[user][key].sender, warpUserHistory[user][key].filecid, warpUserHistory[user][key].fileName, warpUserHistory[user][key].time);
    }

   function getRecieverHistoryCount(address user) public view returns(uint){
       return count[user];
   }

}

