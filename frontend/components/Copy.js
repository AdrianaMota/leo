import React from 'react'
import { useClipboard, IconButton } from '@chakra-ui/react'
import { CopyIcon, CheckIcon } from '@chakra-ui/icons'

const Copy = ({ code, size, color }) => {
  const { hasCopied, onCopy } = useClipboard(code)

  return (
    <IconButton
      position="initial"
      onClick={onCopy}
      icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
      color={color}
      variant="link"
      alt="copy"
      fontSize={size}
      aria-label="copy"
    />
  )
}

export default Copy
