import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AppRoutes } from "@/components/AppRoutes";
import React from "react";

const queryClient = new QueryClient();

const App = () => {
  const [language, setLanguage] = React.useState<'english' | 'hindi' | 'hinglish'>('english');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Layout>
            <AppRoutes language={language} />
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
