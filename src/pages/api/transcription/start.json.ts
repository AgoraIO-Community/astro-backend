import type { APIContext } from "astro";
import { generateCredential } from "../../../utils/generateCredential";
import { generateRealTimeTranscriptionResource } from "../../../utils/generateResource";
import { makeRequest } from "../../../utils/makeRequest";
import { sendBadRequest, sendSuccessfulResponse } from "../../../utils/sendResponse";
import { handleGenerateToken } from "../token.json";

const APP_ID = import.meta.env.APP_ID;
const SECRET_KEY = import.meta.env.SECRET_KEY;
const ACCESS_KEY = import.meta.env.ACCESS_KEY;
const BUCKET_NAME = import.meta.env.BUCKET_NAME;

export async function POST({ request }: APIContext) {
    const { uid, channel } = await request.json()

    if (!channel) {
        return sendBadRequest("channel is required")
    }
    if (!uid || uid === '') {
        return sendBadRequest("uid is required")
    }

    const credential = generateCredential()
    const builderToken = await generateRealTimeTranscriptionResource(channel, credential, APP_ID)
    const token = await handleGenerateToken({ channel: channel, role: 1, uid: uid.toString(), expireTime: 3600 })


    const url = `https://api.agora.io/v1/projects/${APP_ID}/rtsc/speech-to-text/tasks?builderToken=${builderToken}`
    const payload = {
        "audio": {
            "subscribeSource": "AGORARTC",
            "agoraRtcConfig": {
                "channelName": channel,
                "uid": "100",
                "token": token,
                "channelType": "LIVE_TYPE",
                "subscribeConfig": {
                    "subscribeMode": "CHANNEL_MODE"
                },
                "maxIdleTime": 60
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
                        "Storage"
                    ],
                    "agoraRTCDataStream": {
                        "channelName": channel,
                        "uid": "101",
                        "token": token
                    },
                    "cloudStorage": [
                        {
                            "format": "HLS",
                            "storageConfig": {
                                "accessKey": ACCESS_KEY,
                                "secretKey": SECRET_KEY,
                                "bucket": BUCKET_NAME,
                                "vendor": 1,
                                "region": 1,
                                "fileNamePrefix": [
                                    "rtt"
                                ]
                            }
                        }
                    ]
                }
            }
        }
    }

    const res = await makeRequest("POST", url, credential, JSON.stringify(payload))
    const data = await res.json()
    const taskId = data.taskId


    return sendSuccessfulResponse({
        taskId: taskId,
        builderToken: builderToken,
    })
}