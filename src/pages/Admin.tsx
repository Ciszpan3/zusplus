import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Admin = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Admin Panel</CardTitle>
            <CardDescription>You are logged in as: {user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is your protected admin dashboard. More features coming soon!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
