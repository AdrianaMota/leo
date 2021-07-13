import React from 'react'
import { useClipboard, IconButton } from '@chakra-ui/react'
import { CopyIcon, CheckIcon } from '@chakra-ui/icons'

const Copy = ({ code }) => {
  const [value, setValue] = React.useState(code)
  const { hasCopied, onCopy } = useClipboard(value)

  return (
    <IconButton
      position="initial"
      onClick={onCopy}
      icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
      color="primaryYellow.500"
      variant="link"
      alt="copy"
      fontSize="l"
      aria-label="copy"
    />
  )
}

export default Copy
