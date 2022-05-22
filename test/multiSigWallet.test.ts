/* eslint-disable no-unused-vars */
import { ethers } from "hardhat";
// eslint-disable no-unused-vars
import chai, { expect, use } from "chai";
import {
  deployContract,
  loadFixture,
  MockProvider,
  solidity,
} from "ethereum-waffle";
import MultiSigWalletJSON from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";
import { Wallet } from "ethers";

chai.use(solidity);

describe("Testing Multi Sig Wallets", function () {
  const provider = new MockProvider();
  const [msWallet, alice, bob, charlie, dana, erika, fawn] =
    provider.getWallets();
  async function fixture(
    [msWallet, alice, bob, charlie, dana, erika, fawn]: Wallet[],
    provider: MockProvider
  ) {
    const multiSigWallet = await deployContract(msWallet, MultiSigWalletJSON, [
      [
        alice.address,
        bob.address,
        charlie.address,
        dana.address,
        erika.address,
        fawn.address,
      ],
      4,
    ]);
    return { multiSigWallet, msWallet, alice, bob, charlie, dana, erika, fawn };
  }

  it("Testing if constructor worked properly", async function () {
    const { multiSigWallet, msWallet, alice, bob, charlie, dana, erika, fawn } =
      await loadFixture(fixture);

    expect(await multiSigWallet.numConfirmationsRequired()).to.equal(4);
    expect(await multiSigWallet.owners(1)).to.equal(bob.address);

    await expect(
      deployContract(msWallet, MultiSigWalletJSON, [
        [
          alice.address,
          bob.address,
          charlie.address,
          dana.address,
          erika.address,
          fawn.address,
        ],
        8,
      ])
    ).to.be.revertedWith("num confirmations reqd invalid");
    await expect(
      deployContract(msWallet, MultiSigWalletJSON, [
        [alice.address, bob.address, charlie.address, charlie.address],
        2,
      ])
    ).to.be.revertedWith("owner present");
  });

  it("something", async function () {
    const { multiSigWallet } = await loadFixture(fixture);
    const [owner] = await ethers.getSigners();
    await expect(
      owner.call({
        to: multiSigWallet.address,
        value: ethers.utils.parseEther("1"),
      })
    ).to.emit(multiSigWallet, "Deposit");
  });
});