import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Upload, Camera, X, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { compressImage, validateImageFile } from './utils/imageUtils';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string) => void;
  studentName?: string;
}

export function PhotoUpload({ currentPhoto, onPhotoChange, studentName }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentPhoto || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      // Compress image for better performance and storage
      const compressedImage = await compressImage(file, 0.8, 800);
      setPreviewUrl(compressedImage);
      onPhotoChange(compressedImage);
      toast.success('Photo uploaded and optimized successfully');
    } catch (error) {
      console.error('Image compression failed:', error);
      toast.error('Failed to process the image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl('');
    onPhotoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Photo removed');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>Student Photo</Label>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Photo Preview */}
        <div className="relative">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
            <AvatarImage src={previewUrl} alt={studentName || 'Student'} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {studentName ? studentName.split(' ').map(n => n[0]).join('').toUpperCase() : <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          
          {previewUrl && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemovePhoto}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-3">
          <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <Camera className="h-8 w-8 mx-auto text-blue-600" />
                <div className="text-sm text-blue-800">
                  Click to upload a student photo
                </div>
                <div className="text-xs text-blue-600">
                  Supports JPG, PNG, GIF (max 5MB)
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              disabled={isUploading}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </>
              )}
            </Button>

            {previewUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemovePhoto}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}