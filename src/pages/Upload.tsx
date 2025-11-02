import { LanguageToggle } from '@/components/LanguageToggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AIGeneratedContent, productsApi } from '@/services/api';
import {
  ArrowLeft,
  Camera,
  FileText,
  Hash,
  Instagram,
  Loader2,
  MessageSquare,
  Mic,
  Sparkles,
  Upload as UploadIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'english' | 'hindi' | 'hinglish'>(
    'english'
  );
  const [step, setStep] = useState(1);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [generatedContent, setGeneratedContent] =
    useState<AIGeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    story: '',
  });
  const { toast } = useToast();

  // Show loading while checking authentication
  if (user === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  const translations = {
    english: {
      title: 'Add New Product',
      subtitle:
        'Upload media and create your product listing in a few simple steps',
      backToDashboard: 'Back to Dashboard',
      step1: 'Upload Media',
      step2: 'AI Processing',
      step3: 'Product Details',
      voiceInstructions:
        'Optionally upload a voice note about your product. You can also skip this and add details manually.',
      uploadImage: 'Upload Product Images',
      dragDrop: 'Drag & drop images here, or click to select',
      aiGenerated: 'AI Generated Content',
      productTitle: 'Product Title',
      description: 'Description',
      price: 'Price (₹)',
      artisanStory: 'Artisan Story',
      socialContent: 'Social Media Content',
      hashtags: 'Hashtags',
      instagramReels: 'Instagram Reel Scripts',
      whatsappCatalog: 'WhatsApp Catalog',
      category: 'Category',
      selectCategory: 'Select Category',
      pottery: 'Pottery',
      textiles: 'Textiles',
      woodcraft: 'Woodcraft',
      jewelry: 'Jewelry',
      publish: 'Publish Product',
      saveAsDraft: 'Save as Draft',
      processing: 'Processing your voice note...',
      almostDone: 'Almost done! Generating your product content...',
      selectAudio: 'Select Audio File',
      generateAI: 'Generate with AI',
      errorUpload: 'Failed to upload audio',
      errorGenerate: 'Failed to generate product',
      successPublish: 'Product published successfully!',
      uploadAudioFirst: 'Please upload an audio file first',
    },
    hindi: {
      title: 'आवाज़ से उत्पाद बनाएं',
      subtitle:
        'एक आवाज़ का नोट अपलोड करें और AI को 60 सेकंड में आपकी उत्पाद कहानी बनाने दें',
      backToDashboard: 'डैशबोर्ड पर वापस जाएं',
      step1: 'आवाज़ नोट अपलोड करें',
      step2: 'AI जादू प्रगति में',
      step3: 'समीक्षा और प्रकाशित करें',
      voiceInstructions:
        'अपने उत्पाद का वर्णन करते हुए एक आवाज़ नोट रिकॉर्ड या अपलोड करें।',
      uploadImage: 'उत्पाद छवियां अपलोड करें',
      dragDrop: 'छवियों को यहां खींचें और छोड़ें',
      aiGenerated: 'AI द्वारा जेनरेट की गई सामग्री',
      productTitle: 'उत्पाद शीर्षक',
      description: 'विवरण',
      price: 'मूल्य (₹)',
      artisanStory: 'कारीगर की कहानी',
      socialContent: 'सोशल मीडिया सामग्री',
      hashtags: 'हैशटैग',
      instagramReels: 'Instagram रील स्क्रिप्ट',
      whatsappCatalog: 'WhatsApp कैटलॉग',
      category: 'श्रेणी',
      selectCategory: 'श्रेणी चुनें',
      pottery: 'मिट्टी के बर्तन',
      textiles: 'वस्त्र',
      woodcraft: 'लकड़ी का काम',
      jewelry: 'आभूषण',
      publish: 'प्रकाशित करें',
      saveAsDraft: 'मसौदे में सेव करें',
      processing: 'आपकी आवाज़ नोट प्रोसेस हो रही है...',
      almostDone: 'लगभग हो गया!',
      selectAudio: 'ऑडियो फ़ाइल चुनें',
      generateAI: 'AI से जेनरेट करें',
      errorUpload: 'ऑडियो अपलोड विफल',
      errorGenerate: 'उत्पाद जेनरेट करने में विफल',
      successPublish: 'उत्पाद सफलतापूर्वक प्रकाशित!',
      uploadAudioFirst: 'कृपया पहले ऑडियो फ़ाइल अपलोड करें',
    },
    hinglish: {
      title: 'Voice se Product banao',
      subtitle: 'Voice note upload karo aur AI ko product story banane do',
      backToDashboard: 'Dashboard pe wapas',
      step1: 'Voice Note Upload karo',
      step2: 'AI Magic Progress mein',
      step3: 'Review aur Publish karo',
      voiceInstructions: 'Apne product ke baare mein voice note upload karo।',
      uploadImage: 'Product Images Upload karo',
      dragDrop: 'Images yahan drag & drop karo',
      aiGenerated: 'AI Generated Content',
      productTitle: 'Product Title',
      description: 'Description',
      price: 'Price (₹)',
      artisanStory: 'Artisan ki Story',
      socialContent: 'Social Media Content',
      hashtags: 'Hashtags',
      instagramReels: 'Instagram Reel Scripts',
      whatsappCatalog: 'WhatsApp Catalog',
      category: 'Category',
      selectCategory: 'Category select karo',
      pottery: 'Pottery',
      textiles: 'Textiles',
      woodcraft: 'Woodcraft',
      jewelry: 'Jewelry',
      publish: 'Publish karo',
      saveAsDraft: 'Draft mein save karo',
      processing: 'Aapka voice note process ho raha hai...',
      almostDone: 'Almost done!',
      selectAudio: 'Audio File select karo',
      generateAI: 'AI se Generate karo',
      errorUpload: 'Audio upload fail',
      errorGenerate: 'Product generate karne mein problem',
      successPublish: 'Product successfully publish ho gaya!',
      uploadAudioFirst: 'Pehle audio file upload karo',
    },
  };

  const t = translations[language];

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Audio file change detected:', e.target.files);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('Selected file:', file.name, file.type, file.size);
      setAudioFile(file);
      toast({
        title: 'File Selected',
        description: `Selected ${file.name}`,
      });
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Images change detected:', e.target.files);
    if (e.target.files) {
      const files = Array.from(e.target.files);
      console.log(
        'Selected images:',
        files.map(f => ({ name: f.name, type: f.type, size: f.size }))
      );
      setProductImages(files);
      toast({
        title: 'Images Selected',
        description: `Selected ${files.length} image(s)`,
      });
    }
  };

  const handleGenerateProduct = async () => {
    console.log('Generate product clicked');
    // Skip audio requirement for now - allow direct product creation
    try {
      setLoading(true);
      setStep(2);

      console.log('Generating mock content...');
      // Mock AI generated content for testing
      const mockContent = {
        product_title: 'Handcrafted Pottery Set',
        product_description:
          'Beautiful handcrafted pottery made using traditional techniques',
        price: 2999,
        category: 'pottery',
        artisan_story:
          'Each piece is carefully crafted by skilled artisans using methods passed down through generations.',
        hashtags: ['#handmade', '#pottery', '#traditional', '#artisan'],
        seo_keywords: [
          'handcrafted pottery',
          'traditional ceramics',
          'artisan pottery',
        ],
        social_media_content: {
          instagram_reel: 'Watch our artisans create beautiful pottery!',
          whatsapp_catalog: 'Handcrafted pottery available for order',
        },
      };

      setGeneratedContent(mockContent);
      setProductData({
        title: mockContent.product_title,
        description: mockContent.product_description,
        price: mockContent.price,
        category: mockContent.category,
        story: mockContent.artisan_story,
      });
      setStep(3);

      toast({
        title: 'Content Generated!',
        description: 'Product content generated successfully',
      });
    } catch (error) {
      console.error('Failed to generate product:', error);
      toast({
        title: t.errorGenerate || 'Error',
        description: 'Please try again',
        variant: 'destructive',
      });
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishProduct = async () => {
    console.log('Publish product clicked', productData);

    // Validate required fields
    if (!productData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Product title is required',
        variant: 'destructive',
      });
      return;
    }

    if (!productData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Product description is required',
        variant: 'destructive',
      });
      return;
    }

    if (productData.price <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Product price must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    if (!productData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please select a category',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const product = await productsApi.createProduct({
        title: productData.title,
        description: productData.description,
        price: productData.price,
        currency: 'INR',
        category: productData.category,
        status: 'active',
        stock: 1,
        materials: generatedContent?.product_title
          ? [generatedContent.product_title]
          : [],
        tags: generatedContent?.hashtags || [],
        seo_keywords: generatedContent?.seo_keywords || [],
        ai_generated_content: generatedContent,
      });

      // Upload images if any
      if (productImages.length > 0 && product.id) {
        await productsApi.uploadProductImages(product.id, productImages);
      }

      toast({
        title: t.successPublish || 'Product Published!',
        description: 'Your product has been successfully created',
      });

      // Redirect to the new product detail page so the creator can see it immediately
      if (product && product.id) {
        navigate(`/product/${product.id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to publish product:', error);
      toast({
        title: 'Failed to publish',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              VoiceCraft Market
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageToggle
              language={language}
              onLanguageChange={setLanguage}
            />
            <Link to="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.backToDashboard}
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center gap-2 ${
                step >= 1 ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                1
              </div>
              <span className="font-medium hidden sm:block">{t.step1}</span>
            </div>

            <div
              className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}
            />

            <div
              className={`flex items-center gap-2 ${
                step >= 2 ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                2
              </div>
              <span className="font-medium hidden sm:block">{t.step2}</span>
            </div>

            <div
              className={`w-12 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}
            />

            <div
              className={`flex items-center gap-2 ${
                step >= 3 ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                3
              </div>
              <span className="font-medium hidden sm:block">{t.step3}</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Voice Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" />
                  Voice Note (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{t.voiceInstructions}</p>

                <div className="border-2 border-dashed border-primary/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className="cursor-pointer block"
                  >
                    <Mic
                      className={`h-12 w-12 mx-auto mb-4 ${
                        audioFile ? 'text-primary' : 'text-primary/50'
                      }`}
                    />
                    <p className="text-muted-foreground mb-2">
                      {audioFile
                        ? `✓ ${audioFile.name}`
                        : t.selectAudio || 'Select Audio File'}
                    </p>
                    <Button
                      variant="outline"
                      type="button"
                      className="mt-2"
                      asChild
                    >
                      <span>
                        <UploadIcon className="h-4 w-4 mr-2" />
                        {audioFile ? 'Change File' : 'Choose File'}
                      </span>
                    </Button>
                  </label>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    Audio upload is optional. You can add product details
                    manually in the next step.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  {t.uploadImage || 'Upload Product Images'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block"
                  >
                    <Camera
                      className={`h-12 w-12 mx-auto mb-4 ${
                        productImages.length > 0
                          ? 'text-primary'
                          : 'text-muted-foreground/50'
                      }`}
                    />
                    <p className="text-muted-foreground mb-2">
                      {productImages.length > 0
                        ? `✓ ${productImages.length} image(s) selected`
                        : t.dragDrop ||
                          'Drag & drop images here, or click to select'}
                    </p>
                    <Button
                      variant="outline"
                      type="button"
                      className="mt-2"
                      asChild
                    >
                      <span>
                        <UploadIcon className="h-4 w-4 mr-2" />
                        {productImages.length > 0
                          ? 'Change Images'
                          : 'Select Images'}
                      </span>
                    </Button>
                  </label>
                </div>

                {/* Show selected images */}
                {productImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Selected images:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {productImages.map((file, index) => (
                        <div key={index} className="bg-muted rounded p-2">
                          <p className="text-xs truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => {
                  console.log('Next button clicked - going to step 3');
                  // Initialize with empty product data for manual entry
                  setProductData({
                    title: '',
                    description: '',
                    price: 0,
                    category: '',
                    story: '',
                  });
                  setStep(3);
                }}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm"
                size="lg"
              >
                Next: Add Product Details
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-primary" />
                <h3 className="text-xl font-semibold mb-2">{t.processing}</h3>
                <p className="text-muted-foreground mb-6">{t.almostDone}</p>
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    AI Magic in Progress...
                  </span>
                  <Sparkles className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            {generatedContent && (
              <div className="text-center">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t.aiGenerated || 'AI Generated'}
                </Badge>
              </div>
            )}

            <div
              className={`grid gap-8 ${
                generatedContent ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'
              }`}
            >
              {/* Product Details */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Product Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">{t.productTitle}</Label>
                      <Input
                        id="title"
                        value={productData.title}
                        onChange={e =>
                          setProductData({
                            ...productData,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">{t.description}</Label>
                      <Textarea
                        id="description"
                        value={productData.description}
                        onChange={e =>
                          setProductData({
                            ...productData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">{t.price}</Label>
                        <Input
                          id="price"
                          type="number"
                          value={productData.price}
                          onChange={e =>
                            setProductData({
                              ...productData,
                              price: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">{t.category}</Label>
                        <Select
                          value={productData.category}
                          onValueChange={value =>
                            setProductData({ ...productData, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectCategory} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pottery">{t.pottery}</SelectItem>
                            <SelectItem value="textiles">
                              {t.textiles}
                            </SelectItem>
                            <SelectItem value="woodcraft">
                              {t.woodcraft}
                            </SelectItem>
                            <SelectItem value="jewelry">{t.jewelry}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="story">{t.artisanStory}</Label>
                      <Textarea
                        id="story"
                        value={productData.story}
                        onChange={e =>
                          setProductData({
                            ...productData,
                            story: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Media Content - Only show if AI generated content exists */}
              {generatedContent && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Hash className="h-5 w-5 text-primary" />
                        {t.socialContent}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="hashtags">{t.hashtags}</Label>
                        <Textarea
                          id="hashtags"
                          value={generatedContent?.hashtags?.join(' ') || ''}
                          rows={2}
                          readOnly
                        />
                      </div>

                      <Separator />

                      <div>
                        <Label className="flex items-center gap-2">
                          <Instagram className="h-4 w-4" />
                          {t.instagramReels}
                        </Label>
                        <div className="space-y-2 mt-2">
                          {(generatedContent?.social_media_content
                            ?.instagram_reel
                            ? [
                                generatedContent.social_media_content
                                  .instagram_reel,
                              ]
                            : []
                          ).map((reel, index) => (
                            <Textarea
                              key={index}
                              value={reel}
                              rows={2}
                              className="text-sm"
                              readOnly
                            />
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          {t.whatsappCatalog}
                        </Label>
                        <Textarea
                          value={
                            generatedContent?.social_media_content
                              ?.whatsapp_catalog || ''
                          }
                          rows={4}
                          className="mt-2"
                          readOnly
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm"
                onClick={handlePublishProduct}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    {t.publish}
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={() => setStep(1)}>
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
