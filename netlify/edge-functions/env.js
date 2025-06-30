export default async (request, context) => {
  const value = Netlify.env.get("N8N_WEBHOOK_URL");

  return new Response(`Value of N8N_WEBHOOK_URL for ${context.site.name} is ${value}.`, {
    headers: { "content-type": "text/html" },
  });
};