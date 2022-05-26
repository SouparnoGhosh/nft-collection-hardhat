/* eslint-disable node/no-unpublished-import */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
const { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } = require("../constants");

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  const deployedCryptoDevsContract = await deploy("CryptoDevs", {
    // <-- name of the deployment
    contract: "CryptoDevs", // <-- name of the contract/artifact(more specifically) to deploy
    from: deployer, // <-- account to deploy from
    args: [METADATA_URL, WHITELIST_CONTRACT_ADDRESS], // <-- contract constructor arguments. Here it has nothing
    log: true, // <-- log the address and gas used in the console
  });
  log(`Contract deployed at ${deployedCryptoDevsContract.address}`);
};

export default func;
func.tags = ["CryptoDevs"];
