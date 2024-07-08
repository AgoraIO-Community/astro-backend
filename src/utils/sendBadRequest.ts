const sendBadRequest = (reason: string) => {
    const headers = new Headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    });

    return new Response(reason, { status: 400, headers });
}

export default sendBadRequest;
