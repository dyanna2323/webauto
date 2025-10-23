import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Loader2, Plus, Download, Trash2, Edit, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { GenerationRequest } from '@shared/schema';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MyWebsitesResponse {
  websites: GenerationRequest[];
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch user's websites
  const { data, isLoading, error } = useQuery<MyWebsitesResponse>({
    queryKey: ['/api/my-websites'],
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/logout', {});
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/login');
      toast({
        title: '¡Hasta luego tío!',
        description: 'Sesión cerrada exitosamente',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/generation/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-websites'] });
      toast({
        title: '¡Web eliminada!',
        description: 'Tu web ha sido eliminada correctamente',
      });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al eliminar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const handleDownload = (id: string) => {
    window.open(`/api/download/${id}`, '_blank');
    toast({
      title: '¡Descargando!',
      description: 'Tu web se está descargando como ZIP',
    });
  };

  const handleEdit = (website: GenerationRequest) => {
    // Store the website data in localStorage to open in Builder
    localStorage.setItem('editingWebsite', JSON.stringify(website));
    navigate('/builder');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Necesitas iniciar sesión para ver tu dashboard
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild data-testid="button-go-login">
              <Link href="/login">Ir al Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold">Mis Webs</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="default"
              size="sm"
              data-testid="button-create-new"
            >
              <Link href="/builder">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nueva Web</span>
                <span className="sm:hidden">Nueva</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" data-testid="loader-websites" />
          </div>
        ) : data?.websites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] gap-6"
          >
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold">¡Bienvenido tío! 🎉</h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Aún no has creado ninguna web. ¿A qué esperas? ¡Vamos a crear tu primera web profesional!
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="text-lg"
              data-testid="button-create-first"
            >
              <Link href="/builder">
                <Plus className="h-5 w-5 mr-2" />
                Crear mi primera web
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Tus Webs ({data?.websites.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.websites.map((website, index) => (
                <motion.div
                  key={website.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`card-website-${website.id}`}
                >
                  <Card className="overflow-hidden hover-elevate h-full flex flex-col">
                    <CardHeader className="space-y-2">
                      <CardTitle className="line-clamp-2">
                        {website.businessDescription.substring(0, 50)}
                        {website.businessDescription.length > 50 && '...'}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize bg-secondary px-2 py-1 rounded text-xs">
                          {website.templateType}
                        </span>
                        <span>•</span>
                        <span>
                          {website.createdAt ? format(new Date(website.createdAt), "d 'de' MMM, yyyy", { locale: es }) : 'Sin fecha'}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1">
                      {/* Preview iframe - small */}
                      {website.generatedHtml && (
                        <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden border">
                          <iframe
                            srcDoc={`
                              <!DOCTYPE html>
                              <html>
                                <head>
                                  <style>${website.generatedCss || ''}</style>
                                  <style>
                                    body { transform: scale(0.25); transform-origin: top left; width: 400%; height: 400%; overflow: hidden; }
                                  </style>
                                </head>
                                <body>${website.generatedHtml}</body>
                              </html>
                            `}
                            className="w-full h-full pointer-events-none"
                            title="Website preview"
                            sandbox="allow-same-origin"
                          />
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex gap-2 border-t pt-4">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(website)}
                        data-testid={`button-edit-${website.id}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(website.id)}
                        data-testid={`button-download-${website.id}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(website.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${website.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta web?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La web será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
