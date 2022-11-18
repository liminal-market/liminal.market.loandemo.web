
export default class Config {

    static GraphUrl = '';

    public static UsePolygon() {
        Config.GraphUrl = 'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market-polygon'
    }

    public static UseMumbai() {
        Config.GraphUrl = 'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market-mumbai';
    }

    public static UseMumbaiStaking() {
        Config.GraphUrl = 'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market-mumbai-staking';
    }

}