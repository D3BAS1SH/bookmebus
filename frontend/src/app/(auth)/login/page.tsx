import { AuthLayout, LoginForm } from '@/features/auth'

export const metadata = {
  title: 'Login | Ethereal Voyager',
  description: 'Login to your Ethereal Voyager account.',
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back, traveler ✈️"
      subtitle="Your next weightless journey is just a few clicks away."
      imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuA9zWiQKgmUtdl-mEvmeKUAjThulIK3IU3TQ1RnpuhhAcmJ0B3yaR_M3j3NHz2sat3NJHJrSULrXYGg_eoBHlw_FW_ibcplTfzu-uMOTKqN1SgCQwFoWF_cpK8blBiKSXLotesxCbUrMfFqWRbOtxXgexEvXRrg_PjgPh0EygLR1GG_QGRqDevmjn3oDP2P-CSwP4aMom6_gPsPVgKSH-AU_VyTG9ouKBYnw8M192Lzh5NHoTC-uo6-010d5LC0gzbg726v3K_2w1Tq"
      imageAlt="Majestic mountains at sunrise"
    >
      <LoginForm />
    </AuthLayout>
  )
}
