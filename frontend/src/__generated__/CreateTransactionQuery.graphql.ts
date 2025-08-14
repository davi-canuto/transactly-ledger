/**
 * @generated SignedSource<<403b083d875fbcb2e0867448437a845b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateTransactionQuery$variables = {
  first: number;
};
export type CreateTransactionQuery$data = {
  readonly accounts: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly balanceCents: number | null | undefined;
        readonly id: string;
        readonly name: string | null | undefined;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type CreateTransactionQuery = {
  response: CreateTransactionQuery$data;
  variables: CreateTransactionQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "first"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "first",
        "variableName": "first"
      }
    ],
    "concreteType": "AccountConnection",
    "kind": "LinkedField",
    "name": "accounts",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AccountEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "balanceCents",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
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
    "name": "CreateTransactionQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateTransactionQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bdfe576f87ba233c33df965dea2699f9",
    "id": null,
    "metadata": {},
    "name": "CreateTransactionQuery",
    "operationKind": "query",
    "text": "query CreateTransactionQuery(\n  $first: Int!\n) {\n  accounts(first: $first) {\n    edges {\n      node {\n        id\n        name\n        balanceCents\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7655ba5f4f6a5ee5e227de51d640879c";

export default node;
