
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Loader2 } from 'lucide-react';

// Import refactored components
import DemoBasicInfo from './form/DemoBasicInfo';
import CategoriesSelection from './form/CategoriesSelection';
import ArtistProfile from './form/ArtistProfile';
import AudioUpload from './form/AudioUpload';
import TermsAgreement from './form/TermsAgreement';
import { useSubmissionForm } from './hooks/useSubmissionForm';

const SubmissionForm: React.FC = () => {
  const { form, isSubmitting, audioFiles, addAudioFiles, removeAudioFile, 
    audioPreviews, uploadProgress, selectedCategories, categories, 
    handleCategoryToggle, onSubmit } = useSubmissionForm();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Envie sua Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <DemoBasicInfo />
                
                <CategoriesSelection 
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                />
                
                <ArtistProfile />
                
                <AudioUpload 
                  audioFiles={audioFiles}
                  onAddAudioFiles={addAudioFiles}
                  onRemoveAudioFile={removeAudioFile}
                  audioPreviews={audioPreviews}
                  uploadProgress={uploadProgress}
                />
                
                <TermsAgreement />
              </div>
              
              <CardFooter className="px-0 pb-0">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Music className="h-4 w-4 mr-2" />
                      Enviar Demo
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default SubmissionForm;
