import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';

export default function ProtectedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignedIn>
        <h1 className="text-3xl font-bold mb-6">Korumalı Sayfa</h1>
        <p>Bu sayfayı sadece giriş yapan kullanıcılar görebilir.</p>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
