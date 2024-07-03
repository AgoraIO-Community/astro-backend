import agoraToken from "agora-token";
import type { APIContext } from "astro";

const APP_ID = import.meta.env.APP_ID;
const APP_CERTIFICATE = import.meta.env.APP_CERTIFICATE;

export async function GET({ params }: APIContext) {
    // Set CORS headers
    const headers = new Headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
    });

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

    const token = await handleGetToken({ channel: params.channel, role: role, uid: params.uid })

    return new Response(JSON.stringify({
        rtcToken: token
    }), { headers })
}

export async function handleGetToken({ channel, role, uid }: { channel: string, role: number, uid: string }) {
    const expireTime = 45;
    const privilegeExpireTime = 45;

    return agoraToken.RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channel, uid, role, expireTime, privilegeExpireTime);
}
