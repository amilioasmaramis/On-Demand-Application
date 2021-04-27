**On-Demand-Application API DOCUMENTATION**
----
----

On-Demand-Application is app service system based on customer orders. So when there is an order from a consumer, this service provider will immediately respond to it. 
This app has :
* RESTful endpoint
* JSON formatted response

List of available endpoints:
​
- `POST /users/register`
- `POST /users/login`
- `PUT /users/:id`
- `POST /orders`
- `GET /orders`
- `PUT /orders/:id`
- `PUT /orders/IsDone/:id`

### `POST /users/register`

> Register User

Request:

- data:

```json
{
  "Username": "string",
  "Email": "string",
  "Password": "string",
  "Role": "string"
}
```

Response:

- status: 201
- body:
  ​

```json
{
  "user": {
    "id": "integer",
    "Username": "string",
    "Email": "string",
    "Password": "string",
    "Role": "string",
    "Orderan": "array",
    "updatedAt": "date",
    "createdAt": "date"
    },
  "message": "string"
}
```

* **Success Response:**

  * **Code:** 201 CREATED<br />
    **Content:** `{
      "user": {
          "id": 6,
          "Username": "user3",
          "Email": "user3@gmail.com",
          "Password": "$2a$10$XAr1v3j/xDPJr1mOYEF70ePiKD/Pud7RsvLTvT5/fuew3m2MNICTK",
          "Role": "driver",
          "Orderan": [],
          "updatedAt": "2021-04-27T12:50:34.138Z",
          "createdAt": "2021-04-27T12:50:34.138Z"
      },
      "message": "Add new User Successfully"
    }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{
      "errorCode": "Validation error",
      "message": [
          "Password is required",
          "Role is required"
      ]
    }`

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{
        "errorCode": "Internal server error",
        "message": "Unexpected error."
    }`

### `POST /users/login`

> Login User

Request:

- data:

```json
{
  "Email": "string",
  "Password": "string",
  "Role": "string
}
```

Response:

- status: 200
- body:
  ​

```json
{
  "access_token": "string",
  "id": "integer",
  "Username": "string",
  "Email": "string",
  "Role": "string"
}
```

* **Success Response:**

  * **Code:** 200 OK<br />
    **Content:** `{
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiRW1haWwiOiJyYXpvcm1hbmdzQGdtYWlsLmNvbSIsIlJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYxOTUyNzQ5OH0.UlGV1ulbpQGJglDddzBmRNKuLPqnR-PPfHPwDUMNXQg",
      "id": 1,
      "Username": "razormangs",
      "Email": "razormangs@gmail.com",
      "Role": "customer"
    }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{
      "errorCode": "Validation error",
      "message": "Please enter email and password"
    }`

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{
        "errorCode": "Internal server error",
        "message": "Unexpected error."
    }`

### `PUT /users/:id`

> Update User data by driver , fill key orderan with order user 

Request:

- data:

```json
{
  "id": "integer",
}
```

Response:

- status: 200
- body:
  ​

```json
{
  "id": "integer",
  "Username": "string",
  "Email": "string",
  "Password": "string",
  "Role": "string",
  "Orderan": "array",
  "updatedAt": "date",
  "createdAt": "date"
}
```

* **Success Response:**

  * **Code:** 200 OK<br />
    **Content:** `{
      "id": 1,
      "Username": "razormangs",
      "Email": "razormangs@gmail.com",
      "Password": "$2a$10$S1TDTfKH/e7Ww3wlyhXTbeZFq4pCPfdrIu65Rn970zRjbjsC.4LOq",
      "Role": "customer",
      "Orderan": [
          {
              "id": 1,
              "TitikAwal": [
                  "-6.876463765339965",
                  "109.12823012877732"
              ],
              "TitikAkhir": [
                  "-6.876848556370394",
                  "109.12934726878972"
              ],
              "Status": true,
              "UserId": 1,
              "Jarak": "0.131",
              "TarifHarga": "393",
              "createdAt": "2021-04-26T17:08:05.292Z",
              "updatedAt": "2021-04-26T19:27:02.476Z"
          },
          .....
          ],
      "createdAt": "2021-04-26T17:07:51.114Z",
      "updatedAt": "2021-04-27T14:07:06.958Z"
    }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{
      "errorCode": "Not Found",
      "message": "Requested order was not found"
    }`

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{
        "errorCode": "Internal server error",
        "message": "Unexpected error."
    }`


### `POST /orders/`

> Post order by customer

Request:

- data:

```json
{
  "TitikAwal": "array",
  "TitikAkhir": "array
}
```
- headers: 
```json
  "access_token": "access_token req.headers"
```

Response:

- status: 201
- body:
  ​

```json
{
  "order": {
    "id": "integer",
    "TitikAwal": "array",
    "TitikAkhir": "array",
    "Status": "boolean",
    "Jarak": "decimal",
    "UserId": "integer",
    "IsDone": "boolean",
    "updatedAt": "date",
    "createdAt": "date"
  }
}
```
* **Success Response:**

  * **Code:** 201 CREATED<br />
    **Content:** `{
      "order": {
          "id": 8,
          "TitikAwal": [
              "-6.876463765339965",
              "109.12823012877732"
          ],
          "TitikAkhir": [
              "-6.876848556370394",
              "109.12934726878972"
          ],
          "Status": false,
          "Jarak": "0.131",
          "UserId": 1,
          "TarifHarga": "393",
          "IsDone": false,
          "updatedAt": "2021-04-27T14:15:20.668Z",
          "createdAt": "2021-04-27T14:15:20.668Z"
      }
    },`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{
      "errorCode": "Validation error",
      "message": [
          "TitikAkhir is required"
      ]
    }`

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{
        "errorCode": "Internal server error",
        "message": "Unexpected error."
    }`

### `GET /order/`

> Get all list order customer by driver(where status is False for driver taken order)

Request:

- headers:

```json
"access_token": "access_token req.headers"
```

Response:

- status: 200
- body:
  ​

```json
{
  "order": "array of object",
}
```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** `{
    "order": [
        {
            "id": 2,
            "TitikAwal": [
                "-6.876463765339965",
                "109.12823012877732"
            ],
            "TitikAkhir": [
                "-6.876848556370394",
                "109.12934726878972"
            ],
            "Status": false,
            "UserId": 1,
            "Jarak": "0.131",
            "TarifHarga": "393",
            "IsDone": null,
            "createdAt": "2021-04-26T17:11:28.069Z",
            "updatedAt": "2021-04-26T17:11:28.069Z"
        },
        {
            "id": 3,
            "TitikAwal": [
                "-6.876463765339965",
                "109.12823012877732"
            ],
            "TitikAkhir": [
                "-6.876848556370394",
                "109.12934726878972"
            ],
            "Status": false,
            "UserId": 1,
            "Jarak": "0.131",
            "TarifHarga": "393",
            "IsDone": null,
            "createdAt": "2021-04-26T17:11:56.120Z",
            "updatedAt": "2021-04-26T17:11:56.120Z"
        },
        ....
      }`
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{
      "errorCode": "Unauthorized",
      "message": "Please login first"
    }`

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{
        "errorCode": "Internal server error",
        "message": "Unexpected error."
    }`

### `PUT /ORDERS/:id`

> // Update Status Order , for Driver taken order become True

Request:

- headers:

```json
"access_token": "access_token req.headers"
```

- data:

```json
{
  "id": "integer",
}
```

Response:

- status: 200
- body:
  ​

```json
{
  "id": "integer",
  "TitikAwal": "array",
  "TitikAkhir": "array",
  "Status": "boolean",
  "Jarak": "decimal",
  "UserId": "integer",
  "IsDone": "boolean",
  "updatedAt": "date",
  "createdAt": "date"
}
```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** `{
      "id": 1,
      "TitikAwal": [
          "-6.876463765339965",
          "109.12823012877732"
      ],
      "TitikAkhir": [
          "-6.876848556370394",
          "109.12934726878972"
      ],
      "Status": true,
      "UserId": 1,
      "Jarak": "0.131",
      "TarifHarga": "393",
      "IsDone": false,
      "createdAt": "2021-04-26T17:08:05.292Z",
      "updatedAt": "2021-04-27T14:28:43.648Z"
    }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{
      "errorCode": "Not Found",
      "message": "Requested order was not found"
    }`

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{
        "errorCode": "Internal server error",
        "message": "Unexpected error."
    }`

### `PUT /orders/IsDone/:id`

> Update IsDone for Driver, ketika driver sampai tujuan, ganti IsDone menjadi true untuk pemberitahuan bahwa driver telah selesai mengantarkan customer

Request:

```json
"access_token": "access_token req.headers"
```

- data:

```json
{
  "id": "integer"
}
```

Response:

- status: 201
- body:
  ​

```json
{
  "id": "integer",
  "TitikAwal": "array",
  "TitikAkhir": "array",
  "Status": "boolean",
  "Jarak": "decimal",
  "UserId": "integer",
  "IsDone": "boolean",
  "updatedAt": "date",
  "createdAt": "date"
}
```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** `{
      "id": 1,
      "TitikAwal": [
          "-6.876463765339965",
          "109.12823012877732"
      ],
      "TitikAkhir": [
          "-6.876848556370394",
          "109.12934726878972"
      ],
      "Status": true,
      "UserId": 1,
      "Jarak": "0.131",
      "TarifHarga": "393",
      "IsDone": true,
      "createdAt": "2021-04-26T17:08:05.292Z",
      "updatedAt": "2021-04-27T14:34:18.731Z"
  }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{
      "errorCode": "Not Found",
      "message": "Requested order was not found"
    }`

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{
        "errorCode": "Internal server error",
        "message": "Unexpected error."
    }`
