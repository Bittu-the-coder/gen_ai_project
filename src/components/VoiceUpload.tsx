import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Upload, Sparkles, Clock, Languages } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const VoiceUpload = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const startRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording started",
      description: "Speak about your product...",
    });

    // Simulate recording for demo
    setTimeout(() => {
      setIsRecording(false);
      setHasRecording(true);
      toast({
        title: "Recording completed",
        description: "Click 'Generate with AI' to process your voice note",
      });
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const generateWithAI = () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setAiResult({
        title: "Handcrafted Ceramic Bowl Set",
        description: "Beautiful set of 4 ceramic bowls, each uniquely glazed with traditional patterns. Perfect for serving food or as decorative pieces. Made using eco-friendly clay and natural glazes.",
        price: "₹1,899",
        story: "These bowls represent 3 generations of pottery-making knowledge. Each piece is shaped by hand on the potter's wheel and fired in our traditional kiln. The blue and white patterns are inspired by the peacocks that visit our village every morning.",
        hashtags: ["#HandmadePottery", "#CeramicArt", "#TraditionalCrafts", "#EcoFriendly", "#IndianArtisan"],
        reelScripts: [
          "Watch me shape clay into beautiful bowls using techniques passed down for generations...",
          "From wet clay to finished masterpiece - the journey of handmade ceramics...",
          "Every morning, peacocks inspire the patterns I paint on these ceramic bowls..."
        ]
      });
      toast({
        title: "AI Magic Complete!",
        description: "Your product story has been generated",
      });
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 shadow-warm">
        <CardContent className="space-y-8">
          {/* Voice Recording Section */}
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <div className={`absolute inset-0 rounded-full ${isRecording ? 'animate-pulse bg-primary/20' : ''}`}></div>
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                className={`relative w-24 h-24 rounded-full ${
                  !isRecording 
                    ? 'bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow' 
                    : ''
                }`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <Square className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-semibold">
                {isRecording ? "Recording..." : hasRecording ? "Recording Ready" : "Start Voice Recording"}
              </h4>
              <p className="text-muted-foreground">
                {isRecording 
                  ? "Tell us about your product - materials, story, inspiration..." 
                  : hasRecording 
                    ? "Your voice note is ready for AI processing"
                    : "Click the mic and describe your handmade product"
                }
              </p>
            </div>

            {hasRecording && !isProcessing && !aiResult && (
              <Button 
                size="lg" 
                onClick={generateWithAI}
                className="bg-gradient-to-r from-accent to-primary-glow"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Generate with AI
              </Button>
            )}

            {isProcessing && (
              <div className="flex items-center justify-center space-x-2 text-primary">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>AI is creating your product story...</span>
              </div>
            )}
          </div>

          {/* AI Generated Result */}
          {aiResult && (
            <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-border">
              <Card className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h5 className="font-semibold">Product Details</h5>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Title:</span>
                    <p className="font-medium">{aiResult.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <p className="font-medium text-primary">{aiResult.price}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Description:</span>
                    <p className="text-sm">{aiResult.description}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Languages className="h-5 w-5 text-primary" />
                  <h5 className="font-semibold">Artisan Story</h5>
                </div>
                <p className="text-sm leading-relaxed">{aiResult.story}</p>
              </Card>

              {/* Social Media Content */}
              <Card className="p-6 space-y-4 md:col-span-2">
                <h5 className="font-semibold">Social Media Kit</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Instagram Reel Scripts:</span>
                    <ul className="mt-2 space-y-2">
                      {aiResult.reelScripts.map((script: string, index: number) => (
                        <li key={index} className="text-sm p-2 bg-muted/50 rounded">
                          {script}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">SEO Hashtags:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {aiResult.hashtags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="md:col-span-2 flex flex-wrap gap-4 pt-4">
                <Button className="bg-gradient-to-r from-primary to-primary-glow">
                  Publish to Marketplace
                </Button>
                <Button variant="outline">
                  Export to WhatsApp Catalog
                </Button>
                <Button variant="outline">
                  Download Instagram Kit
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};