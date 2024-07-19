import type { APIContext } from "astro";
import { generateCredential } from "../../../utils/generateCredential";
import { makeRequest } from "../../../utils/makeRequest";
import { sendBadRequest, sendSuccessfulResponse } from "../../../utils/sendResponse";

const APP_ID = import.meta.env.APP_ID;

export async function POST({ request }: APIContext) {
    const { uid, channel, sid, resourceId } = await request.json()

    if (!channel) {
        return sendBadRequest("channel is required")
    }
    if (!uid || uid === '') {
        return sendBadRequest("uid is required")
    }
    if (!sid) {
        return sendBadRequest("sid is required")
    }
    if (!resourceId) {
        return sendBadRequest("resourceId is required")
    }


    const credential = generateCredential()

    const url = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`
    const payload = {
        "cname": channel,
        "uid": uid.toString(),
        "clientRequest": {
        }
    }

    const res = await makeRequest("POST", url, credential, JSON.stringify(payload))
    const data = await res.json()

    return sendSuccessfulResponse(data)
}