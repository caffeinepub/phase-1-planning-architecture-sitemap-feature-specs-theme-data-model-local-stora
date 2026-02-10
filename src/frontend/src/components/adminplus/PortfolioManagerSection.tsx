import { useState } from 'react';
import { useGetAllPortfolios, useCreatePortfolio, useUpdatePortfolio, useGetPortfolioCategories } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import type { Portfolio, PortfolioCategory } from '../../backend';

export default function PortfolioManagerSection() {
  const { data: portfolios = [], isLoading } = useGetAllPortfolios();
  const { data: categories = [] } = useGetPortfolioCategories();
  const createMutation = useCreatePortfolio();
  const updateMutation = useUpdatePortfolio();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    artworks: '',
    category: 'painting' as string
  });

  const getCategoryFromString = (categoryStr: string): PortfolioCategory => {
    switch (categoryStr) {
      case 'painting':
        return { __kind__: 'painting', painting: null };
      case 'digitalArt':
        return { __kind__: 'digitalArt', digitalArt: null };
      case 'sculpture':
        return { __kind__: 'sculpture', sculpture: null };
      case 'photography':
        return { __kind__: 'photography', photography: null };
      case 'illustration':
        return { __kind__: 'illustration', illustration: null };
      case 'typography':
        return { __kind__: 'typography', typography: null };
      default:
        return { __kind__: 'other', other: categoryStr };
    }
  };

  const getCategoryString = (category: PortfolioCategory): string => {
    return category.__kind__;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const artworkIds = formData.artworks
      .split(',')
      .map(s => s.trim())
      .filter(s => s)
      .map(s => BigInt(s));

    const category = getCategoryFromString(formData.category);

    try {
      if (editingId !== null) {
        await updateMutation.mutateAsync({
          id: editingId,
          title: formData.title,
          description: formData.description,
          artworks: artworkIds,
          category,
        });
        toast.success('Portfolio updated successfully');
        setEditingId(null);
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          description: formData.description,
          artworks: artworkIds,
          category,
        });
        toast.success('Portfolio created successfully');
        setIsCreating(false);
      }
      setFormData({ title: '', description: '', artworks: '', category: 'painting' });
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (portfolio: Portfolio) => {
    setEditingId(portfolio.id);
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
      artworks: portfolio.artworks.map(id => id.toString()).join(', '),
      category: getCategoryString(portfolio.category),
    });
    setIsCreating(true);
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading portfolios...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Portfolio Manager</h3>
        <Button onClick={() => setIsCreating(!isCreating)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Portfolio
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId !== null ? 'Edit Portfolio' : 'Create New Portfolio'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="digitalArt">Digital Art</SelectItem>
                    <SelectItem value="sculpture">Sculpture</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="illustration">Illustration</SelectItem>
                    <SelectItem value="typography">Typography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="artworks">Artwork IDs (comma-separated)</Label>
                <Input
                  id="artworks"
                  value={formData.artworks}
                  onChange={(e) => setFormData({ ...formData, artworks: e.target.value })}
                  placeholder="1, 2, 3"
                />
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
                    setFormData({ title: '', description: '', artworks: '', category: 'painting' });
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
        {portfolios.length === 0 ? (
          <p className="text-muted-foreground">No portfolios yet.</p>
        ) : (
          portfolios.map((portfolio) => (
            <Card key={portfolio.id.toString()}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{portfolio.title}</CardTitle>
                    <CardDescription>{portfolio.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(portfolio)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Artworks: {portfolio.artworks.length > 0 ? portfolio.artworks.map(id => id.toString()).join(', ') : 'None'}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
