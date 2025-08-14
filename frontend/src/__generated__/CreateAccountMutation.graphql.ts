/**
 * @generated SignedSource<<d480d3ac600dc71add55dd1e0d6f2d93>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateAccountInput = {
  clientMutationId?: string | null | undefined;
  initialBalanceCents?: number | null | undefined;
  name: string;
};
export type CreateAccountMutation$variables = {
  input: CreateAccountInput;
};
export type CreateAccountMutation$data = {
  readonly createAccount: {
    readonly account: {
      readonly balanceCents: number | null | undefined;
      readonly createdAt: string | null | undefined;
      readonly id: string;
      readonly name: string | null | undefined;
    } | null | undefined;
    readonly clientMutationId: string | null | undefined;
  } | null | undefined;
};
export type CreateAccountMutation = {
  response: CreateAccountMutation$data;
  variables: CreateAccountMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreateAccountPayload",
    "kind": "LinkedField",
    "name": "createAccount",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "account",
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
    "name": "CreateAccountMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateAccountMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5ae904c472b4a40d7e38d013f105aa7b",
    "id": null,
    "metadata": {},
    "name": "CreateAccountMutation",
    "operationKind": "mutation",
    "text": "mutation CreateAccountMutation(\n  $input: CreateAccountInput!\n) {\n  createAccount(input: $input) {\n    account {\n      id\n      name\n      balanceCents\n      createdAt\n    }\n    clientMutationId\n  }\n}\n"
  }
};
})();

(node as any).hash = "85eb137921f2fdadbcabe61591c5aa51";

export default node;
