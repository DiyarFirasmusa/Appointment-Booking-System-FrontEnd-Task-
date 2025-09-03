import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Check if the prompt was already dismissed
    const wasPromptDismissed = localStorage.getItem('pwa-install-dismissed')
    if (wasPromptDismissed) {
      const dismissTime = parseInt(wasPromptDismissed)
      const daysSinceDismissed = (Date.now() - dismissTime) / (1000 * 60 * 60 * 24)

      // Show prompt again after 7 days
      if (daysSinceDismissed < 7) {
        setShowInstallPrompt(false)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Store dismissal time to avoid showing prompt too frequently
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if already installed
  if (isInstalled) {
    return null
  }

  // Show prompt if we have a deferred prompt or if we're in production and haven't been dismissed recently
  const shouldShowPrompt = showInstallPrompt && deferredPrompt

  if (!shouldShowPrompt) {
    return null
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 max-w-sm'>
      <Card className='shadow-lg border-primary/20'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Download className='h-5 w-5 text-primary' />
              <CardTitle className='text-lg'>Install App</CardTitle>
            </div>
            <Button variant='ghost' size='icon' onClick={handleDismiss} className='h-6 w-6'>
              <X className='h-4 w-4' />
            </Button>
          </div>
          <CardDescription>
            Install our booking app for quick access from your desktop
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='flex gap-2'>
            <Button onClick={handleInstallClick} className='flex-1'>
              <Download className='h-4 w-4 mr-2' />
              Install
            </Button>
            <Button variant='outline' onClick={handleDismiss}>
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PWAInstallPrompt
