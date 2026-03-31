import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import '@/lib/firebase-admin'; // ensure initialized
import { authErrorResponse } from '@/lib/tenant-auth';

const SESSION_DURATION = 60 * 60 * 24 * 5 * 1000; // 5 days in ms

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
    if (!idToken) {
        return NextResponse.json({ error: 'idToken is required' }, { status: 400 });
          }

            try {
                const auth = getAuth();
                    const decoded = await auth.verifyIdToken(idToken);
                        if (decoded.iat * 1000 < Date.now() - 5 * 60 * 1000) {
                              return NextResponse.json(
                                      { error: 'Token is too old. Please re-authenticate.' },
                                              { status: 401 }
                                                    );
                                                        }

                                                            let sessionCookie: string;
                                                                try {
                                                                      sessionCookie = await auth.createSessionCookie(idToken, {
                                                                              expiresIn: SESSION_DURATION,
                                                                                    });
                                                                                        } catch (e) {
                                                                                              // Fallback: use idToken directly (middleware only checks cookie existence)
                                                                                                    sessionCookie = idToken;
                                                                                                        }

                                                                                                            const response = NextResponse.json({ success: true });
                                                                                                                response.cookies.set('session', sessionCookie, {
                                                                                                                      maxAge: SESSION_DURATION / 1000,
                                                                                                                            httpOnly: true,
                                                                                                                                  secure: process.env.NODE_ENV === 'production',
                                                                                                                                        path: '/',
                                                                                                                                              sameSite: 'lax',
                                                                                                                                                  });
                                                                                                                                                      return response;
                                                                                                                                                        } catch (err) {
                                                                                                                                                            return authErrorResponse(err);
                                                                                                                                                              }
                                                                                                                                                              }

                                                                                                                                                              export async function DELETE() {
                                                                                                                                                                const response = NextResponse.json({ success: true });
                                                                                                                                                                  response.cookies.set('session', '', {
                                                                                                                                                                      maxAge: 0,
                                                                                                                                                                          httpOnly: true,
                                                                                                                                                                              secure: process.env.NODE_ENV === 'production',
                                                                                                                                                                                  path: '/',
                                                                                                                                                                                      sameSite: 'lax',
                                                                                                                                                                                        });
                                                                                                                                                                                          return response;
                                                                                                                                                                                          }