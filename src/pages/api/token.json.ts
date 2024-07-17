import agoraToken from "agora-token";
import type { APIContext } from "astro";
import { sendBadRequest, sendSuccessfulResponse } from "../../utils/sendResponse";

const APP_ID = import.meta.env.APP_ID;
const APP_CERTIFICATE = import.meta.env.APP_CERTIFICATE;

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



    const token = await handleGenerateToken({ channel, role: agoraRole, uid, expireTime })

    return sendSuccessfulResponse({ token })
}

export async function handleGenerateToken({ channel, role, uid, expireTime }: { channel: string, role: number, uid: string, expireTime: number }) {
    return agoraToken.RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channel, uid, role, expireTime, expireTime);
}