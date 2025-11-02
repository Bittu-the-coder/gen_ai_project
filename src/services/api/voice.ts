// Voice API Service
import apiClient from './client';
import type {
  ProductGenerationResponse,
  VoiceTranscriptionResult,
} from './types';

export const voiceApi = {
  // Transcribe audio file to text
  transcribeAudio: async (
    audioFile: File
  ): Promise<VoiceTranscriptionResult> => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await apiClient.post('/voice/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Generate product listing from voice/text
  generateProduct: async (params: {
    text?: string;
    audio_url?: string;
  }): Promise<ProductGenerationResponse> => {
    const response = await apiClient.post('/voice/generate', params);
    return response.data;
  },

  // Generate product from audio file directly
  generateProductFromAudio: async (
    audioFile: File
  ): Promise<ProductGenerationResponse> => {
    // First transcribe
    const transcription = await voiceApi.transcribeAudio(audioFile);

    // Then generate product
    return voiceApi.generateProduct({ text: transcription.transcript });
  },
};

export default voiceApi;
