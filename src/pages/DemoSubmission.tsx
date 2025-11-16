
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/layout/MainLayout';
import SubmissionForm from '@/components/demo/SubmissionForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserDemoList } from '@/components/demo/UserDemoList';
import { Music, ListMusic } from 'lucide-react';

const DemoSubmission: React.FC = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Demo Submission | JESTFLY</title>
      </Helmet>
      
      <div className="container max-w-4xl py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Demo Submission</h1>
          <p className="text-muted-foreground">
            Envie sua música e receba feedback dos nossos curadores
          </p>
        </div>
        
        <Tabs defaultValue="submit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="submit" className="flex items-center">
              <Music className="h-4 w-4 mr-2" /> Enviar Demo
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center">
              <ListMusic className="h-4 w-4 mr-2" /> Minhas Demos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="submit">
            <SubmissionForm />
          </TabsContent>
          
          <TabsContent value="list">
            <UserDemoList />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DemoSubmission;
