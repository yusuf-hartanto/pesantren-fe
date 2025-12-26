import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import { can, normalizeResource } from '@/libs/permission'
import type { PermissionMap } from '@/types/permission'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // dashboard
  if (!pathname.startsWith('/app')) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return NextResponse.redirect(
      new URL('/login', req.url)
    )
  }

  const permissions = token.permissions as PermissionMap | undefined
  const resource = normalizeResource(pathname)

  const allowed = can(permissions, resource, 'view')

  if (!allowed) {
    return NextResponse.redirect(
      new URL('/not-authorized', req.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*'],
}
