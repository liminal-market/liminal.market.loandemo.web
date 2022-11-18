import Config from "./Config";
import QueryBuilder from "./query/QueryBuilder";
import PositionQuery from "./query/PositionQuery";
import Positions from "./element/Positions";

declare var window: any



const start = async () => {

    let main = document.getElementById('main')!;
    if (window.ethereum == null) {
        main.innerHTML = 'Metamask not install. Please install Metamask or other Wallet';
        return;
    }

    main.innerHTML = '<button id="login">Connect Wallet</button>';
    let login = document.getElementById('login');
    login?.addEventListener('click', async (evt) => {
        loginAction();
    })
    loginAction();

    async function loginAction() {
        let accounts = await  window.ethereum.request({ method: 'eth_requestAccounts' });

        Config.UseMumbai();
        let queryBuilder = new QueryBuilder();
        PositionQuery.loadWallet(queryBuilder, accounts[0]);
        let result = await queryBuilder.execute();

        let positions = new Positions();
        positions.render(accounts[0], result.data.positions);
    }
}

start();

export {};