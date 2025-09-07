'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { appConfig } from '@/lib/config'
import { handleSignup } from '@/lib/auth-actions'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, action] = useActionState(handleSignup, undefined)
  const router = useRouter()
  const [handledToast, setHandledToast] = useState(false)

  // Trigger toast once when state changes
  useEffect(() => {
    if (!state || handledToast) return

    if (state.ok) {
      toast.success('Account created successfully!')
      setHandledToast(true)
    } else if (state.errors) {
      state.errors.forEach((error) => toast.error(error))
      setHandledToast(true)
    }
  }, [state, handledToast])

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form action={action} className='p-6 md:p-8'>
            <FormContent state={state} />
          </form>

          <div className='bg-muted relative hidden md:block'>
            <img
              src='/office.png'
              alt='Image'
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>

      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  )
}

function FormContent({ state }: { state: { ok?: boolean; error?: string } | undefined }) {
  const { pending } = useFormStatus()

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col items-center text-center'>
        <h1 className='text-2xl font-bold'>Create an account</h1>
        <p className='text-muted-foreground text-balance'>
          Sign up for {appConfig.name} to get started
        </p>
      </div>

      <div className='grid gap-3'>
        <Label htmlFor='name'>Full Name</Label>
        <Input
          id='name'
          name='name'
          placeholder='John Doe'
          required
          disabled={pending}
        />
      </div>

      <div className='grid gap-3'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='m@example.com'
          required
          disabled={pending}
        />
      </div>

      <div className='grid gap-3'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          name='password'
          type='password'
          required
          disabled={pending}
        />
      </div>

      <p
        className='text-sm text-red-600 mt-2 min-h-[1.25rem]'
        role='alert'
        aria-live='polite'
      >
        {state?.error ?? "\u00A0"}
      </p>

      <Button
        type='submit'
        className='w-full flex justify-center items-center gap-2'
        disabled={pending}
      >
        {pending ? (
          <>
            <ClipLoader color='#ffffff' size={20} />
            Signing up...
          </>
        ) : (
          'Sign Up'
        )}
      </Button>
    </div>
  )
}
