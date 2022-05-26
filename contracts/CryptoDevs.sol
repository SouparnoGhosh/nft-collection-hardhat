//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

contract CryptoDevs is ERC721Enumerable, Ownable {
    string public _baseTokenURI;
    uint256 public price = 0.01 ether;
    bool private _paused;
    uint256 public maxTokenIds = 20;
    uint256 public tokenIds;
    IWhitelist public whitelist;
    bool public presaleStarted;
    uint256 public presaleEnded;

    modifier onlyWhenNotPaused() {
        require(!_paused, "Minting is Paused");
        _;
    }

    constructor(string memory baseURI, address whitelistContract)
        ERC721("CryptoDevs", "CD")
    {
        _baseTokenURI = baseURI;
        whitelist = IWhitelist(whitelistContract);
    }

    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    function startPresale() public onlyOwner {
        presaleStarted = true;
        // solhint-disable-next-line not-rely-on-time
        presaleEnded = block.timestamp + 5 minutes;
    }

    function presaleMint() public payable onlyWhenNotPaused {
        require(
            //solhint-disable-next-line not-rely-on-time
            presaleStarted && presaleEnded <= block.timestamp,
            "Presale not running"
        );
        require(
            whitelist.whitelistedAddresses(msg.sender),
            "You are not whitelisted"
        );
        require(tokenIds <= maxTokenIds, "Max CD supply limit reached");
        require(msg.value >= price, "Insufficient ether sent");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    function mint() public payable onlyWhenNotPaused {
        require(
            //solhint-disable-next-line not-rely-on-time
            presaleStarted && presaleEnded >= block.timestamp,
            "Presale running"
        );
        require(tokenIds <= maxTokenIds, "Max CD supply limit reached");
        require(msg.value >= price, "Insufficient ether sent");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    function withdraw() external onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        // solhint-disable-next-line avoid-low-level-calls
        (bool success, ) = _owner.call{value: amount}("");
        require(success, "Ether not sent");
    }

    //solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    fallback() external payable {}
}
