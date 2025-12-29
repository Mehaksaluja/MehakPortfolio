import Vapi from "@vapi-ai/web";

// Validate environment variables
const apiKey = import.meta.env.VITE_VAPI_API_KEY;
const assistantId = import.meta.env.VITE_ASSISTANT_ID;

if (!apiKey) {
  console.warn('VITE_VAPI_API_KEY is not set. Please add it to your .env file.');
}

if (!assistantId) {
  console.warn('VITE_ASSISTANT_ID is not set. Please add it to your .env file.');
}

// Initialize Vapi client with API key
// According to latest docs: new Vapi('YOUR_PUBLIC_API_KEY')
export const vapi = new Vapi(apiKey || '');

/**
 * Start a voice assistant call with optional user information
 * @param {string} firstname - User's first name
 * @param {string} lastname - User's last name
 * @param {string} email - User's email address
 * @param {string} phone - User's phone number
 * @returns {Promise<Call|null>} The call object or null if already started
 */
export const startAssistant = async (firstname, lastname, email, phone) => {
  if (!apiKey) {
    throw new Error('VAPI API Key is not configured. Please set VITE_VAPI_API_KEY in your .env file.');
  }

  if (!assistantId) {
    throw new Error('Assistant ID is not configured. Please set VITE_ASSISTANT_ID in your .env file.');
  }
  
  // Assistant overrides with variable values for personalization
  const assistantOverrides = {
    variableValues: {
      firstname,
      lastname,
      email,
      phone,
    },
  };

  try {
    // Start the call with assistant ID and overrides
    // According to latest docs: vapi.start('YOUR_ASSISTANT_ID', assistantOverrides)
    return await vapi.start(assistantId, assistantOverrides);
  } catch (error) {
    console.error('Error starting assistant:', error);
    throw error;
  }
};

/**
 * Stop the current voice assistant call
 * Sends graceful shutdown message first, then properly stops and cleans up
 */
export const stopAssistant = async () => {
  try {
    // First send end-call message for graceful shutdown
    vapi.end();
    // end() calls stop() internally but doesn't await it
    // Since stop() is idempotent (checks if call exists), calling it again is safe
    // This ensures we properly await the cleanup
    await vapi.stop();
  } catch (error) {
    console.error('Error stopping assistant:', error);
    throw error;
  }
};