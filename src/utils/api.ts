export const isAzureEndpoint = (endpoint: string) => {
  return endpoint.includes('openai.azure.com');
};

export const isOpenRouterEndpoint = (endpoint: string) => {
  return endpoint.includes('openrouter.ai');
};