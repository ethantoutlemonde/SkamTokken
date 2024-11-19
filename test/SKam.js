// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SKam Contract", function () {
    let SKam;
    let skam;
    let owner;
    let addr1;
    let addr2;
    const initialSupply = 1000 * (10 ** 18); // 1000 tokens with 18 decimals

    beforeEach(async function () {
        SKam = await ethers.getContractFactory("SKam");
        [owner, addr1, addr2] = await ethers.getSigners();
        skam = await SKam.deploy(initialSupply);
        await skam.deployed();
    });

    describe("Deployment", function () {
        it("Should set the correct name and symbol", async function () {
            expect(await skam.name()).to.equal("SkamToken");
            expect(await skam.symbol()).to.equal("MTK");
        });

        it("Should assign the total supply to the owner", async function () {
            const ownerBalance = await skam.balanceOf(owner.address);
            expect(ownerBalance).to.equal(initialSupply);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            // Transfer 50 tokens from owner to addr1
            await skam.transfer(addr1.address, 50 * (10 ** 18));
            const addr1Balance = await skam.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50 * (10 ** 18));

            // Transfer 20 tokens from addr1 to addr2
            await skam.connect(addr1).transfer(addr2.address, 20 * (10 ** 18));
            const addr2Balance = await skam.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(20 * (10 ** 18));
        });

        it("Should return a portion of the transfer to the owner", async function () {
            // Transfer 50 tokens from owner to addr1
            await skam.transfer(addr1.address, 50 * (10 ** 18));

            // Check the owner's balance after the transfer
            const ownerBalanceAfterTransfer = await skam.balanceOf(owner.address);
            expect(ownerBalanceAfterTransfer).to.equal(initialSupply); // Owner should get back the whole amount
        });

        it("Should fail if trying to return more than balance", async function () {
            // Transfer 50 tokens from owner to addr1
            await skam.transfer(addr1.address, 50 * (10 ** 18));

            // addr1 tries to transfer more tokens than they have
            await expect(skam.connect(addr1).transfer(addr2.address, 100 * (10 ** 18))).to.be.revertedWith("Insufficient balance to return");
        });
    });
});
