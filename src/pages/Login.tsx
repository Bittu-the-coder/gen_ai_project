import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageToggle } from '@/components/LanguageToggle';

const Login = () => {
  const [language, setLanguage] = React.useState<'english' | 'hindi' | 'hinglish'>('english');
  const [showPassword, setShowPassword] = React.useState(false);

  const translations = {
    english: {
      welcomeBack: "Welcome Back",
      subtitle: "Sign in to your artisan account",
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      phone: "Phone Number",
      name: "Full Name",
      craft: "Your Craft",
      location: "Location",
      signIn: "Sign In",
      signUp: "Sign Up",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      signInHere: "Sign in here",
      signUpHere: "Sign up here",
      orContinueWith: "Or continue with",
      google: "Google",
      facebook: "Facebook",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
      enterPhone: "Enter your phone number",
      enterName: "Enter your full name",
      enterCraft: "e.g., Pottery, Textiles, Woodcraft",
      enterLocation: "e.g., Jaipur, Rajasthan",
      createAccount: "Create your artisan account",
      terms: "By signing up, you agree to our Terms of Service and Privacy Policy"
    },
    hindi: {
      welcomeBack: "वापसी पर स्वागत है",
      subtitle: "अपने कारीगर खाते में साइन इन करें",
      login: "लॉगिन",
      register: "पंजीकरण",
      email: "ईमेल",
      password: "पासवर्ड",
      phone: "फोन नंबर",
      name: "पूरा नाम",
      craft: "आपका शिल्प",
      location: "स्थान",
      signIn: "साइन इन करें",
      signUp: "साइन अप करें",
      forgotPassword: "पासवर्ड भूल गए?",
      noAccount: "खाता नहीं है?",
      hasAccount: "पहले से खाता है?",
      signInHere: "यहाँ साइन इन करें",
      signUpHere: "यहाँ साइन अप करें",
      orContinueWith: "या इसके साथ जारी रखें",
      google: "Google",
      facebook: "Facebook",
      enterEmail: "अपना ईमेल दर्ज करें",
      enterPassword: "अपना पासवर्ड दर्ज करें",
      enterPhone: "अपना फोन नंबर दर्ज करें",
      enterName: "अपना पूरा नाम दर्ज करें",
      enterCraft: "जैसे, मिट्टी के बर्तन, वस्त्र, लकड़ी का काम",
      enterLocation: "जैसे, जयपुर, राजस्थान",
      createAccount: "अपना कारीगर खाता बनाएं",
      terms: "साइन अप करके, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं"
    },
    hinglish: {
      welcomeBack: "Welcome Back",
      subtitle: "Apne artisan account mein sign in karo",
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      phone: "Phone Number",
      name: "Full Name",
      craft: "Aapka Craft",
      location: "Location",
      signIn: "Sign In karo",
      signUp: "Sign Up karo",
      forgotPassword: "Password bhool gaye?",
      noAccount: "Account nahi hai?",
      hasAccount: "Pehle se account hai?",
      signInHere: "Yahan sign in karo",
      signUpHere: "Yahan sign up karo",
      orContinueWith: "Ya iske saath continue karo",
      google: "Google",
      facebook: "Facebook",
      enterEmail: "Apna email enter karo",
      enterPassword: "Apna password enter karo",
      enterPhone: "Apna phone number enter karo",
      enterName: "Apna full name enter karo",
      enterCraft: "jaise, Pottery, Textiles, Woodcraft",
      enterLocation: "jaise, Jaipur, Rajasthan",
      createAccount: "Apna artisan account banao",
      terms: "Sign up karke, aap hamare Terms of Service aur Privacy Policy se agree karte hai"
    }
  };

  const t = translations[language];

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
            <Link to="/marketplace">
              <Button variant="outline">Marketplace</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-warm">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Mic className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">{t.welcomeBack}</CardTitle>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t.login}</TabsTrigger>
                <TabsTrigger value="register">{t.register}</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">{t.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t.enterEmail}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">{t.password}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t.enterPassword}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="link" className="p-0 h-auto text-sm">
                      {t.forgotPassword}
                    </Button>
                  </div>

                  <Link to="/dashboard">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm">
                      {t.signIn}
                    </Button>
                  </Link>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  {t.noAccount}{" "}
                  <Button variant="link" className="p-0 h-auto text-primary" onClick={() => {}}>
                    {t.signUpHere}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t.name}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t.enterName}
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-email">{t.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder={t.enterEmail}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">{t.phone}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t.enterPhone}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="craft">{t.craft}</Label>
                    <Input
                      id="craft"
                      type="text"
                      placeholder={t.enterCraft}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">{t.location}</Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder={t.enterLocation}
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-password">{t.password}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t.enterPassword}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {t.terms}
                  </p>

                  <Link to="/dashboard">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm">
                      {t.signUp}
                    </Button>
                  </Link>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  {t.hasAccount}{" "}
                  <Button variant="link" className="p-0 h-auto text-primary" onClick={() => {}}>
                    {t.signInHere}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4 mt-6">
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
                  {t.orContinueWith}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t.google}
                </Button>
                <Button variant="outline" className="w-full">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {t.facebook}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;