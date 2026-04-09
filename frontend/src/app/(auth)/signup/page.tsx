import { AuthLayout, SignupForm } from '@/features/auth'

export const metadata = {
  title: 'Sign Up | Ethereal Voyager',
  description: 'Create your Ethereal Voyager account.',
}

export default function SignupPage() {
  return (
    <AuthLayout
      title="Start your journey today 🌍"
      subtitle="Experience weightless travel curated for the modern adventurer."
      imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBHUXI74mkttYFeGqN1o73oXGAWPipu35FxBwUumSoydJVostn6lOyqLigK_SP7M52oNGExUOBkxGd8sk3BkxnoaUc2HpymQyjbHzHHQy8LbEvWfh_Kf-CBAG4jjbDNuVnJVtsmqtrD4IkgDmYeshvmqEZH6zyf6PnnN5Urg80oSSlcFk3NPLhGAf3KuZhnfevkJx5GLJ9pKzp27-Z-bpED7E8-wwqa5xmTObKs6uUVPC11aX06MIrjp_EbS94_4xwdvYICca21PA3c"
      imageAlt="Ethereal Voyager Experience"
    >
      <SignupForm />
    </AuthLayout>
  )
}
