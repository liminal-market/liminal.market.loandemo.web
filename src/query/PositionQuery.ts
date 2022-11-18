import QueryBuilder from "./QueryBuilder";
import Query from "./Query";

export default class PositionQuery {
    static properies = `
        id
  symbol {
    id
    logo
    pricePerShare
  }
  tsl
  txCount
  updated
  wallet {
    id
  }`;


    public static loadLargestPositionsBySymbol(queryBuilder: QueryBuilder, symbol : string) {
        let str = `positions (first:20, orderBy: tsl, orderDirection: desc
where :{
  symbol:"` + symbol.toUpperCase() + `" 
}
) {` + this.properies + `}`;

        let query = new Query('positions', str);
        queryBuilder.add(query);
    }

    public static loadWallet(queryBuilder : QueryBuilder, address : string) {
        let str = `positions (orderBy: tsl, orderDirection: desc
where :{
  wallet:"` + address.toLowerCase() + `" 
}
) {` + this.properies + `}`;

        let query = new Query('wallet_positions', str);
        queryBuilder.add(query);
    }
}