import type { APIContext } from "astro";
import generateCredential from "../../../utils/generateCredential";
import generateResource from "../../../utils/generateResource";
import makeRequest from "../../../utils/makeRequest";
import sendBadRequest from "../../../utils/sendBadRequest";
import { handleGetToken } from "../token.json";

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

    const token = await handleGetToken({ channel: channel, role: 1, uid: uid.toString(), expireTime: 45 })
    const credential = generateCredential()
    const resourceId = await generateResource(channel, credential, uid.toString(), APP_ID)


    const url = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`
    const payload = {
        "cname": channel,
        "uid": uid.toString(),
        "clientRequest": {
            "token": token,
            "recordingConfig": {
                "maxIdleTime": 3,
            },

            "storageConfig": {
                "secretKey": SECRET_KEY,
                "vendor": 1,
                "region": 1,
                "bucket": BUCKET_NAME,
                "accessKey": ACCESS_KEY,
                "fileNamePrefix": [
                    "agora",
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

    const res = await makeRequest(url, credential, JSON.stringify(payload))
    const data = await res.json()
    const sid = data.sid


    return new Response(JSON.stringify({
        resourceId: resourceId,
        sid: sid
    }), { status: 200 })
}


