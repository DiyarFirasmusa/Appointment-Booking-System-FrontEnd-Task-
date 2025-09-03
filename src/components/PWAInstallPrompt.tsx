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
      // If never dismissed, wait for beforeinstallprompt event first
      // Don't show immediately to give chance for native prompt
      console.log('Waiting for beforeinstallprompt event...')
    }

    // Only show fallback if no beforeinstallprompt event after 5 seconds
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        console.log('Fallback: showing install prompt after timeout')
        setCanInstall(true)
        setShowInstallPrompt(true)
      }
    }, 5000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(fallbackTimer)
    }
  }, [deferredPrompt, isInstalled])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
          console.log('User accepted the install prompt')
        } else {
          console.log('User dismissed the install prompt')
        }
      } catch (error) {
        console.log('Error during install prompt:', error)
      }

      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } else {
      // If no deferred prompt, try to trigger installation through other means
      console.log('No deferred prompt available, trying alternative installation methods')

      // For iOS Safari, try to show the share sheet
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Install Appointment Booking App',
            text: 'Install this app for quick access',
            url: window.location.href,
          })
        } catch (error) {
          console.log('Share failed:', error)
        }
      }

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
