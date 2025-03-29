import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const forwardedHost = req.headers.get('x-forwarded-host');
    const allowedHosts = ['localhost:3000', 'dhfn5q74-3000.inc1.devtunnels.ms'];

    if (forwardedHost && !allowedHosts.includes(forwardedHost)) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    return NextResponse.next();
}
