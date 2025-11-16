
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Check, AlertTriangle, Loader2 } from 'lucide-react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadProgressIndicatorProps {
  progress: number;
  status: UploadStatus;
  fileName?: string;
  fileSize?: string;
  error?: string;
}

const UploadProgressIndicator: React.FC<UploadProgressIndicatorProps> = ({
  progress,
  status,
  fileName,
  fileSize,
  error
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'idle':
        return <Music className="h-5 w-5 text-muted-foreground" />;
      case 'uploading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-center mb-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center mr-3">
            {getStatusIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {fileName || 'No file selected'}
            </p>
            {fileSize && <p className="text-xs text-muted-foreground">{fileSize}</p>}
          </div>
        </div>
        
        <Progress value={progress} className="h-2 mb-2" />
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">
            {status === 'idle' && 'Ready to upload'}
            {status === 'uploading' && `Uploading... ${progress}%`}
            {status === 'success' && 'Upload complete'}
            {status === 'error' && (error || 'Upload failed')}
          </span>
          {status === 'uploading' && (
            <span className="font-medium">{progress}%</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadProgressIndicator;
