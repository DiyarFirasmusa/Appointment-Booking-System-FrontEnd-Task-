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
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt event fired')
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
      setShowInstallPrompt(true)
    }

    const handleAppInstalled = () => {
      console.log('App installed')
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      setCanInstall(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    window.addEventListener('appinstalled', handleAppInstalled)

    const wasPromptDismissed = localStorage.getItem('pwa-install-dismissed')
    if (wasPromptDismissed) {
      const dismissTime = parseInt(wasPromptDismissed)
      const daysSinceDismissed = (Date.now() - dismissTime) / (1000 * 60 * 60 * 24)

      if (daysSinceDismissed < 7) {
        setShowInstallPrompt(false)
      } else {
        setCanInstall(true)
        setShowInstallPrompt(true)
      }
    } else {
      setCanInstall(true)
      setShowInstallPrompt(true)
    }

    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        console.log('Fallback: showing install prompt')
        setCanInstall(true)
        setShowInstallPrompt(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(fallbackTimer)
    }
  }, [deferredPrompt, isInstalled])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }

      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } else {
      console.log('No deferred prompt available, showing manual install instructions')
      alert(
        'To install this app:\n\n1. Look for the "Install" or "Add to Home Screen" option in your browser menu\n2. Or use the browser\'s "Add to Home Screen" feature\n3. Or drag this tab to your desktop (on some browsers)'
      )
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  if (isInstalled) {
    return null
  }

  const shouldShowPrompt = showInstallPrompt && canInstall

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
