export enum SubscanApiName {
  General = 'General',
  Account = 'Account',
  Price = 'Price',
  Runtime = 'Runtime',
}

export type APIMetaData = {
  name: string;
  description: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  payload?: Record<string, string>;
  category: SubscanApiName;
};

const defaultHeaders = { 'Content-Type': 'application/json' };

export const SUBSCAN_API: APIMetaData[] = [
  // General
  {
    name: 'timestamp',
    description: 'Subscan server timestamp',
    url: '/api/now',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
  },
  {
    name: 'metadata',
    description: 'Subscan global stats',
    url: '/api/scan/metadata',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
  },
  {
    name: 'blocks',
    description:
      'Block list\r\n\r\n### Payload\r\n\r\n| Name | Type | Require |\r\n|------|------|---------|\r\n| row  | int  | yes     |\r\n| page | int  | yes     |',
    url: '/api/scan/blocks',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
  },
  {
    name: 'block',
    description:
      'Block detail\r\n\r\n### Payload\r\n\r\n| Name            | Type   | Require |\r\n|-----------------|--------|---------|\r\n| block_num       | int    | no      |\r\n| block_hash      | string | no      |\r\n| block_timestamp | int    | no      |\r\n| only_head       | bool   | no      |',
    url: '/api/scan/block',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      block_num: '',
      block_hash: '',
      block_timestamp: '',
      only_head: '',
    },
  },
  {
    name: 'extrinsics',
    description:
      'Extrinsic list\r\n\r\n### Payload\r\n\r\n| Name        | Type   | Require |\r\n|-------------|--------|---------|\r\n| row         | int    | yes     |\r\n| page        | int    | yes     |\r\n| signed      | string | no      |\r\n| address     | string | no      |\r\n| module      | string | no      |\r\n| no_params   | bool   | no      |\r\n| call        | string | no      |\r\n| from        | int    | no      |\r\n| to          | int    | no      |\r\n| block_num   | int    | no      |\r\n| block_range | string | no      |\r\n| success     | bool   | no      |',
    url: '/api/scan/extrinsics',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      row: '',
      page: '',
      signed: '',
      address: '',
      module: '',
      no_params: '',
      call: '',
      from: '',
      to: '',
      block_num: '',
      block_range: '',
      success: '',
    },
  },
  {
    name: 'extrinsic',
    description:
      'Extrinsic detail\r\n\r\n### Payload\r\n\r\n| Name            | Type   | Require |\r\n|-----------------|--------|---------|\r\n| extrinsic_index | string | no      |\r\n| hash            | string | no      |\r\n| events_limit    | int    | no      |\r\n| focus           | string | no      |',
    url: '/api/scan/extrinsic',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      extrinsic_index: '',
      hash: '',
      events_limit: '',
      focus: '',
    },
  },
  {
    name: 'multisigs',
    description:
      'account multisig list\r\n\r\n### Payload\r\n\r\n| Name    | Type   | Require |\r\n|---------|--------|---------|\r\n| row     | int    | yes     |\r\n| page    | int    | no      |\r\n| account | string | yes     |',
    url: '/api/scan/multisigs',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      row: '',
      page: '',
      account: '',
    },
  },
  {
    name: 'multisig',
    description:
      'account multisig info and process list\r\n\r\n### Payload\r\n\r\n| Name        | Type   | Require |\r\n|-------------|--------|---------|\r\n| multi_id    | string | yes     |\r\n| call_hash   | string | no      |',
    url: '/api/scan/multisig',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      multi_id: '',
      call_hash: '',
    },
  },
  {
    name: 'proxy Extrinsics',
    description:
      'account proxy Extrinsic list\r\n\r\n### Payload\r\n\r\n| Name    | Type   | Require |\r\n|---------|--------|---------|\r\n| row     | int    | yes     |\r\n| page    | int    | no      |\r\n| order   | int    | no      |\r\n| account | string | yes     |',
    url: '/api/scan/proxy/extrinsics',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      row: '',
      page: '',
      order: '',
      account: '',
    },
  },
  {
    name: 'batch extrinsic params',
    description:
      'Get extrinsic param data in batches\r\n\r\n### Payload\r\n\r\n| Name            | Type         | Require |\r\n|-----------------|--------------|---------|\r\n| extrinsic_index | array string | yes     |',
    url: '/api/scan/extrinsic/params',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      extrinsic_index: '',
    },
  },
  {
    name: 'events',
    description:
      'Event list\r\n\r\n### Payload\r\n\r\n| Name            | Type   | Require |\r\n|-----------------|--------|---------|\r\n| row             | int    | yes     |\r\n| page            | int    | yes     |\r\n| module          | string | no      |\r\n| call            | string | no      |\r\n| from_block      | int    | no      |\r\n| from            | int    | no      |\r\n| to              | int    | no      |\r\n| address         | string | no      |\r\n| finalized        | bool   | no      |\r\n| block_num       | int    | no      |\r\n| block_range     | string | no      |\r\n| extrinsic_index | string | no      |\r\n| phase           | int    | no      |',
    url: '/api/scan/events',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      row: '',
      page: '',
      module: '',
      call: '',
      from_block: '',
      from: '',
      to: '',
      address: '',
      finalized: '',
      block_num: '',
      block_range: '',
      extrinsic_index: '',
      phase: '',
    },
  },
  {
    name: 'event',
    description:
      'Event detail\r\n\r\n### Payload\r\n\r\n| Name        | Type   | Require |\r\n|-------------|--------|---------|\r\n| event_index | string | no      |',
    url: '/api/scan/event',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      event_index: '',
    },
  },
  {
    name: 'batch event params',
    description:
      'Get event param data in batches\r\n\r\n### Payload\r\n\r\n| Name        | Type         | Require |\r\n|-------------|--------------|---------|\r\n| event_index | array string | yes     |',
    url: '/api/scan/event/params',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      event_index: '',
    },
  },
  {
    name: 'logs',
    description:
      'Logs list\r\n\r\n### Payload\r\n\r\n| Name        | Type   | Require |\r\n|-------------|--------|---------|\r\n| row         | int    | yes     |\r\n| page        | int    | yes     |\r\n| engine      | string | no      |\r\n| type        | string | no      |\r\n| block_num   | int    | no      |\r\n| block_range | string | no      |\r\n| from        | int    | no      |\r\n| to          | int    | no      |',
    url: '/api/scan/logs',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      row: '',
      page: '',
      engine: '',
      type: '',
      block_num: '',
      block_range: '',
      from: '',
      to: '',
    },
  },
  {
    name: 'daily',
    description:
      'Statistics by time \r\n\r\n### Payload\r\n\r\n| Name     | Type             | Require                                                                                                                      |\r\n|----------|------------------|------------------------------------------------------------------------------------------------------------------------------|\r\n| start    | Date(2019-07-04) | yes                                                                                                                          |\r\n| end      | Date(2019-07-04) | yes                                                                                                                          |\r\n| format   | string           | yes(day hour 6hour)                                                                                                          |\r\n| category | string           | yes(transfer extrinsic NewAccount ActiveAccount Treasury TreasurySpend Unbond UnbondKton Fee Bonded BondedKton AvgBlockTime) |\r\n',
    url: '/api/scan/daily',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      start: '',
      end: '',
      format: '',
      category: '',
    },
  },
  {
    name: 'transfers',
    description:
      'Transfer list\r\n\r\n### Payload\r\n\r\n| Name            | Type   | Require                |\r\n|-----------------|--------|------------------------|\r\n| row             | int    | yes                    |\r\n| page            | int    | yes                    |\r\n| address         | string | no                     |\r\n| extrinsic_index | string | no                     |\r\n| from_block      | int    | no                     |\r\n| to_block        | int    | no                     |\r\n| direction       | string | yes(all sent received) |\r\n| include_total   | bool   | no                     |\r\n| asset_symbol    | string | no                     |',
    url: '/api/scan/transfers',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      row: '',
      page: '',
      address: '',
      extrinsic_index: '',
      from_block: '',
      to_block: '',
      direction: '',
      include_total: '',
      asset_symbol: '',
    },
  },
  {
    name: 'check-hash',
    description:
      'Check whether it is block hash or extrinsic hash\r\n\r\n### Payload\r\n\r\n| Name | Type   | Require |\r\n|------|--------|---------|\r\n| hash | string | yes     |',
    url: '/api/scan/check_hash',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      hash: '',
    },
  },
  {
    name: 'token',
    description:
      'Current network tokens detail\r\n\r\n### Payload\r\n\r\n| Name | Type   | Require |\r\n|------|--------|---------|\r\n| t    | string | no      |\r\n| q    | string | no      |',
    url: '/api/scan/token',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      t: '',
      q: '',
    },
  },
  {
    name: 'raw extrinsic',
    description:
      'Get raw data of extrinsic\r\n\r\n### Payload\r\n\r\n| Name            | Type | Require                       |\r\n|-----------------|------|-------------------------------|\r\n| extrinsic_index | int  | yes(if hash empty)            |\r\n| hash            | int  | yes(if extrinsic_index empty) |',
    url: '/api/scan/getRawTx',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.General,
    payload: {
      extrinsic_index: '',
      hash: '',
    },
  },

  // Account
  {
    name: 'accounts',
    description:
      'Account list\r\n\r\n### Payload\r\n\r\n| Name        | Type         | Require                                                                                                                  |\r\n|-------------|--------------|--------------------------------------------------------------------------------------------------------------------------|\r\n| row         | int          | yes                                                                                                                      |\r\n| page        | int          | yes                                                                                                                      |\r\n| order       | string       | no (desc,asc)                                                                                                            |\r\n| order_field | string       | no(balance)                                                                                                              |\r\n| filter      | string       | no(validator nominator councilMember techcomm registrar system evm nominationPool proxy proxies multisig multisigMember) |\r\n| address     | array string | no (max:100)                                                                                                             |',
    url: '/api/scan/accounts',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.Account,
    payload: {
      row: '',
      page: '',
      order: '',
      order_field: '',
      filter: '',
      address: '',
    },
  },
  {
    name: 'account-tokens',
    description:
      '### Payload\r\n\r\n| Name    | Type   | Require                   |\r\n|---------|--------|---------------------------|\r\n| address | string | yes (ss58 or eth_address) |',
    url: '/api/scan/account/tokens',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.Account,
    payload: {
      address: '',
    },
  },

  // Price
  {
    name: 'price',
    description:
      'Historical price query\r\n\r\n### Payload\r\n\r\n| Parameter | Type   | Require | Default | Description                                  |\r\n|-----------|--------|---------|---------|----------------------------------------------|\r\n| base      | string | no      |         |                                              |\r\n| quote     | string | no      |         | Quote Currency, USD or current network token |\r\n| time      | int    | yes     |         | unix timestamp or block num                  |',
    url: '/api/open/price',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.Price,
    payload: {
      base: '',
      quote: '',
      time: '',
    },
  },
  {
    name: 'price-converter',
    description:
      '\r\nThe conversion calculator returns the amount of the target currency base on the amount of source currency and historical price\r\n\r\nNetworks Supported Token\r\n\r\n| Network        | token     |\r\n|----------------|-----------|\r\n| kusama         | KSM       |\r\n| polkadot       | DOT       |\r\n| kulupu         | KLP       |\r\n| darwinia       | RING KTON |\r\n| dock           | DOCK      |\r\n| spiritnet      | KILT      |\r\n| crab-parachain | CRAB      |\r\n| crab           | CRAB      |\r\n| phala          | PHA       |\r\n| khala          | PHA       |\r\n| bifrost-kusama | BNC       |\r\n| bifrost        | BNC       |\r\n\r\n### Payload\r\n\r\n| Parameter | Type    | Require | Default | Description                                  |\r\n|-----------|---------|---------|---------|----------------------------------------------|\r\n| value     | decimal | yes     |         | currency amount to convert                   |\r\n| from      | string  | yes     |         | Base Currency, USD or current network token  |\r\n| quote     | string  | yes     |         | Quote Currency, USD or current network token |\r\n| time      | int     | no      |         | unix timestamp or block num                  |\r\n',
    url: '/api/open/price_converter',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.Price,
    payload: {
      value: '',
      from: '',
      quote: '',
      time: '',
    },
  },
  {
    name: 'price-history',
    description:
      '### Payload\r\n\r\n| Name     | Type             | Require |\r\n|----------|------------------|---------|\r\n| start    | Date(2019-07-04) | yes     |\r\n| end      | Date(2019-07-04) | yes     |\r\n| currency | string           | no      |',
    url: '/api/scan/price/history',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.Price,
    payload: {
      start: '',
      end: '',
      currency: '',
    },
  },
  {
    name: 'currencies',
    description: 'List of currencies that support price query and conversion',
    url: '/api/open/currencies',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.Price,
  },

  // Runtime
  {
    name: 'runtime-list',
    description: 'Runtime list',
    url: '/api/scan/runtime/list',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.Runtime,
  },
  {
    name: 'runtime-info',
    description:
      '### Payload\r\n\r\n| Name | Type | Require |\r\n|------|------|---------|\r\n| spec | int  | yes     |',
    url: '/api/scan/runtime/metadata',
    method: 'post',
    headers: defaultHeaders,
    category: SubscanApiName.Runtime,
    payload: {
      spec: '',
    },
  },
];
