const makeRequest = async (url: string, credential: string, body: string) => {
    const headers = new Headers({
        "Authorization": "basic " + credential,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    });

    const res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body
    })
    if (!res.ok) {
        console.log(await res.text())
        throw new Error("Failed to make request")
    }
    return res
}

export default makeRequest
