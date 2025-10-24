import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { RippleButton } from '@/components/RippleButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/login', {
        email,
        password,
      });
      return response.json();
    },
    onSuccess: async (data) => {
      // Invalidate user query
      await queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      
      toast({
        title: '¡Bienvenido de vuelta!',
        description: 'Has iniciado sesión exitosamente.',
      });
      
      // Redirect to builder
      setLocation('/builder');
    },
    onError: (error: any) => {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message || 'Email o contraseña incorrectos',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/">
          <Button variant="ghost" className="mb-4 text-white backdrop-blur-sm" data-testid="button-back-home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>

        <Card className="bg-white/90 backdrop-blur-md border-white/50 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-gray-700">
              Accede a tu cuenta para gestionar tus webs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-2 border-purple-200 bg-white/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all"
                  data-testid="input-email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold">Contraseña</Label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-2 border-purple-200 bg-white/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all"
                  data-testid="input-password"
                  required
                />
              </div>

              <RippleButton
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </RippleButton>

              <div className="text-center text-sm text-gray-700">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-purple-600 hover:text-pink-600 font-semibold hover:underline">
                  Regístrate gratis
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}