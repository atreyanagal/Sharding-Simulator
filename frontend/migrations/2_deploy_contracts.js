const Evidence = artifacts.require("./evidence.sol");
const User = artifacts.require("./userStorage.sol");
const Sharding = artifacts.require("./sharding.sol");

module.exports = function(deployer) {
  deployer.deploy(Evidence);
  deployer.deploy(User);
  deployer.deploy(Sharding);
};
