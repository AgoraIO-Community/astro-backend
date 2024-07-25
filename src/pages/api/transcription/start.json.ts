import type { APIContext } from "astro";
import { generateCredential } from "../../../utils/generateCredential";
import { generateRealTimeTranscriptionResource } from "../../../utils/generateResource";
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
    const builderToken = await generateRealTimeTranscriptionResource(channel, credential, APP_ID)
    const botToken = await handleGenerateToken({ channel: channel, role: 1, uid: botUid, expireTime: 3600 })
    const outputToken = await handleGenerateToken({ channel: channel, role: 2, uid: outputUid, expireTime: 3600 })

    const url = `https://api.agora.io/v1/projects/${APP_ID}/rtsc/speech-to-text/tasks?builderToken=${builderToken}`
    const body = {
        "audio": {
            "subscribeSource": "AGORARTC",
            "agoraRtcConfig": {
                "channelName": channel,
                "uid": botUid,
                "token": botToken,
                "channelType": "LIVE_TYPE",
                "subscribeConfig": {
                    "subscribeMode": "CHANNEL_MODE"
                }
            }
        },
        "config": {
            "features": [
                "RECOGNIZE"
            ],
            "recognizeConfig": {
                "language": "en-US,es-ES",
                "model": "Model",
                "output": {
                    "destinations": [
                        "AgoraRTCDataStream",
                    ],
                    "agoraRTCDataStream": {
                        "channelName": channel,
                        "uid": outputUid,
                        "token": outputToken
                    }
                }
            }
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