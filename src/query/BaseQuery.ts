import Query from "./Query";
import QueryBuilder from "./QueryBuilder";
import OpenGraphRepository from "../repository/OpenGraphRepository";

export default class BaseQuery {


    public static async run(query : Query) {
        let queryBuilder = new QueryBuilder();
        queryBuilder.add(query);

        let openGraphRepository = new OpenGraphRepository();
        return await openGraphRepository.execute(queryBuilder.getQuery())

    }
}