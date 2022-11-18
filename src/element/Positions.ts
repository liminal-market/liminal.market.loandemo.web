import {Liquid} from 'liquidjs';
import PositionsHtml from '../html/positions.html';
import {BigNumber, Contract, ContractInterface, ethers} from "ethers";
import ContractInfo from "../contracts/ContractInfo";
import {liminalMarketAbi, loanContractAbi, priceFeedContractsAbi, securityTokenAbi, usdsContractAbi} from "../abi/Abis";
import {formatEther, parseUnits} from "ethers/lib/utils";

declare var window: any

export default class Positions {
    priceFeedContracts?: Contract;

    public async render(address2: string, positions: any) {
        let main = document.getElementById('main')!;
        const engine = new Liquid();
        let template = engine.parse(PositionsHtml);
        main.innerHTML = await engine.render(template, {positions});

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        let contractInfo = ContractInfo.getContractInfo();

        let totalValueStaked = BigNumber.from('0')
        const loanContract = new ethers.Contract(contractInfo.LoanContract, loanContractAbi, signer)
        this.priceFeedContracts = new ethers.Contract(contractInfo.PriceFeedContracts, priceFeedContractsAbi, signer)
        for (let i = 0; i < positions.length; i++) {

            let stakingInfo = await loanContract.getStakingInfo(address, positions[i].symbol.id)
                .catch((reason: any) => {
                    console.log('catch', reason);
                });
            if (stakingInfo) {
                let stakedSymbolElement = document.getElementById('staked_' + positions[i].symbol.id);
                if (stakedSymbolElement) stakedSymbolElement.innerHTML = formatEther(stakingInfo.quantity);
                let latestPrice = await this.getLatestPrice(positions[i].symbol.id);
                let stakedValue = stakingInfo.quantity.mul(latestPrice);
                console.log('stakedValue', stakedValue.toString());
                totalValueStaked = totalValueStaked.add(stakedValue);
            }
        }
        totalValueStaked = totalValueStaked.div(BigNumber.from('1' + '0'.repeat(18)));

        const usdsContract = new ethers.Contract(contractInfo.USDS, usdsContractAbi, signer);
        let loanAmount = await loanContract.getLoan(address);
        let mintUpTo = totalValueStaked.sub(loanAmount);

        console.log('mintUpTo', mintUpTo.toString());
        document.getElementById('mintUpTo')!.innerHTML = formatEther(mintUpTo)
        document.getElementById('current_loan')!.innerHTML = formatEther(loanAmount)

        let stakeButtons = document.querySelectorAll('.stake');
        stakeButtons.forEach((btn) => {
            btn.addEventListener('click', async (evt) => {
                let symbol = (evt.target as HTMLButtonElement).dataset['symbol'];
                let inputQty = document.getElementById('qty_' + symbol) as HTMLInputElement;
                const qty = ethers.utils.parseUnits(inputQty.value, 18);


                const liminalMarket = new ethers.Contract(contractInfo.LiminalMarket, liminalMarketAbi, signer);
                let tokenAddress = await liminalMarket.getSecurityToken(symbol);
                console.log('symbol address', tokenAddress);

                let stakingInfo = await loanContract.getStakingInfo(address, symbol);

                let neededAllowance = qty.add(stakingInfo.quantity)

                const securityToken = new ethers.Contract(tokenAddress, securityTokenAbi, signer);
                let allowance = await securityToken.allowance(address, contractInfo.LoanContract);
                console.log('allowance', allowance.toString());
                if (neededAllowance.gt(allowance)) {
                    await securityToken.approve(contractInfo.LoanContract, neededAllowance);
                }


                let tx = await loanContract.stake(symbol, qty);
                console.log(tx);
                await tx.wait();
                this.render(address, positions);

            })
        })

        let unstakeButtons = document.querySelectorAll('.unstake');
        unstakeButtons.forEach((btn) => {
            btn.addEventListener('click', async (evt) => {
                let symbol = (evt.target as HTMLButtonElement).dataset['symbol'];
                let inputQty = document.getElementById('qty_' + symbol) as HTMLInputElement;
                const qty = ethers.utils.parseUnits(inputQty.value, 18);

                const liminalMarket = new ethers.Contract(contractInfo.LiminalMarket, liminalMarketAbi, signer);
                let tokenAddress = await liminalMarket.getSecurityToken(symbol);
                console.log('symbol address', tokenAddress);

                let tx = await loanContract.unstake(symbol, qty);
                console.log(tx);
                await tx.wait();
                this.render(address, positions);
            })
        })


        let mint = document.getElementById('mint');
        mint?.addEventListener('click', async (evt) => {
            evt.preventDefault();
            let mint_amount = (document.getElementById('mint_amount') as HTMLInputElement).value;
            let tx = await loanContract.mint(parseUnits(mint_amount, 'ether'))

            await tx.wait();
            this.render(address, positions);
        })

        let burn = document.getElementById('burn');
        burn?.addEventListener('click', async (evt) => {
            evt.preventDefault();
            let burn_amount = (document.getElementById('burn_amount') as HTMLInputElement).value;
            let tx = await loanContract.burn(parseUnits(burn_amount, 'ether'))
            await tx.wait();
            this.render(address, positions);
        })

    }


    private async getLatestPrice(symbol: string) {
        let price = await this.priceFeedContracts!.getLatestPrice(symbol)
            .catch(() => {
                if (symbol == 'AAPL') return parseUnits('150.77', 'ether')
                if (symbol == 'MSFT') return parseUnits('239.59', 'ether')
            })
        console.log('price', price.toString());
        return price;
    }
}