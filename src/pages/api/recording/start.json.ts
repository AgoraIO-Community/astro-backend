import agoraToken from "agora-token";
import type { APIContext } from "astro";
import { generateCredential } from "../../../utils/generateCredential";
import { generateCloudRecordingResource } from "../../../utils/generateResource";
import { makeRequest } from "../../../utils/makeRequest";
import { sendBadRequest, sendSuccessfulResponse } from "../../../utils/sendResponse";
import { handleGenerateToken } from "../token.json";

const APP_ID = import.meta.env.APP_ID;
const SECRET_KEY = import.meta.env.SECRET_KEY;
const ACCESS_KEY = import.meta.env.ACCESS_KEY;
const BUCKET_NAME = import.meta.env.BUCKET_NAME;

export async function POST({ request }: APIContext) {
    const { channel } = await request.json()

    if (!channel) {
        return sendBadRequest("channel is required")
    }

    const recordingUid = "1"
    const credential = generateCredential()
    const resourceId = await generateCloudRecordingResource(channel, credential, recordingUid, APP_ID)
    const token = await handleGenerateToken({ channel: channel, role: agoraToken.RtcRole.PUBLISHER, uid: recordingUid, expireTime: 3600 })


    const url = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`
    const body = {
        "cname": channel,
        "uid": recordingUid,
        "clientRequest": {
            "token": token,
            "storageConfig": {
                "secretKey": SECRET_KEY,
                "vendor": 1,
                "region": 1,
                "bucket": BUCKET_NAME,
                "accessKey": ACCESS_KEY,
                "fileNamePrefix": [
                    "recording",
                    Date.now().toString()
                ]
            },
            "recordingFileConfig": {
                "avFileType": [
                    "hls",
                    "mp4"
                ]
            },
        },
    }

    const res = await makeRequest("POST", url, credential, JSON.stringify(body))
    const data = await res.json()
    const sid = data.sid


    return sendSuccessfulResponse({
        resourceId: resourceId,
        sid: sid
    })
}