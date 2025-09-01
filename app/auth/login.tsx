import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Giriş Yap</h1>
      <SignIn path="/auth/login" routing="path" signUpUrl="/auth/register" />
    </div>
  );
}
