import { makeRequest } from "./makeRequest"

export const generateCloudRecordingResource = async (channel: string, credential: string, uid: string, appId: string) => {

    const body = {
        "cname": channel,
        "uid": uid,
        "clientRequest": {}
    }

    const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/acquire`

    const res = await makeRequest("POST", url, credential, JSON.stringify(body))
    const data = await res.json()
    const resourceId = data["resourceId"]

    return resourceId
}


export const generateSpeechToTextResource = async (channel: string, credential: string, appId: string) => {

    const body = {
        "instanceId": channel
    }

    const url = `https://api.agora.io/v1/projects/${appId}/rtsc/speech-to-text/builderTokens`

    const res = await makeRequest("POST", url, credential, JSON.stringify(body))
    const data = await res.json()
    const builderToken = data["tokenName"]

    return builderToken
}
