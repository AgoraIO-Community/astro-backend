const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
});

export const sendBadRequest = (reason: string) => {
    return new Response(reason, { status: 400, headers });
}

export const sendSuccessfulResponse = (data: any) => {
    return new Response(JSON.stringify(data), { status: 200, headers });
}

