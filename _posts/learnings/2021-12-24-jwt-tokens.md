---
date: 2021-12-23
title: 'JWT Tokens'
---

Recently at work we bootstrapped a new API and discussed what authentication methods we should use. JWT came up, and I didn't know about it, so here's what I learned.

## What is a JWT Access Token?

JSON Web Token (JWT) is an open standard defining a compact, self-contained way for securely transmitting JSON information. These tokens are digitally signed using either a secret or public/private key pair.

## When should you use JWTs?

JSON Web Tokens are useful for **authorization** and **information exchange**.

For authorization, once the user is logged in, each following request will include the JWT which will allow the user to access things that are permitted with that token.

For information exchange, JWTs are used to verify the senders are who they claim to be since JWTs can be signed for. Also, since the signature is calculated using the header and the payload, you can verify that the content hasn't been changed or messed with.

## What is the structure?

In its compact form, JSON Web Tokens consist of the Header, Payload, and Signature. The output consists of three Base64Url strings separated by dots that can be easily passed in HTML and HTTP environments. Something like `XXXX.YYYY.ZZZZ`

**Header**: The header usually consists of two parts, the type of the token (JWT) and the signing algorithm being used (HMAC, SHA256, RSA). For example:

```
{
  "alg": "HS256",
  "type": "JWT"
}
```

This JSON is then Base64URL encoded to form the first part of the JWT. You can do this in JavaScript in the following way:

```javascript
let headerJson = { alg: 'HS256', typ: 'JWT' }
let encoded = bota(JSON.stringify(headerJson))
```

**Payload**: The payload makes up the second part of the token and contains the claims, which are statements about an entity (often the user) and addtional data. There are three types of claims: registered, public, and private.

1. **Registered Claims**: These are a set of predefined claims that provide a set of useful, interoperable claims. Some include iss (issuer), exp (expiration time), sub (subject), etc. While predefined, they are not mandatory (just recommended).
2. **Public Claims**: These are names that are required to be collision resistant (in other words, highly unlikely to collide with other names). Their names should be UUIDs or prefixed by a URL to create a safe namespace for them and avoid collisions.
3. **Private Claims**: These are names that are not required to be collision resistant.

An example payload could be:

```json
{
  "sub": "123456789",
  "name": "Janessa",
  "admin": true
}
```

Similar to encoding the header, the payload is then Base64Url encoded to form the second part of the JSON Web Token.

**Signature**:
The signature is used to verify the message wasn't changed along the way. In the case of tokens signed with a private key, it can also verify that the sender of the JWT is who they say they are. To create the signature, you taken the encoded header, the encoded payload, a secret, the algorithm (specified in header), and sign it.

For example:

```json
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

When you put the header, payload, and signature all together you get something like:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkiLCJuYW1lIjoiSmFuZXNzYSIsImFkbWluIjp0cnVlfQ.dCKmOwHDkyXGtHQfExjUoepCKQpKy9czARV-EJIJx_E
```
