const Evidence = artifacts.require("./evidence.sol");
const User = artifacts.require("./userStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(Evidence);
  deployer.deploy(User);
};
