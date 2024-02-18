import { useState, useCallback, useEffect, useRef } from 'react'
import { shade } from 'polished'
import Vibrant from 'node-vibrant'
import { hex } from 'wcag-contrast'
import copy from 'copy-to-clipboard'
import { convertHexToDecimal, isStarknetAddress } from '../utils'
import { useWhitelistedTokens } from '../contexts/Application'

export function useColor(tokenAddress, token) {
  const [color, setColor] = useState('#2172E5')
  const whitelistedTokens = useWhitelistedTokens()

  if (!(tokenAddress && isStarknetAddress(tokenAddress) && whitelistedTokens[tokenAddress])) {
    return color
  }
  const path = whitelistedTokens[tokenAddress].logoURI

  Vibrant.from(path).getPalette((err, palette) => {
    if (!(palette && palette.Vibrant)) {
      return
    }
    let detectedHex = palette.Vibrant.hex
    let AAscore = hex(detectedHex, '#FFF')
    while (AAscore < 3) {
      detectedHex = shade(0.005, detectedHex)
      AAscore = hex(detectedHex, '#FFF')
    }
    if (token === 'DAI') {
      setColor('#FAAB14')
    } else {
      setColor(detectedHex)
    }
  })

  return color
}

export function useCopyClipboard(timeout = 500) {
  const [isCopied, setIsCopied] = useState(false)

  const staticCopy = useCallback((text) => {
    const didCopy = copy(text)
    setIsCopied(didCopy)
  }, [])

  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false)
      }, timeout)

      return () => {
        clearTimeout(hide)
      }
    }
  }, [isCopied, setIsCopied, timeout])

  return [isCopied, staticCopy]
}

export const useOutsideClick = (ref, ref2, callback) => {
  const handleClick = (e) => {
    if (ref.current && ref.current && !ref2.current) {
      callback(true)
    } else if (ref.current && !ref.current.contains(e.target) && ref2.current && !ref2.current.contains(e.target)) {
      callback(true)
    } else {
      callback(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}

export default function useInterval(callback: () => void, delay: null | number) {
  const savedCallback = useRef<() => void>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      const current = savedCallback.current
      current && current()
    }

    if (delay !== null) {
      tick()
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
    return
  }, [delay])
}

export const useUserStraknetIdDomain = (account) => {
  const [domain, setDomain] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const convertedAddress = convertHexToDecimal(account)
      const response = await fetch(`https://app.starknet.id/api/indexer/addr_to_domain?addr=${convertedAddress}`)
      const processedResponse = await response.json()
      if (processedResponse.domain) {
        setDomain(processedResponse.domain)
      }
      setIsLoading(false)
    }
    if (account) {
      try {
        fetchData()
      } catch (e) {
        setIsLoading(false)
      }
    }
  }, [account])

  return [isLoading, domain]
}
