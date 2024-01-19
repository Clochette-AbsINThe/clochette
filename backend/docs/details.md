# Details about the v2

This file contains details about the v2 of the API.

## Transactions

In v2, transactions are now split into two status, `pending` and `validated`. This is to allow the user to create a transaction and validate it at a later time.

For example, the workflow to create a consumable is now the following:

- Create a consumable_item with its name and icon

```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/api/v1/consumable_item/' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Coca",
  "icon": "Soft"
}'
```

- Create a transaction

```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/api/v2/transaction/' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "datetime": "2023-09-04T14:29:47.062Z",
  "paymentMethod": "CB",
  "trade": "purchase"
}'
```

- Create a consumable

```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/api/v2/consumable/' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "consumableItemId": 1,
  "sellPrice": 0.5,
  "buyPrice": 0.43,
  "transactionId": 1
}'
```

- Validate the transaction

```bash
curl -X 'PATCH' \
  'http://127.0.0.1:8000/api/v2/transaction/1/validate' \
  -H 'accept: application/json'
```

---

You can read the created transaction with the following command:

```bash
curl -X 'GET' \
  'http://127.0.0.1:8000/api/v2/transaction/1' \
  -H 'accept: application/json'
```

You should have the following :

```json
{
  "datetime": "2023-09-04T14:29:47.062000Z",
  "paymentMethod": "CB",
  "trade": "purchase",
  "id": 1,
  "treasuryId": 1,
  "type": "commerce",
  "status": "validated",
  "amount": -0.43,
  "description": null,
  "barrelsPurchase": [],
  "barrelsSale": [],
  "glasses": [],
  "nonInventorieds": [],
  "consumablesPurchase": [
    {
      "id": 1,
      "consumableItemId": 1,
      "solded": false,
      "sellPrice": 0.5,
      "buyPrice": 0.43,
      "name": "Coca",
      "icon": "Soft"
    }
  ],
  "consumablesSale": []
}
```

The treasury should have been updated with the transaction amount:

```bash
curl -X 'GET' \
  'http://127.0.0.1:8000/api/v1/treasury/last' \
  -H 'accept: application/json'
```

You should have the following:

```json
{
  "totalAmount": -0.43,
  "cashAmount": 0,
  "lydiaRate": 0.015,
  "id": 1
}
```
