// require("@nomicfoundation/hardhat-toolbox");


// module.exports = {
//   solidity: "0.8.24",
//   networks: {
//     hardhat: {},
//     sepolia: {
//       url: "https://eth-sepolia.g.alchemy.com/v2/JNHFxYFCLQVIyE_0-0MrZps0mO0TJVWk",
//       accounts: ["513caeae55f94ac1a6c04248d568fff86ef197650a29fe836ddc8030a03afe71"], 
//       gasPrice: 100000000000000000000000000,
//     }
//   },
//   etherscan: {
//     apiKey: "JNHFxYFCLQVIyE_0-0MrZps0mO0TJVWk", // Your Etherscan API key here
//   },
// };
// //npx hardhat run scripts/deploy.js --network sepolia
require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: {
    version: "0.8.8", // Match the pragma version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337, // Local Hardhat network chain ID
      name: "hardhat",
    },
  },
};

