/**
 * @generated SignedSource<<61ea2bafb0a0a62410ded473e01e8554>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateTransactionInput = {
  amountCents: number;
  clientMutationId?: string | null | undefined;
  fromAccountId: string;
  toAccountId: string;
};
export type CreateTransactionCreateMutation$variables = {
  input: CreateTransactionInput;
};
export type CreateTransactionCreateMutation$data = {
  readonly createTransaction: {
    readonly clientMutationId: string | null | undefined;
    readonly transaction: {
      readonly amountCents: number | null | undefined;
      readonly createdAt: string | null | undefined;
      readonly from: {
        readonly id: string;
        readonly name: string | null | undefined;
      } | null | undefined;
      readonly id: string;
      readonly to: {
        readonly id: string;
        readonly name: string | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type CreateTransactionCreateMutation = {
  response: CreateTransactionCreateMutation$data;
  variables: CreateTransactionCreateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreateTransactionPayload",
    "kind": "LinkedField",
    "name": "createTransaction",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Transaction",
        "kind": "LinkedField",
        "name": "transaction",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "from",
            "plural": false,
            "selections": (v2/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "to",
            "plural": false,
            "selections": (v2/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "amountCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "clientMutationId",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateTransactionCreateMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateTransactionCreateMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "8dfc1964d359023e5cbc9f8db4081a63",
    "id": null,
    "metadata": {},
    "name": "CreateTransactionCreateMutation",
    "operationKind": "mutation",
    "text": "mutation CreateTransactionCreateMutation(\n  $input: CreateTransactionInput!\n) {\n  createTransaction(input: $input) {\n    transaction {\n      id\n      from {\n        id\n        name\n      }\n      to {\n        id\n        name\n      }\n      amountCents\n      createdAt\n    }\n    clientMutationId\n  }\n}\n"
  }
};
})();

(node as any).hash = "db5ccdea62661f4d1bfbb4461c5e65d2";

export default node;
