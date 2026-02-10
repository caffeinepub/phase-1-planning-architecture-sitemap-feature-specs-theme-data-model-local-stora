import { useState } from 'react';
import { useGetAllProducts } from '../../hooks/useQueries';
import { useQueuedCreateProduct, useQueuedEditProduct, useQueuedUpdateProductStock } from '../../hooks/useQueuedMutations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Loader2, Package } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import ErrorState from '../system/ErrorState';
import type { Product, Variant_dropOff_pickup_delivery } from '../../backend';
import { ExternalBlob } from '../../backend';

export default function AdminProductsTab() {
  const { data: products = [], isLoading, error, refetch } = useGetAllProducts();
  const createProductMutation = useQueuedCreateProduct();
  const editProductMutation = useQueuedEditProduct();
  const updateStockMutation = useQueuedUpdateProductStock();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Create form state
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newShortDescription, setNewShortDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newIsInStock, setNewIsInStock] = useState(true);
  const [newAvailability, setNewAvailability] = useState<Variant_dropOff_pickup_delivery>('delivery' as Variant_dropOff_pickup_delivery);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editShortDescription, setEditShortDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editIsInStock, setEditIsInStock] = useState(true);
  const [editAvailability, setEditAvailability] = useState<Variant_dropOff_pickup_delivery>('delivery' as Variant_dropOff_pickup_delivery);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      if (isEdit) {
        setEditImageFile(file);
      } else {
        setNewImageFile(file);
      }
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim() || !newDescription.trim() || !newPrice || !newStock) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!newImageFile) {
      toast.error('Please select a product image');
      return;
    }

    const price = parseFloat(newPrice);
    const stock = parseInt(newStock, 10);

    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    try {
      const imageBytes = new Uint8Array(await newImageFile.arrayBuffer());
      const imageBlob = ExternalBlob.fromBytes(imageBytes);

      await createProductMutation.mutateAsync({
        name: newName.trim(),
        description: newDescription.trim(),
        price: BigInt(Math.floor(price * 100)),
        stock: BigInt(stock),
        image: imageBlob,
        isInStock: newIsInStock,
        availability: newAvailability,
        shortDescription: newShortDescription.trim() || newDescription.trim().substring(0, 100),
      });

      toast.success('Product created successfully');
      setNewName('');
      setNewDescription('');
      setNewShortDescription('');
      setNewPrice('');
      setNewStock('');
      setNewImageFile(null);
      setNewIsInStock(true);
      setNewAvailability('delivery' as Variant_dropOff_pickup_delivery);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create product:', error);
      if (error instanceof Error && error.message === 'Queued for offline sync') {
        toast.info('Product creation queued for when you\'re back online');
        setCreateDialogOpen(false);
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to create product');
      }
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) return;

    if (!editName.trim() || !editDescription.trim() || !editPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    const price = parseFloat(editPrice);

    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      let imageBlob = selectedProduct.image;

      if (editImageFile) {
        const imageBytes = new Uint8Array(await editImageFile.arrayBuffer());
        imageBlob = ExternalBlob.fromBytes(imageBytes);
      }

      await editProductMutation.mutateAsync({
        productId: selectedProduct.id,
        name: editName.trim(),
        description: editDescription.trim(),
        price: BigInt(Math.floor(price * 100)),
        image: imageBlob,
        isInStock: editIsInStock,
        availability: editAvailability,
        shortDescription: editShortDescription.trim() || editDescription.trim().substring(0, 100),
      });

      toast.success('Product updated successfully');
      setEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to edit product:', error);
      if (error instanceof Error && error.message === 'Queued for offline sync') {
        toast.info('Product update queued for when you\'re back online');
        setEditDialogOpen(false);
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to update product');
      }
    }
  };

  const handleUpdateStock = async (productId: bigint, newStockValue: string) => {
    const stock = parseInt(newStockValue, 10);

    if (isNaN(stock) || stock < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    try {
      await updateStockMutation.mutateAsync({
        productId,
        newStock: BigInt(stock),
      });
      toast.success('Stock updated successfully');
    } catch (error) {
      console.error('Failed to update stock:', error);
      if (error instanceof Error && error.message === 'Queued for offline sync') {
        toast.info('Stock update queued for when you\'re back online');
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to update stock');
      }
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setEditName(product.name);
    setEditDescription(product.description);
    setEditShortDescription(product.shortDescription || '');
    setEditPrice((Number(product.price) / 100).toString());
    setEditImageFile(null);
    setEditIsInStock(product.isInStock);
    setEditAvailability(product.availability);
    setEditDialogOpen(true);
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to load products"
        description={error instanceof Error ? error.message : 'An error occurred'}
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Products ({products.length})</h3>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleCreateProduct}>
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your shop. All fields are required.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">Product Name *</Label>
                  <Input
                    id="new-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-description">Description *</Label>
                  <Textarea
                    id="new-description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Enter product description"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-short-description">Short Description</Label>
                  <Textarea
                    id="new-short-description"
                    value={newShortDescription}
                    onChange={(e) => setNewShortDescription(e.target.value)}
                    placeholder="Brief description for product cards (optional)"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-price">Price (ICP) *</Label>
                    <Input
                      id="new-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-stock">Stock Quantity *</Label>
                    <Input
                      id="new-stock"
                      type="number"
                      min="0"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-image">Product Image *</Label>
                  <Input
                    id="new-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, false)}
                    required
                  />
                  {newImageFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {newImageFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-availability">Availability *</Label>
                  <Select value={newAvailability} onValueChange={(value) => setNewAvailability(value as Variant_dropOff_pickup_delivery)}>
                    <SelectTrigger id="new-availability">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="dropOff">Drop-off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="new-in-stock"
                    checked={newIsInStock}
                    onCheckedChange={setNewIsInStock}
                  />
                  <Label htmlFor="new-in-stock" className="cursor-pointer">
                    In Stock
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={createProductMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createProductMutation.isPending}>
                  {createProductMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Product'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Card className="border-border/40">
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No products yet. Create your first product to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={Number(product.id)} className="border-border/40">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="mt-2">{product.description}</CardDescription>
                    {product.shortDescription && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Short: {product.shortDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold text-arcane-gold">
                      {(Number(product.price) / 100).toFixed(2)} ICP
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        defaultValue={product.stock.toString()}
                        onBlur={(e) => handleUpdateStock(product.id, e.target.value)}
                        className="w-20"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      variant={product.isInStock ? 'secondary' : 'destructive'}
                      className={product.isInStock ? 'bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30' : ''}
                    >
                      {product.isInStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <Badge variant="outline">
                      {product.availability === 'delivery' ? 'Delivery' :
                       product.availability === 'pickup' ? 'Pickup' : 'Drop-off'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleEditProduct}>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update product information. All fields are required.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-short-description">Short Description</Label>
                <Textarea
                  id="edit-short-description"
                  value={editShortDescription}
                  onChange={(e) => setEditShortDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (ICP) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Product Image (optional - leave empty to keep current)</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, true)}
                />
                {editImageFile && (
                  <p className="text-sm text-muted-foreground">
                    New image: {editImageFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-availability">Availability *</Label>
                <Select value={editAvailability} onValueChange={(value) => setEditAvailability(value as Variant_dropOff_pickup_delivery)}>
                  <SelectTrigger id="edit-availability">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="pickup">Pickup</SelectItem>
                    <SelectItem value="dropOff">Drop-off</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="edit-in-stock"
                  checked={editIsInStock}
                  onCheckedChange={setEditIsInStock}
                />
                <Label htmlFor="edit-in-stock" className="cursor-pointer">
                  In Stock
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={editProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editProductMutation.isPending}>
                {editProductMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
