'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import classnames from 'classnames'

import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  const [origin, setOrigin] = useState<string>('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  return (
    <div
      className={classnames(
        verticalLayoutClasses.footerContent,
        'flex items-center justify-between flex-wrap gap-4'
      )}
    >
      <p>
        <span className='text-textSecondary'>
          © {new Date().getFullYear()} -{' '}
        </span>

        {origin && (
          <Link
            href={origin}
            target='_blank'
            className='text-primary uppercase'
          >
            SADA
          </Link>
        )}
      </p>
    </div>
  )
}

export default FooterContent
