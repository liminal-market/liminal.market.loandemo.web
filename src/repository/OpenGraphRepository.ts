import Config from "../Config";

export default class OpenGraphRepository {



    public async execute(query: string) {
        return {"data":{"positions":[{"id":"0x93da645082493bbd7116fc057c5b9adfd5363912_MSFT","symbol":{"id":"MSFT","logo":"https://app.liminal.market/img/logos/MSFT.png","pricePerShare":"244.57"},"tsl":"236.870862844","txCount":"4","updated":"1668527976572","wallet":{"id":"0x93da645082493bbd7116fc057c5b9adfd5363912"}},{"id":"0x93da645082493bbd7116fc057c5b9adfd5363912_AAPL","symbol":{"id":"AAPL","logo":"https://app.liminal.market/img/logos/AAPL.png","pricePerShare":"137.25"},"tsl":"2.13187253","txCount":"2","updated":"1667835796888","wallet":{"id":"0x93da645082493bbd7116fc057c5b9adfd5363912"}}]}};

        let queryObj = {query: 'query { ' + query + '}'};
        let request = await fetch(Config.GraphUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(queryObj)
        });

        return await request.json()
    }

}