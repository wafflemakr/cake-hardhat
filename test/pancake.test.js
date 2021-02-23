const IPancakeRouter02 = artifacts.require("IPancakeRouter02");
const IERC20 = artifacts.require("IERC20");

const CAKE_ROUTER = "0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F";
const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const BUSD_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56";

const hre = require("hardhat");
const {
  time,
  constants: { ZERO_ADDRESS },
} = require("@openzeppelin/test-helpers");

const ACCOUNT = "0xB1256D6b31E4Ae87DA1D56E5890C66be7f1C038e";

// Helpers
const toWei = (value) => String(web3.utils.toWei(String(value)));
const fromWei = (value) => Number(web3.utils.fromWei(String(value)));

// Traditional Truffle test
contract("Router", () => {
  let cakeRouter;

  before(async function () {
    cakeRouter = await IPancakeRouter02.at(CAKE_ROUTER);

    // Unlock account in forked mainnet
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [ACCOUNT],
    });
  });

  it("Should swap ETH for DAI", async function () {
    const busdToken = await IERC20.at(BUSD_ADDRESS);
    const initialBalance = await busdToken.balanceOf(ACCOUNT);

    const timestamp = await time.latest();
    const tx = await cakeRouter.swapETHForExactTokens(
      web3.utils.toWei("100"),
      [WBNB_ADDRESS, BUSD_ADDRESS],
      ACCOUNT,
      timestamp + 3600,
      { from: ACCOUNT, value: web3.utils.toWei("1") }
    );
    console.log("\tGas Used:", tx.receipt.gasUsed);

    const finalBalance = await busdToken.balanceOf(ACCOUNT);

    assert(fromWei(finalBalance) > fromWei(initialBalance));
  });
});
