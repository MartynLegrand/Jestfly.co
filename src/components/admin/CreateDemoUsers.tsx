
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const CreateDemoUsers = () => {
  const [adminSecret, setAdminSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleCreateUsers = async () => {
    if (!adminSecret) {
      toast({
        title: "Admin secret required",
        description: "Please enter the admin secret to continue",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-demo-users', {
        body: { adminSecret }
      });

      if (error) {
        throw error;
      }

      setResults(data.results);
      
      const successCount = data.results.filter((r: any) => r.success).length;
      toast({
        title: "Operation completed",
        description: `${successCount} out of ${data.results.length} operations were successful.`,
        variant: successCount === data.results.length ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error creating demo users:', error);
      toast({
        title: "Error creating demo users",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Create Demo Users</CardTitle>
        <CardDescription>
          This will create test users with the specified credentials and make saintgang an admin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="adminSecret">
              Admin Secret
            </label>
            <Input
              id="adminSecret"
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              placeholder="Enter admin secret"
            />
          </div>

          {results.length > 0 && (
            <div className="border rounded-md p-4 mt-4">
              <h3 className="font-medium mb-2">Results:</h3>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <p><strong>{result.email}</strong></p>
                      {result.success ? (
                        <p className="text-green-600">{result.message || 'Success'}</p>
                      ) : (
                        <p className="text-red-600">{result.error || 'Failed'}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateUsers} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Create Demo Users'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateDemoUsers;
