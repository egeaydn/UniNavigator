import { SignUp } from '@clerk/nextjs';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Kayıt Ol</h1>
      <SignUp path="/auth/register" routing="path" signInUrl="/auth/login" />
    </div>
  );
}
