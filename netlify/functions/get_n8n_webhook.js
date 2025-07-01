exports.handler = async (event, context) => {
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Successfully fetched data (using the secret)",
        }),
    };
};