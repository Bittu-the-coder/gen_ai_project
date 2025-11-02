import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, Upload as UploadIcon, Wand2, Sparkles, 
  Camera, FileText, Hash, Instagram, MessageSquare, ArrowLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageToggle } from '@/components/LanguageToggle';
import { VoiceUpload } from '@/components/VoiceUpload';

const Upload = () => {
  const [language, setLanguage] = React.useState<'english' | 'hindi' | 'hinglish'>('english');
  const [step, setStep] = React.useState(1);

  const translations = {
    english: {
      title: "Create Product with Voice",
      subtitle: "Upload a voice note and let AI create your product story in 60 seconds",
      backToDashboard: "Back to Dashboard",
      step1: "Upload Voice Note",
      step2: "AI Magic in Progress", 
      step3: "Review & Publish",
      voiceInstructions: "Record or upload a voice note describing your product. Include details about materials, crafting process, inspiration, and what makes it special.",
      uploadImage: "Upload Product Images",
      dragDrop: "Drag & drop images here, or click to select",
      aiGenerated: "AI Generated Content",
      productTitle: "Product Title",
      description: "Description",
      price: "Suggested Price",
      artisanStory: "Artisan Story",
      socialContent: "Social Media Content",
      hashtags: "Hashtags",
      instagramReels: "Instagram Reel Scripts",
      whatsappCatalog: "WhatsApp Catalog",
      category: "Category",
      selectCategory: "Select Category",
      pottery: "Pottery",
      textiles: "Textiles",
      woodcraft: "Woodcraft", 
      jewelry: "Jewelry",
      publish: "Publish Product",
      saveAsDraft: "Save as Draft",
      processing: "Processing your voice note...",
      almostDone: "Almost done! Generating your product content..."
    },
    hindi: {
      title: "आवाज़ से उत्पाद बनाएं",
      subtitle: "एक आवाज़ का नोट अपलोड करें और AI को 60 सेकंड में आपकी उत्पाद कहानी बनाने दें",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
      step1: "आवाज़ नोट अपलोड करें",
      step2: "AI जादू प्रगति में",
      step3: "समीक्षा और प्रकाशित करें", 
      voiceInstructions: "अपने उत्पाद का वर्णन करते हुए एक आवाज़ नोट रिकॉर्ड या अपलोड करें। सामग्री, शिल्प प्रक्रिया, प्रेरणा और इसे विशेष बनाने वाली बातों के विवरण शामिल करें।",
      uploadImage: "उत्पाद छवियां अपलोड करें",  
      dragDrop: "छवियों को यहां खींचें और छोड़ें, या चुनने के लिए क्लिक करें",
      aiGenerated: "AI द्वारा जेनरेट की गई सामग्री",
      productTitle: "उत्पाद शीर्षक",
      description: "विवरण",
      price: "सुझाया गया मूल्य",
      artisanStory: "कारीगर की कहानी",
      socialContent: "सोशल मीडिया सामग्री",
      hashtags: "हैशटैग",
      instagramReels: "Instagram रील स्क्रिप्ट",
      whatsappCatalog: "WhatsApp कैटलॉग",
      category: "श्रेणी",
      selectCategory: "श्रेणी चुनें",
      pottery: "मिट्टी के बर्तन",
      textiles: "वस्त्र",
      woodcraft: "लकड़ी का काम",
      jewelry: "आभूषण",
      publish: "उत्पाद प्रकाशित करें",
      saveAsDraft: "मसौदे के रूप में सेव करें",
      processing: "आपकी आवाज़ नोट प्रोसेस हो रही है...",
      almostDone: "लगभग हो गया! आपकी उत्पाद सामग्री जेनरेट हो रही है..."
    },
    hinglish: {
      title: "Voice se Product banao",
      subtitle: "Voice note upload karo aur AI ko 60 seconds mein aapki product story banane do",
      backToDashboard: "Dashboard pe wapas jao",
      step1: "Voice Note Upload karo",
      step2: "AI Magic Progress mein",
      step3: "Review aur Publish karo",
      voiceInstructions: "Apne product ke baare mein voice note record ya upload karo. Materials, crafting process, inspiration aur kya special hai ye sab include karo.",
      uploadImage: "Product Images Upload karo",
      dragDrop: "Images yahan drag & drop karo, ya select karne ke liye click karo",
      aiGenerated: "AI Generated Content",
      productTitle: "Product Title",
      description: "Description", 
      price: "Suggested Price",
      artisanStory: "Artisan ki Story",
      socialContent: "Social Media Content",
      hashtags: "Hashtags",
      instagramReels: "Instagram Reel Scripts",
      whatsappCatalog: "WhatsApp Catalog",
      category: "Category",
      selectCategory: "Category select karo",
      pottery: "Pottery",
      textiles: "Textiles",
      woodcraft: "Woodcraft",
      jewelry: "Jewelry", 
      publish: "Product Publish karo",
      saveAsDraft: "Draft mein save karo",
      processing: "Aapka voice note process ho raha hai...",
      almostDone: "Almost done! Aapka product content generate ho raha hai..."
    }
  };

  const t = translations[language];

  // Mock AI generated content for demo
  const aiContent = {
    title: "Handcrafted Terracotta Water Pitcher",
    description: "This beautiful terracotta water pitcher is handcrafted using traditional techniques passed down through generations. Made from natural clay sourced locally, each pitcher is unique with its own character and charm. The porous nature of terracotta keeps water naturally cool and adds essential minerals, making it perfect for daily use.",
    price: "₹899",
    story: "I learned this craft from my grandmother when I was just 10 years old. Every morning, I would sit beside her as she shaped the clay with such grace and precision. This pitcher represents 15 years of dedication to preserving our traditional pottery techniques. The clay comes from the riverbank near our village, and each piece is fired in our traditional wood kiln.",
    hashtags: "#HandmadeInIndia #TraditionalPottery #EcoFriendly #Terracotta #Sustainable #LocalCraft #ArtisanMade #NaturalClay #IndianCrafts #HandcraftedLove",
    reelScripts: [
      "Watch how this traditional water pitcher comes to life! From raw clay to finished masterpiece in 60 seconds ✨ Each piece tells a story of generations #HandmadeInIndia",
      "Why terracotta water pitchers are making a comeback! 🏺 Natural cooling, eco-friendly, and adds minerals to your water. Swipe to see the making process!",
      "POV: You're watching a master potter at work 👩‍🎨 15 years of experience in every piece. Comment 'CRAFT' if you love handmade products! #TraditionalArt"
    ],
    whatsappText: "🏺 *Handcrafted Terracotta Water Pitcher*\n\n✨ Made with traditional techniques\n🌿 Eco-friendly & sustainable\n💧 Keeps water naturally cool\n🎨 Each piece is unique\n\n*Price: ₹899*\n*Free delivery in Jaipur*\n\nOrder now: Just reply with 'PITCHER' 📱"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Voice-to-Shop
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
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
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                1
              </div>
              <span className="font-medium">{t.step1}</span>
            </div>
            
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <span className="font-medium">{t.step2}</span>
            </div>
            
            <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className="font-medium">{t.step3}</span>
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
                  {t.step1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{t.voiceInstructions}</p>
                <VoiceUpload />
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setStep(2)}
                    className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm"
                    size="lg"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate with AI
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  {t.uploadImage}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <UploadIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">{t.dragDrop}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold mb-2">{t.processing}</h3>
                <p className="text-muted-foreground mb-6">{t.almostDone}</p>
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Magic in Progress...</span>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="mt-8">
                  <Button 
                    onClick={() => setStep(3)}
                    variant="outline"
                  >
                    Skip to Results (Demo)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-4 w-4 mr-2" />
                {t.aiGenerated}
              </Badge>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
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
                      <Input id="title" value={aiContent.title} />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">{t.description}</Label>
                      <Textarea id="description" value={aiContent.description} rows={4} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">{t.price}</Label>
                        <Input id="price" value={aiContent.price} />
                      </div>
                      <div>
                        <Label htmlFor="category">{t.category}</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectCategory} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pottery">{t.pottery}</SelectItem>
                            <SelectItem value="textiles">{t.textiles}</SelectItem>
                            <SelectItem value="woodcraft">{t.woodcraft}</SelectItem>
                            <SelectItem value="jewelry">{t.jewelry}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="story">{t.artisanStory}</Label>
                      <Textarea id="story" value={aiContent.story} rows={3} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Media Content */}
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
                      <Textarea id="hashtags" value={aiContent.hashtags} rows={2} />
                    </div>

                    <Separator />

                    <div>
                      <Label className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        {t.instagramReels}
                      </Label>
                      <div className="space-y-2 mt-2">
                        {aiContent.reelScripts.map((script, index) => (
                          <Textarea 
                            key={index} 
                            value={script} 
                            rows={2}
                            className="text-sm"
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
                      <Textarea value={aiContent.whatsappText} rows={4} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm"
              >
                <UploadIcon className="h-4 w-4 mr-2" />
                {t.publish}
              </Button>
              <Button size="lg" variant="outline">
                {t.saveAsDraft}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;