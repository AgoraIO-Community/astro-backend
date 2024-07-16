import type { APIContext } from "astro";
import generateCredential from "../../../utils/generateCredential";
import { makeGetRequest } from "../../../utils/makeRequest";
import { sendBadRequest, sendSuccessfulResponse } from "../../../utils/sendResponse";

const APP_ID = import.meta.env.APP_ID;

export async function POST({ request }: APIContext) {
    const { sid, resourceId } = await request.json()

    if (!sid) {
        return sendBadRequest("sid is required")
    }
    if (!resourceId) {
        return sendBadRequest("resourceId is required")
    }


    const credential = generateCredential()

    const url = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/query`

    const res = await makeGetRequest(url, credential)
    const data = await res.json()

    return sendSuccessfulResponse(data)
}