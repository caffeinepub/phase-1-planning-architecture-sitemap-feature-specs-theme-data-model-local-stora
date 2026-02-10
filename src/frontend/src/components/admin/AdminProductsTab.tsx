import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Plus, Edit, Loader2, CheckCircle2 } from 'lucide-react';
import { useGetAllProducts } from '../../hooks/useQueries';
import { useQueuedCreateProduct, useQueuedEditProduct, useQueuedUpdateProductStock } from '../../hooks/useQueuedMutations';
import { toast } from 'sonner';
import type { Product } from '../../backend';

export default function AdminProductsTab() {
  const { data: products = [], isLoading } = useGetAllProducts();
  const createProduct = useQueuedCreateProduct();
  const editProduct = useQueuedEditProduct();
  const updateStock = useQueuedUpdateProductStock();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
  });

  // Stock update state
  const [stockUpdates, setStockUpdates] = useState<Record<string, string>>({});

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createForm.name || !createForm.description || !createForm.price || !createForm.stock) {
      toast.error('All fields are required');
      return;
    }

    const price = parseInt(createForm.price);
    const stock = parseInt(createForm.stock);

    if (isNaN(price) || price < 0) {
      toast.error('Price must be a valid positive number');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      toast.error('Stock must be a valid positive number');
      return;
    }

    try {
      await createProduct.mutateAsync({
        name: createForm.name,
        description: createForm.description,
        price: BigInt(price),
        stock: BigInt(stock),
      });

      toast.success('Product created successfully');
      setCreateForm({ name: '', description: '', price: '', stock: '' });
      setCreateDialogOpen(false);
    } catch (error: any) {
      if (error.message === 'Queued for offline sync') {
        toast.info('Product creation queued', {
          description: 'The product will be created when you\'re back online.',
        });
        setCreateForm({ name: '', description: '', price: '', stock: '' });
        setCreateDialogOpen(false);
      } else {
        toast.error('Failed to create product', {
          description: error.message || 'Please try again.',
        });
      }
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !editForm.name || !editForm.description || !editForm.price) {
      toast.error('All fields are required');
      return;
    }

    const price = parseInt(editForm.price);

    if (isNaN(price) || price < 0) {
      toast.error('Price must be a valid positive number');
      return;
    }

    try {
      await editProduct.mutateAsync({
        productId: selectedProduct.id,
        name: editForm.name,
        description: editForm.description,
        price: BigInt(price),
      });

      toast.success('Product updated successfully');
      setEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      if (error.message === 'Queued for offline sync') {
        toast.info('Product update queued', {
          description: 'The product will be updated when you\'re back online.',
        });
        setEditDialogOpen(false);
        setSelectedProduct(null);
      } else {
        toast.error('Failed to update product', {
          description: error.message || 'Please try again.',
        });
      }
    }
  };

  const handleUpdateStock = async (productId: bigint) => {
    const newStockStr = stockUpdates[productId.toString()];
    if (!newStockStr) return;

    const newStock = parseInt(newStockStr);
    if (isNaN(newStock) || newStock < 0) {
      toast.error('Stock must be a valid positive number');
      return;
    }

    try {
      await updateStock.mutateAsync({
        productId,
        newStock: BigInt(newStock),
      });

      toast.success('Stock updated successfully');
      setStockUpdates(prev => {
        const next = { ...prev };
        delete next[productId.toString()];
        return next;
      });
    } catch (error: any) {
      if (error.message === 'Queued for offline sync') {
        toast.info('Stock update queued', {
          description: 'The stock will be updated when you\'re back online.',
        });
        setStockUpdates(prev => {
          const next = { ...prev };
          delete next[productId.toString()];
          return next;
        });
      } else {
        toast.error('Failed to update stock', {
          description: error.message || 'Please try again.',
        });
      }
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
    });
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Loading products...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Product Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Product
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Add a new mystical artifact to the shop
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <Label htmlFor="create-name">Product Name</Label>
              <Input
                id="create-name"
                value={createForm.name}
                onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ancient Scroll"
                required
              />
            </div>
            <div>
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                value={createForm.description}
                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="A mystical artifact with ancient powers..."
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-price">Price (ICP)</Label>
                <Input
                  id="create-price"
                  type="number"
                  min="0"
                  value={createForm.price}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="100"
                  required
                />
              </div>
              <div>
                <Label htmlFor="create-stock">Initial Stock</Label>
                <Input
                  id="create-stock"
                  type="number"
                  min="0"
                  value={createForm.stock}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, stock: e.target.value }))}
                  placeholder="10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={createProduct.isPending}>
              {createProduct.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProduct} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price (ICP)</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                value={editForm.price}
                onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={editProduct.isPending}>
              {editProduct.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Products List */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-arcane-gold" />
            Products Management
          </CardTitle>
          <CardDescription>
            {products.length} {products.length === 1 ? 'product' : 'products'} in the shop
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <Alert>
              <AlertDescription>
                No products yet. Create your first product to get started!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id.toString()}
                  className="p-4 rounded-lg border border-border/40 bg-card/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{product.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-bold text-arcane-gold">{Number(product.price)} ICP</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Stock</p>
                        <Badge
                          variant={Number(product.stock) > 0 ? 'secondary' : 'destructive'}
                          className={Number(product.stock) > 0 ? 'bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30' : ''}
                        >
                          {product.stock.toString()}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder="New stock"
                        className="w-24"
                        value={stockUpdates[product.id.toString()] || ''}
                        onChange={(e) => setStockUpdates(prev => ({
                          ...prev,
                          [product.id.toString()]: e.target.value,
                        }))}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStock(product.id)}
                        disabled={!stockUpdates[product.id.toString()] || updateStock.isPending}
                      >
                        {updateStock.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Update'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
