import { makeRequest } from "./makeRequest"

export const generateResource = async (channel: string, credential: string, uid: string, appId: string) => {

    const payload = {
        "cname": channel,
        "uid": uid,
        "clientRequest": {}
    }

    const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/acquire`

    const res = await makeRequest("POST", url, credential, JSON.stringify(payload))
    const data = await res.json()
    const resourceId = data["resourceId"]

    return resourceId
}