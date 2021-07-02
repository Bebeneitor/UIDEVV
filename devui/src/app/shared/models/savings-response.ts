import { PayerResponse } from './payer-response';
import { ClientResponse } from './client-response';

export class SavingsResponse {

    icmsIds: number[];
    cvpRuleIds: string[];
    groupIds: string[];
    dateRange: string[];
    payerShortNames: string[];
    clients: string[];
    clientResponseList: ClientResponse[];
    payerResponseList: PayerResponse[];
    clientPlatforms: string[];
    editFlags: string[];

}