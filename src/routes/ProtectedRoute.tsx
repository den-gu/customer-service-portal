import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import React from 'react';
import { useAuth } from 'react-oidc-context';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className='w-full h-screen grid place-items-center'>
      <HugeiconsIcon icon={Loading03Icon} size={26} strokeWidth={1.5} className="text-zinc-600 shrink-0 animate-spin" />
    </div>;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className='w-full h-screen grid place-items-center'>
        <div className='space-y-6 w-full'>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Authentication Required</EmptyTitle>
              <EmptyDescription className='text-base'>You need to be logged in to view this page.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
              <div className="flex items-center mt-6 gap-6 py-4 px-6 rounded-4xl bg-white border border-zinc-400/50 group-hover:border-primary/60">
                  <CardDescription className="text-sm">
                    Continue with
                  </CardDescription>
                  <CardTitle className="mt-0 text-lg font-bold">
                    OIDC Provider
                  </CardTitle>
              </div>
            </EmptyContent>
            <Button
              onClick={() => void auth.signinRedirect()}
              variant="link" className="text-muted-foreground cursor-pointer text-base underline">
              Login
            </Button>
          </Empty>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};