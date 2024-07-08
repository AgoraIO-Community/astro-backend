import type { APIContext } from "astro";
import generateCredential from "../../../utils/generateCredential";
import makeRequest from "../../../utils/makeRequest";
import sendBadRequest from "../../../utils/sendBadRequest";

const APP_ID = import.meta.env.APP_ID;

export async function POST({ request }: APIContext) {
    const { sid, resourceId, uid, channel } = await request.json()

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

    const res = await makeRequest(url, credential, JSON.stringify(payload))
    const data = await res.json()

    return new Response(JSON.stringify(data), { status: 200 })
}