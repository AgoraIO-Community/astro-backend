import agoraToken from "agora-token";
import type { APIContext } from "astro";

const APP_ID = import.meta.env.APP_ID;
const APP_CERTIFICATE = import.meta.env.APP_CERTIFICATE;

export async function GET({ params }: APIContext): Promise<Response> {
    // Set CORS headers
    const headers = new Headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    });

    //check for valid channel
    if (!params.channel) {
        return new Response("channel is required", { status: 400, headers })
    }
    //check for valid role
    let role;
    if (params.role === 'publisher') {
        role = agoraToken.RtcRole.PUBLISHER;
    } else if (params.role === 'audience') {
        role = agoraToken.RtcRole.SUBSCRIBER
    } else {
        return new Response("role is incorrect", { status: 400, headers })
    }
    //check for valid uid
    if (!params.uid || params.uid === '') {
        return new Response("uid is required", { status: 400, headers })
    }
    //check for valid tokentype
    const expireTime = 600;
    const privilegeExpireTime = 600;
    let token;
    if (params.tokentype === 'userAccount') {
        token = agoraToken.RtcTokenBuilder.buildTokenWithUserAccount(APP_ID, APP_CERTIFICATE, params.channel, params.uid, role, expireTime, privilegeExpireTime);
    } else if (params.tokentype === 'uid') {
        token = agoraToken.RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, params.channel, params.uid, role, expireTime, privilegeExpireTime);
    } else {
        return new Response("token type is invalid", { status: 400, headers })
    }
    return new Response(JSON.stringify({
        rtcToken: token
    }), { headers })
}


