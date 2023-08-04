import { v4 as uuidv4 } from 'uuid';
import { ChatInterface, ConfigInterface, ModelOptions, ModelMaxToken, ModelCost } from '@type/chat';
import useStore from '@store/store';

const date = new Date();
const dateString =
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2);

// default system message obtained using the following method: https://twitter.com/DeminDimin/status/1619935545144279040
export const _defaultSystemMessage =
  import.meta.env.VITE_DEFAULT_SYSTEM_MESSAGE ??
  `You are a large language model.
Carefully heed the user's instructions. 
Respond using Markdown.`;

export async function initaliseModelData(): Promise<boolean>
{
  var hasCompleted = false;
  await fetch('https://openrouter.ai/api/v1/models')
    .then(response => response.json())
    .then(data =>
    {
      // clear default arrays
      modelOptions = [];
      defaultModel = "";
      modelMaxToken = {};
      modelCost = {};

      // @ts-ignore
      modelOptions = data.data.map(model => model.id);

      if (modelOptions.length > 0)
      {
        defaultModel = modelOptions[0];
      }

      // @ts-ignore
      data.data.forEach(model =>
      {
        modelMaxToken[model.id] = model.context_length;

        modelCost[model.id] = {
          prompt: { price: parseFloat(model.pricing.prompt), unit: 1 },
          completion: { price: parseFloat(model.pricing.completion), unit: 1 },
        }; 
      });

      hasCompleted = true;
    })
    .catch(error =>
    {
      console.error('Error:', error)
    });

  return hasCompleted;
}

export var modelOptions: ModelOptions[] = [
  'openai/gpt-3.5-turbo',
  'openai/gpt-3.5-turbo-16k',
  'openai/gpt-4',
  'openai/gpt-4-32k',
  'anthropic/claude-2',
  'anthropic/claude-instant-v1',
  'google/palm-2-chat-bison',
  'google/palm-2-codechat-bison',
  'meta-llama/llama-2-13b-chat',
  'meta-llama/llama-2-70b-chat'
];

export var defaultModel = 'openai/gpt-3.5-turbo';

export var modelMaxToken: ModelMaxToken = {
  'openai/gpt-3.5-turbo': 4096,
  'openai/gpt-3.5-turbo-16k': 16384,
  'openai/gpt-4': 8192,
  'openai/gpt-4-32k': 32768,
  'anthropic/claude-2': 100000,
  'anthropic/claude-instant-v1': 100000,
  'google/palm-2-chat-bison': 8000,
  'google/palm-2-codechat-bison': 8000,
  'meta-llama/llama-2-13b-chat': 100000,
  'meta-llama/llama-2-70b-chat': 100000,
};

export var modelCost: ModelCost = {
  'openai/gpt-3.5-turbo': {
    prompt: { price: 0.0015, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },
  'openai/gpt-3.5-turbo-16k': {
    prompt: { price: 0.003, unit: 1000 },
    completion: { price: 0.004, unit: 1000 },
  },
  'openai/gpt-4': {
    prompt: { price: 0.03, unit: 1000 },
    completion: { price: 0.06, unit: 1000 },
  },
  'openai/gpt-4-32k': {
    prompt: { price: 0.06, unit: 1000 },
    completion: { price: 0.12, unit: 1000 },
  },
  'anthropic/claude-2': {
    prompt: { price: 0.00163, unit: 1000 },
    completion: { price: 0.00551, unit: 1000 },
  },
  'anthropic/claude-instant-v1': {
    prompt: { price: 0.01102, unit: 1000 },
    completion: { price: 0.03268, unit: 1000 },
  },
  'google/palm-2-chat-bison': {
    prompt: { price: 0.002, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },
  'google/palm-2-codechat-bison': {
    prompt: { price: 0.002, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },
  'meta-llama/llama-2-13b-chat': {
    prompt: { price: 0.004, unit: 1000 },
    completion: { price: 0.004, unit: 1000 },
  },
  'meta-llama/llama-2-70b-chat': {
    prompt: { price: 0.016, unit: 1000 },
    completion: { price: 0.016, unit: 1000 },
  },
};

export const defaultUserMaxToken = 4000;

export const _defaultChatConfig: ConfigInterface = {
  model: defaultModel,
  max_tokens: defaultUserMaxToken,
  temperature: 1,
  presence_penalty: 0,
  top_p: 1,
  frequency_penalty: 0,
};

export const generateDefaultChat = (
  title?: string,
  folder?: string
): ChatInterface => ({
  id: uuidv4(),
  title: title ? title : 'New Chat',
  messages:
    useStore.getState().defaultSystemMessage.length > 0
      ? [{ role: 'system', content: useStore.getState().defaultSystemMessage }]
      : [],
  config: { ...useStore.getState().defaultChatConfig },
  titleSet: false,
  folder,
});

export const codeLanguageSubset = [
  'python',
  'javascript',
  'java',
  'go',
  'bash',
  'c',
  'cpp',
  'csharp',
  'css',
  'diff',
  'graphql',
  'json',
  'kotlin',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objectivec',
  'perl',
  'php',
  'php-template',
  'plaintext',
  'python-repl',
  'r',
  'ruby',
  'rust',
  'scss',
  'shell',
  'sql',
  'swift',
  'typescript',
  'vbnet',
  'wasm',
  'xml',
  'yaml',
];
