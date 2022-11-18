import localhostContractAddresses from './localhost-contract-addresses';
import ContractAddresses from "./ContractAddresses";


export default class ContractInfo {


    public static getContractInfo(networkName?: string): ContractAddresses {
        let contractInfos: any = {
            localhostContractAddresses
        };

        if (!networkName) {
            networkName = 'localhost';
        }
        const contractInfoType = contractInfos[networkName + 'ContractAddresses'];
        return new contractInfoType();
    }


}
