---
title: Build a Token Generator with Astro
description: Learn how you can generate tokens using SSR frameworks like Astro.
---

Astro is created to be the perfect use case for a content-heavy website. A content heavy site is mostly front-end code. The opposite of that is a backend server, and in this guide, we will build a backend token generator for Agora video calls. 

I love building websites with Astro. It's my favorite web framework, and I don't want to use any other one. However, I must stress test it and ensure Astro is flexible enough to fully commit.

Spoilers. My love for Astro has grown deeper. 

![Token Flow](assets/token-flow.png)

## Prerequisites
1. NodeJS and Astro installed.
2. Know how to send a POST request using Postman
3. A developer account with [Agora](https://console.agora.io/).

## Project Setup
To create a new Astro project, run `npm create astro@latest`. Follow all the default options during the setup process, except use an empty template. This way, our project will be free of distractions. Then, we must install the Agora Token package to generate our tokens. You can do that using `npm i agora-token`.

To generate a token, we need to use our Agora App ID and App Certificate. The App Certificate is our "secret" key and should be hidden from public view. It is common practice to store this sensitive data in a' .env' file.  When we generate our Astro project, the `.env` is already listed in the `.gitignore`, which means it will not be pushed to GitHub. In the `.env`, add the project `APP_ID` and `APP_CERTIFICATE`, which you can find in your Agora Console.

## What is a Token?
Tokens are a form of authentication that verifies whether the user can access parts of an application. In this case, we want them to authenticate the user and their privileges within a video call. 

The token is generated based on the HMAC-SHA256 cryptographic algorithm. We don't need to dive into cybersecurity theory; just know that it's an industry standard for authentication, and it will give you a code that verifies your user's identity. We can generate this token in Node using the `agora-token` package.

## Setting up an Endpoint in Astro
To create an endpoint in Astro, add a Javascript or Typescript file to the `pages` directory. The name of the file should have the datatype extension. So your file name will look like `<name>.<return-type>.ts`. The Javascript and Typescript extensions will be removed during the build process.

The file path we will use to generate our token is `pages/api/token.json.ts`. This endpoint will return JSON data, so the file name ends with `.json.ts`. I like to put all endpoints within an `api` folder so that they are separated from front-end routes. Since the Typescript extension gets removed and the `pages` directory doesn't show up in the URL, our final endpoint will be `api/token.json`.

## Define the endpoint
Because our endpoint will need some input information, we will use a `POST` request so we can pass the input as the request body. You can define this in Astro by exporting a `POST` function and returning a Response object.

```ts
import type { APIContext } from "astro";

export async function POST({ request }: APIContext) {
    const { channel, role, uid, expireTime } = await request.json()

    return new Response(JSON.stringify({
        token: "token"
    }), { status: 200 })
}
```

## Response Helper Functions
We will abstract away the Response objects by creating a `utils/sendResponse.ts` file to simplify our endpoint and ensure uniformity between our responses. 

Within this file, we need to set up our headers to avoid any CORS issues when using our backend.

* "Access-Control-Allow-Origin": "*" allows all domains to access the server, which is helpful for APIs or during development.
* "Access-Control-Allow-Methods": "POST, OPTIONS" specifies that only POST and OPTIONS methods are permitted, controlling how other sites can interact with the server.

These headers will allow our API to work well in production and development by allowing all domains. For production, you should limit only the origins that should be allowed.

Then, we define two functions that create a response using the headers we defined:
1. `sendBadRequest` - which returns a status of `400` with the reason why the request was bad
2. `sendSuccessfulResponse` - which returns a status of `200` along with the data

```ts
const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
});

export const sendBadRequest = (reason: string) => {
    return new Response(reason, { status: 400, headers });
}

export const sendSuccessfulResponse = (data: any) => {
    return new Response(JSON.stringify(data), { status: 200, headers });
}
```

## Input Checks
The token generation function requires `channel`, `role`,  `uid`, and `expireTime`. These are used to ensure that the token includes correct authentication and privileges. To ensure we pass accurate data, check that `channel`, `uid`, and `expireTime` are not empty. If they are, return a Bad Request using our helper function.

The role determines what type of access the user requesting a token should have. There are two possible roles:
* publisher - Can publish their data to the channel. They can also receive data from the channel.
* subscriber - Can only receive data and cannot publish data.

These are the only two valid inputs for the role. If one of those inputs is in the request body, we can assign an `agoraRole` variable to an enum predefined within the `agora-token` package. If the request does not include one of these options, we return a Bad Request using our helper function.

```ts
import agoraToken from "agora-token";

export async function POST({ request }: APIContext) {
    const { channel, role, uid, expireTime } = await request.json()

    if (!channel) {
        return sendBadRequest("channel is required")
    }
    if (!uid) {
        return sendBadRequest("uid is required")
    }
    if (!expireTime) {
        return sendBadRequest("expireTime is required")
    }

    let agoraRole;
    if (role === 'publisher') {
        agoraRole = agoraToken.RtcRole.PUBLISHER;
    } else if (role === 'subscriber') {
        agoraRole = agoraToken.RtcRole.SUBSCRIBER
    } else {
        return sendBadRequest("role is incorrect")
    }

    return new Response(JSON.stringify({
        token: "token"
    }), { status: 200 })
}
```

## Generate Token
We will create a separate `handleGenerateToken` function to generate the token. This separates the `POST` request and Response logic from the token generation logic. This gives two benefits:
- Makes our code easier to read
- If you add more features to the same backend (like cloud recording), you don't need to make network calls and can generate the token directly.

To create the token, we use the `buildTokenWithUid` function from the `agora-token` package. We pass `expireTime` to the token and privilege expiration field.

The privilege expiration time defines how long users will have their privileges within the channell, while token expiration defines how long users can remain in the channel. If the privilege time expires, the user can still listen to the call but can no longer publish. Once the token expires, they will lose access to the channel completely. In our case, we will set the token and privilege expiration to the same duration.

Once a token is generated, we can send a successful response using our helper function.

```ts
const APP_ID = import.meta.env.APP_ID;
const APP_CERTIFICATE = import.meta.env.APP_CERTIFICATE;

export async function POST({ request }: APIContext) {
    // ...

    const token = await handleGenerateToken({ channel, role: agoraRole, uid, expireTime })

    return sendSuccessfulResponse({ token })
}

export async function handleGenerateToken({ channel, role, uid, expireTime }: { channel: string, role: number, uid: string, expireTime: number }) {
    return agoraToken.RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channel, uid, role, expireTime, expireTime);
}
```

## Run the Backend
Run this token generator using `npm run dev`. You can use Postman to send a `POST` request with a body containing `channel`, `role`, `uid`, and `expireTime`. If your `POST` request is missing information, you will receive a Bad Request response telling you which information you missed. If you send all the necessary information, you will receive a successful response that looks like this:

```
{"token":"<a long string of letters and numbers>"}
```

You now have a fully working token generator that you can use to develop your applications. You should use this token generator primarily for development purposes. If you are building in production, you should add some user verification and other security measures to ensure that the only people joining calls are the ones who are supposed to.

![Token Flow](assets/token-flow.png)

Astro passed our stress test with flying colors. It was built to support content-heavy sites but performs just as well for backend projects. Astro is an excellent solution for full-stack websites. Now that you have a token generator built in Astro, you can add a front end and have a secure video call all from one codebase. Here is a [guide on how to build a Video Call front end with Astro](https://www.agora.io/en/blog/build-a-video-call-app-with-astro-and-reactjs/).