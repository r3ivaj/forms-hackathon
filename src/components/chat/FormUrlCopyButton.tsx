import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface FormUrlCopyButtonProps {
  formOptions: {
    _id: string
    short_id: string
  }
}

export function FormUrlCopyButton({ formOptions }: FormUrlCopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyFormUrl = async () => {
    const domain = window.location.origin
    const formUrl = `${domain}/formulario/${formOptions.short_id}`

    try {
      await navigator.clipboard.writeText(formUrl)
      setCopied(true)
    } catch (error) {
      console.error('Error copying URL:', error)
    }
  }

  const getFormUrl = () => {
    const domain = window.location.origin
    return `${domain}/formulario/${formOptions.short_id}`
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyFormUrl}
            className="h-6 w-6"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-mono text-xs">
            {copied ? 'Copiado' : getFormUrl()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
