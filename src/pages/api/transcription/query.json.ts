import type { APIContext } from "astro";
import { generateCredential } from "../../../utils/generateCredential";
import { makeRequest } from "../../../utils/makeRequest";
import { sendBadRequest, sendSuccessfulResponse } from "../../../utils/sendResponse";

const APP_ID = import.meta.env.APP_ID;

export async function POST({ request }: APIContext) {
    const { taskId, builderToken } = await request.json()

    if (!taskId) {
        return sendBadRequest("taskId is required")
    }
    if (!builderToken) {
        return sendBadRequest("builderToken is required")
    }


    const credential = generateCredential()

    const url = `https://api.agora.io/v1/projects/${APP_ID}/rtsc/speech-to-text/tasks/${taskId}?builderToken=${builderToken}`

    const res = await makeRequest("GET", url, credential)
    const data = await res.json()

    return sendSuccessfulResponse(data)
}