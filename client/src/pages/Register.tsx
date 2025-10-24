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

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/register', {
        email,
        password,
        name: name || undefined,
      });
      return response.json();
    },
    onSuccess: async (data) => {
      // Invalidate user query
      await queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      
      toast({
        title: '¡Cuenta creada!',
        description: 'Tu cuenta ha sido creada exitosamente.',
      });
      
      // Redirect to builder
      setLocation('/builder');
    },
    onError: (error: any) => {
      toast({
        title: 'Error al registrarse',
        description: error.message || 'No se pudo crear la cuenta',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: 'Contraseña muy corta',
        description: 'La contraseña debe tener al menos 6 caracteres',
        variant: 'destructive',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: 'Las contraseñas no coinciden',
        description: 'Por favor asegúrate de que las contraseñas sean iguales',
        variant: 'destructive',
      });
      return;
    }
    
    registerMutation.mutate();
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
              Crear Cuenta
            </CardTitle>
            <CardDescription className="text-gray-700">
              Regístrate gratis y empieza a crear webs profesionales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-semibold">Nombre (opcional)</Label>
                <input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-2 border-purple-200 bg-white/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all"
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">Email *</Label>
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
                <Label htmlFor="password" className="text-gray-700 font-semibold">Contraseña *</Label>
                <input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-2 border-purple-200 bg-white/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all"
                  data-testid="input-password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700 font-semibold">Confirmar Contraseña *</Label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-2 border-purple-200 bg-white/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all"
                  data-testid="input-confirm-password"
                  required
                />
              </div>

              <RippleButton
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg"
                disabled={registerMutation.isPending}
                data-testid="button-register"
              >
                {registerMutation.isPending ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}
              </RippleButton>

              <div className="text-center text-sm text-gray-700">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-purple-600 hover:text-pink-600 font-semibold hover:underline">
                  Inicia sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}