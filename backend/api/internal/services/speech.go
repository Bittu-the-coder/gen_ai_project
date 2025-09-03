package services

import (
	"context"
	"fmt"
	"io"

	speech "cloud.google.com/go/speech/apiv1"
	"cloud.google.com/go/speech/apiv1/speechpb"
)

type SpeechToTextService struct {
	client *speech.Client
	ctx    context.Context
}

type TranscriptionResult struct {
	Transcript   string     `json:"transcript"`
	Confidence   float32    `json:"confidence"`
	Language     string     `json:"language"`
	Duration     float64    `json:"duration"`
	Alternatives []string   `json:"alternatives,omitempty"`
	Words        []WordInfo `json:"words,omitempty"`
}

type WordInfo struct {
	Word       string  `json:"word"`
	StartTime  float64 `json:"start_time"`
	EndTime    float64 `json:"end_time"`
	Confidence float32 `json:"confidence"`
}

func NewSpeechToTextService(ctx context.Context) (*SpeechToTextService, error) {
	client, err := speech.NewClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create speech client: %v", err)
	}

	return &SpeechToTextService{
		client: client,
		ctx:    ctx,
	}, nil
}

func (s *SpeechToTextService) Close() error {
	return s.client.Close()
}

// TranscribeAudio transcribes audio from a file
func (s *SpeechToTextService) TranscribeAudio(audioData []byte, languageCode string) (*TranscriptionResult, error) {
	req := &speechpb.RecognizeRequest{
		Config: &speechpb.RecognitionConfig{
			Encoding:                   speechpb.RecognitionConfig_MP3, // Adjust based on audio format
			SampleRateHertz:            16000,
			LanguageCode:               languageCode,
			EnableWordTimeOffsets:      true,
			EnableAutomaticPunctuation: true,
			Model:                      "latest_long", // Use latest model for better accuracy
			AudioChannelCount:          1,
			UseEnhanced:                true,
		},
		Audio: &speechpb.RecognitionAudio{
			AudioSource: &speechpb.RecognitionAudio_Content{Content: audioData},
		},
	}

	resp, err := s.client.Recognize(s.ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to recognize speech: %v", err)
	}

	if len(resp.Results) == 0 {
		return &TranscriptionResult{
			Transcript: "",
			Confidence: 0,
			Language:   languageCode,
		}, nil
	}

	result := resp.Results[0]
	alternative := result.Alternatives[0]

	// Extract word timing information
	var words []WordInfo
	for _, word := range alternative.Words {
		words = append(words, WordInfo{
			Word:       word.Word,
			StartTime:  float64(word.StartTime.Seconds) + float64(word.StartTime.Nanos)/1e9,
			EndTime:    float64(word.EndTime.Seconds) + float64(word.EndTime.Nanos)/1e9,
			Confidence: word.Confidence,
		})
	}

	// Get alternative transcriptions
	var alternatives []string
	for i := 1; i < len(result.Alternatives) && i < 3; i++ {
		alternatives = append(alternatives, result.Alternatives[i].Transcript)
	}

	// Calculate duration from word timings
	var duration float64
	if len(words) > 0 {
		duration = words[len(words)-1].EndTime
	}

	return &TranscriptionResult{
		Transcript:   alternative.Transcript,
		Confidence:   alternative.Confidence,
		Language:     languageCode,
		Duration:     duration,
		Alternatives: alternatives,
		Words:        words,
	}, nil
}

// TranscribeAudioStream transcribes audio from a stream (for real-time processing)
func (s *SpeechToTextService) TranscribeAudioStream(audioStream io.Reader, languageCode string) (*TranscriptionResult, error) {
	stream, err := s.client.StreamingRecognize(s.ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create streaming recognize: %v", err)
	}

	// Send the initial configuration message
	req := &speechpb.StreamingRecognizeRequest{
		StreamingRequest: &speechpb.StreamingRecognizeRequest_StreamingConfig{
			StreamingConfig: &speechpb.StreamingRecognitionConfig{
				Config: &speechpb.RecognitionConfig{
					Encoding:                   speechpb.RecognitionConfig_LINEAR16,
					SampleRateHertz:            16000,
					LanguageCode:               languageCode,
					EnableWordTimeOffsets:      true,
					EnableAutomaticPunctuation: true,
				},
				InterimResults: true,
			},
		},
	}

	if err := stream.Send(req); err != nil {
		return nil, fmt.Errorf("failed to send config: %v", err)
	}

	// Read audio data and send it
	go func() {
		defer stream.CloseSend()

		buf := make([]byte, 1024)
		for {
			n, err := audioStream.Read(buf)
			if err == io.EOF {
				break
			}
			if err != nil {
				return
			}

			req := &speechpb.StreamingRecognizeRequest{
				StreamingRequest: &speechpb.StreamingRecognizeRequest_AudioContent{
					AudioContent: buf[:n],
				},
			}

			if err := stream.Send(req); err != nil {
				return
			}
		}
	}()

	// Receive and process results
	var finalTranscript string
	var confidence float32
	var words []WordInfo

	for {
		resp, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("failed to receive response: %v", err)
		}

		for _, result := range resp.Results {
			if result.IsFinal {
				alternative := result.Alternatives[0]
				finalTranscript = alternative.Transcript
				confidence = alternative.Confidence

				// Extract word information
				for _, word := range alternative.Words {
					words = append(words, WordInfo{
						Word:       word.Word,
						StartTime:  float64(word.StartTime.Seconds) + float64(word.StartTime.Nanos)/1e9,
						EndTime:    float64(word.EndTime.Seconds) + float64(word.EndTime.Nanos)/1e9,
						Confidence: word.Confidence,
					})
				}
			}
		}
	}

	var duration float64
	if len(words) > 0 {
		duration = words[len(words)-1].EndTime
	}

	return &TranscriptionResult{
		Transcript: finalTranscript,
		Confidence: confidence,
		Language:   languageCode,
		Duration:   duration,
		Words:      words,
	}, nil
}

// DetectLanguage detects the language of the audio
func (s *SpeechToTextService) DetectLanguage(audioData []byte) (string, error) {
	req := &speechpb.RecognizeRequest{
		Config: &speechpb.RecognitionConfig{
			Encoding:                 speechpb.RecognitionConfig_MP3,
			SampleRateHertz:          16000,
			LanguageCode:             "auto",                              // Auto-detect language
			AlternativeLanguageCodes: []string{"hi-IN", "en-IN", "en-US"}, // Hindi, Indian English, US English
		},
		Audio: &speechpb.RecognitionAudio{
			AudioSource: &speechpb.RecognitionAudio_Content{Content: audioData},
		},
	}

	resp, err := s.client.Recognize(s.ctx, req)
	if err != nil {
		return "", fmt.Errorf("failed to detect language: %v", err)
	}

	if len(resp.Results) > 0 {
		return resp.Results[0].LanguageCode, nil
	}

	return "en-US", nil // Default to English
}
