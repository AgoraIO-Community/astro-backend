---
title: Build a Real Time Transcription Backend with Astro
description: Learn how to build a backend to initiate Real Time Transcription using Astro.
---

50% of Americans watch content with subtitles. Why can't we have this with video calls? Actually, we can using Real Time Transcription with Agora.

This guide is the third part in a series about building backends with Astro. The first guide covered Token Generation with Astro, so we can secure our video calls. We will use the token generation logic in this guide. The second guide was about recording your video to a storage provider of your choice. Real Time Transcription is a separate feature, so it does not rely on the cloud recording guide, but we will need to generate tokens. Let's get started.

## Prerequisites
1. NodeJS and Astro installed.
2. A developer account with [Agora](https://console.agora.io/).
3. A token generator built with Astro. Find the [guide here](https://github.com/AgoraIO-Community/astro-backend/blob/main/docs/TOKENS.md).

## Project Setup
This guide will build upon the [token generator guide](https://github.com/AgoraIO-Community/astro-backend/blob/main/docs/TOKENS.md). The token generator guide walks through the process of building the `api/tokens.json` endpoint, which returns a token used to secure your video calls. This endpoint uses a `handleGenerateToken` function that handles token generation logic. Since it is in the same backend server, we will use this function directly within the real time transcription endpoint.

From the previous guide, you should have `APP_ID` and the `APP_CERTIFICATE` in your environment variables. We will use the `APP_ID` for both starting and stopping the transcription.

## Real Time Transcription Overview

## Enable Agora RESTful API
This whole guide relies on a connection to the Agora RESTful API. To connect to it, you will need a Customer ID and Customer Secret. You can find these by going into the Agora Console, selecting the RESTful API tab under Developer Toolkit, and clicking the "Add a Secret" button. Then, copy these values and store them in a `CUSTOMER_ID` and a `CUSTOMER_SECRET` environment variable.

![RESTful API in Console](assets/restful-api.png)

## Define an Endpoint

## Make Request Helper Functions
The rest of this guide will focus on the implementation of Cloud Recording, which includes calling the Agora API. To simplify the code and have a uniform request structure, we will set up a helper function in `utils/makeRequest.ts`. 

The `makeRequest` function defines all the headers, executes the request, and returns the response. 

The inputs will need the `method` (we will use GET and POST), `url`, `body`, and the `credential`. 

```ts
export const makeRequest = async (method: string, url: string, credential: string, body?: string) => {
    const headers = new Headers({
        "Authorization": "basic " + credential,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": `${method}, OPTIONS`,
    });

    const res = await fetch(url, {
        method: method,
        headers: headers,
        body: body
    })
    if (!res.ok) {
        console.log(await res.text())
        throw new Error("Failed to make request")
    }
    return res
}
```

Another helper function in `utils/generateCredential.ts` will generate this credential. It is a base-64 encoded credential using the Customer ID and Customer Secret.

```ts
export const generateCredential = () => {
const credential = import.meta.env.CUSTOMER_ID + ":" + import.meta.env.CUSTOMER_SECRET

const base64_credential = btoa(credential)
return base64_credential
}
```

## Generate Transcription Resource

## Start Transcribing

## Stop Transcribing

