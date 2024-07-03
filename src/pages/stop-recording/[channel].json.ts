import type { APIContext } from "astro";
import generateCredential from "../../utils/generateCredential";
import makeRequest from "../../utils/makeRequest";

const APP_ID = import.meta.env.APP_ID;

export async function POST({ params, request }: APIContext) {
    if (!params.channel) {
        return new Response("channel is required", { status: 400 })
    }
    const body = await request.json()
    const sid = body.sid
    const resourceId = body.resourceId
    const uid = body.uid


    const credential = generateCredential()

    const url = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`
    const payload = {
        "cname": params.channel,
        "uid": uid.toString(),
        "clientRequest": {
        }
    }

    const res = await makeRequest(url, credential, JSON.stringify(payload))
    const data = await res.json()

    return new Response(JSON.stringify(data), { status: 200 })
}