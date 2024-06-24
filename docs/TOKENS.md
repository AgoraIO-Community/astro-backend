---
title: Build a Token Generator with Astro
description: Learn how you can generate tokens using SSR frameworks like Astro.
---

I love building websites with Astro. It's my favorite web framework, and I don't want to use any other one. However, I must stress test it and ensure Astro is flexible enough to fully commit.

Astro is created to be the perfect use case for a content-heavy website. The opposite of that is a backend, and in this guide, we will build a backend token generator to be used for Agora video calls.

Spoilers. My love for Astro has grown deeper. 

![Token Flow](assets/token-flow.png)

## Prerequisites
1. NodeJS and Astro installed.
2. A developer account with [Agora](https://console.agora.io/).

## Project Setup
To create a new Astro project, run `npm create astro@latest`. Follow all the default options during the setup process, except use an empty template. This way, our project will be free of distractions. Then, we must install the Agora Token package to generate our tokens. You can do that using `npm i agora-token`.

You must also create a `.env` and add `APP_ID` and `APP_CERTIFICATE` values, which you can find within your Agora Console.

## What is a Token?
Tokens are a form of authentication that verifies whether the user can access parts of an application. In this case, we want to use them to authenticate the user and their privileges within a video call. 

The token is generated based on the HMAC-SHA256 cryptographic algorithm. This algorithm is an industry standard for authentication. 

We don't need to dive into cybersecurity theory; just know that it's a good algorithm that will give you a safe token, and we can generate this token using the `agora-token` package.

## Setting up an Endpoint in Astro
To create an endpoint in Astro, you need to add a Javascript or Typescript file to the `pages` directory. This file should have the file name, followed by the return datatype extension, followed by `.js` or `.ts`.The Javascript and Typescript extensions will be removed during the build process.

The most common type of return data is JSON, so our file will be a `.json.ts` file. We also need to pass some parameters. In Astro, you do this using brackets for the file/folder name. 

Our file path for generating tokens will be `pages/rtc/[channel]/[role]/[uid].json.ts`, which will result in the end point of `rtc/{channel}/{role}/{uid}.json`.

## Define the endpoint
Our endpoint will be a `GET` request because our objective is to retrieve a token. You can define this in Astro by exporting a `GET` function and returning a JSON Response.

We also import the `agora-token` package and bring in our `APP_ID` and `APP_CERTIFICATE`, which we defined in the `.env` file.


```ts
import agoraToken from "agora-token";
import type { APIContext } from "astro";

const APP_ID = import.meta.env.APP_ID;
const APP_CERTIFICATE = import.meta.env.APP_CERTIFICATE;

export async function GET({ params }: APIContext) {
  return new Response(
    JSON.stringify({
      rtcToken: "token",
    })
  )
}
```

## CORS
We first need to set up our headers so that we don't encounter any CORS issues when using our backend.

```ts
export async function GET({ params }: APIContext) {
    const headers = new Headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
    });

    return new Response(JSON.stringify({
        rtcToken: "token"
    }), { headers })
}
```

* "Access-Control-Allow-Origin": "*" allows all domains to access the server, which is helpful for APIs or during development.
* "Access-Control-Allow-Methods": "GET, OPTIONS" specifies that only GET and OPTIONS methods are permitted, controlling how other sites can interact with the server.

These headers will allow our API to work well in production and development, but for production you should limit only the origins that should be allowed.

## Input Checks
To generate the token, we need a few input parameters that we retrieve from the route. We need to check that `channel` and `uid` are not empty. If they are, return a Bad Request Error.

The role determines what type of access the user requesting a token should have. There are two possible roles:
* publisher - Can publish (or send) their data to the channel. They can also receive data from the channel.
* subscriber - Can only receive data and cannot publish data.

Those are the only two valid inputs. If one of those inputs is in the URL, we can assign the `role` variable to a number predefined within the `agora-token` package. If the request does not include one of these options, we send back a Bad Request Error.

```ts
//check for valid channel
if (!params.channel) {
    return new Response("channel is required", { status: 400, headers })
}
//check for valid role
let role;
if (params.role === 'publisher') {
    role = agoraToken.RtcRole.PUBLISHER;
} else if (params.role === 'subscriber') {
    role = agoraToken.RtcRole.SUBSCRIBER
} else {
    return new Response("role is incorrect", { status: 400, headers })
}
//check for valid uid
if (!params.uid || params.uid === '') {
    return new Response("uid is required", { status: 400, headers })
}
```

## Generate Token
At this point, we have all the data needed to generate and return the token. The only values that we haven't defined are the token expiration time and the privilege expiration time. These are in seconds, so I will set them both to 10 minutes (600 seconds).

The privilege expiration time defines how long the user will have their privileges within the channel and access to the channel in general. If the privilege time expires, the user can still listen to the call but can no longer publish. And once the token expires in general, they will lose access to the channel completely.

```ts
const expireTime = 600;
const privilegeExpireTime = 600;
let token;

token = agoraToken.RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, params.channel, params.uid, role, expireTime, privilegeExpireTime);

return new Response(JSON.stringify({
    rtcToken: token
}), { headers })
```

You now have a fully working token server that you can use to develop your applications. You should use this token server primarily for development purposes. If you are building in production, you should add some user verification and other security measures to ensure that the only people joining calls are the ones who are supposed to.

![Token Flow](assets/token-flow.png)

The conclusion of this experiment is that Astro can handle building backends just as well as content sites and I will keep using it for all my projects.

Since we have a token backend, the next logical step is to set up cloud recording for your Agora video call. Visit the [Cloud Recording documentation](https://docs.agora.io/en/cloud-recording/overview/product-overview) to keep learning.