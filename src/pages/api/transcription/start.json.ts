import agoraToken from "agora-token";
import type { APIContext } from "astro";
import { generateCredential } from "../../../utils/generateCredential";
import { generateSpeechToTextResource } from "../../../utils/generateResource";
import { makeRequest } from "../../../utils/makeRequest";
import { sendBadRequest, sendSuccessfulResponse } from "../../../utils/sendResponse";
import { handleGenerateToken } from "../token.json";

const APP_ID = import.meta.env.APP_ID;

export async function POST({ request }: APIContext) {
    const { channel } = await request.json()

    if (!channel) {
        return sendBadRequest("channel is required")
    }

    const botUid = "2"
    const outputUid = "3"

    const credential = generateCredential()
    const builderToken = await generateSpeechToTextResource(channel, credential, APP_ID)
    const botToken = await handleGenerateToken({ channel: channel, role: agoraToken.RtcRole.PUBLISHER, uid: botUid, expireTime: 3600 })
    const outputToken = await handleGenerateToken({ channel: channel, role: agoraToken.RtcRole.PUBLISHER, uid: outputUid, expireTime: 3600 })

    const url = `https://api.agora.io/v1/projects/${APP_ID}/rtsc/speech-to-text/tasks?builderToken=${builderToken}`


    const body = {
        "languages": [
            "en-US"
        ],
        "maxIdleTime": 60,
        "rtcConfig": {
            "channelName": channel,
            "subBotUid": botUid,
            "subBotToken": botToken,
            "pubBotUid": outputUid,
            "pubBotToken": outputToken
        }
    }

    const res = await makeRequest("POST", url, credential, JSON.stringify(body))
    const data = await res.json()
    const taskId = data.taskId

    return sendSuccessfulResponse({
        taskId: taskId,
        builderToken: builderToken,
    })
}