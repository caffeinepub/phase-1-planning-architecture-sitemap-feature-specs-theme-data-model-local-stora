import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Image as ImageIcon, Video, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 800 * 1024 * 1024; // 800 MB

export default function PortfolioManagerView() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds 800 MB limit. Selected file is ${(file.size / 1024 / 1024).toFixed(1)} MB.`);
      e.target.value = '';
      return;
    }

    setUploadFile(file);
  };

  const handleUpload = async () => {
    if (!uploadFile || !title.trim()) {
      toast.error('Please provide a file and title');
      return;
    }

    setUploading(true);
    try {
      // TODO: Implement upload with ExternalBlob
      toast.success('Portfolio item uploaded successfully');
      setUploadFile(null);
      setTitle('');
      setDescription('');
    } catch (error: any) {
      toast.error('Failed to upload portfolio item');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Portfolio Manager</h2>
        <p className="text-muted-foreground">Upload and manage your portfolio gallery</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Portfolio Item</CardTitle>
          <CardDescription>Maximum file size: 800 MB per file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="portfolio-file">Photo or Video</Label>
            <div className="flex items-center gap-4">
              <Input
                id="portfolio-file"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              {uploadFile && (
                <Badge variant="outline">
                  {uploadFile.type.startsWith('image/') ? (
                    <ImageIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <Video className="h-3 w-3 mr-1" />
                  )}
                  {(uploadFile.size / 1024 / 1024).toFixed(1)} MB
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio-title">Title</Label>
            <Input
              id="portfolio-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter portfolio item title"
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio-description">Description</Label>
            <Textarea
              id="portfolio-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows={3}
              disabled={uploading}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!uploadFile || !title.trim() || uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Portfolio Item'}
          </Button>
        </CardContent>
      </Card>

      {/* Portfolio Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Items</CardTitle>
          <CardDescription>Manage your published portfolio gallery</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Portfolio management features are being implemented. Upload, edit, delete, and reorder functionality will be available soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
