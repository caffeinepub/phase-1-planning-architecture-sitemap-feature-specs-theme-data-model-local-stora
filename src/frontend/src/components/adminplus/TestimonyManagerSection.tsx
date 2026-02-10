import { useState } from 'react';
import { useGetAllApprovedTestimonies, useCreateTestimony, useUpdateTestimony } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Testimony } from '../../backend';

export default function TestimonyManagerSection() {
  const { data: testimonies = [], isLoading } = useGetAllApprovedTestimonies();
  const createMutation = useCreateTestimony();
  const updateMutation = useUpdateTestimony();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [formData, setFormData] = useState({ 
    author: '', 
    content: '', 
    approved: false,
    rating: '' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const rating = formData.rating.trim() ? BigInt(formData.rating) : null;

    try {
      if (editingId !== null) {
        // Find the existing testimony to get photo and video
        const existingTestimony = testimonies.find(t => t.id === editingId);
        
        await updateMutation.mutateAsync({
          id: editingId,
          author: formData.author,
          content: formData.content,
          approved: formData.approved,
          rating,
          photo: existingTestimony?.photo || null,
          video: existingTestimony?.video || null,
        });
        toast.success('Testimony updated successfully');
        setEditingId(null);
      } else {
        await createMutation.mutateAsync({
          author: formData.author,
          content: formData.content,
          rating,
          photo: null,
          video: null,
        });
        toast.success('Testimony created successfully');
        setIsCreating(false);
      }
      setFormData({ author: '', content: '', approved: false, rating: '' });
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (testimony: Testimony) => {
    setEditingId(testimony.id);
    setFormData({
      author: testimony.author,
      content: testimony.content,
      approved: testimony.approved,
      rating: testimony.rating !== undefined && testimony.rating !== null ? testimony.rating.toString() : '',
    });
    setIsCreating(true);
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading testimonies...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Testimony Manager</h3>
        <Button onClick={() => setIsCreating(!isCreating)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Testimony
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId !== null ? 'Edit Testimony' : 'Create New Testimony'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (1-5, optional)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="Leave empty for no rating"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="approved"
                  checked={formData.approved}
                  onCheckedChange={(checked) => setFormData({ ...formData, approved: checked as boolean })}
                />
                <Label htmlFor="approved" className="cursor-pointer">
                  Approved
                </Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId !== null ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setFormData({ author: '', content: '', approved: false, rating: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {testimonies.length === 0 ? (
          <p className="text-muted-foreground">No testimonies yet.</p>
        ) : (
          testimonies.map((testimony) => (
            <Card key={testimony.id.toString()}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{testimony.author}</CardTitle>
                      <Badge variant={testimony.approved ? 'default' : 'secondary'}>
                        {testimony.approved ? 'Approved' : 'Pending'}
                      </Badge>
                      {testimony.rating !== undefined && testimony.rating !== null && (
                        <Badge variant="outline">
                          {testimony.rating.toString()} ⭐
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2">{testimony.content}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(testimony)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
