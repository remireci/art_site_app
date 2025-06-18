'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchLocationByDomain } from '@/actions/getLocationByDomain';
import { fetchUserByEmail } from '@/actions/findUser';
import { extractDomain } from '@/utils/extractDomain';
import { LoginCodeForm } from './LoginCodeForm';
import { LoginMailForm } from './LoginMailForm';
import { RequestAddDomainForm } from './RequestAddDomainForm';

export default function SigninForm() {
    const searchParams = useSearchParams();
    const reset = searchParams?.get('reset');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'institution-not-found' | 'user-not-found' | 'loading' | 'success' | 'error' | 'redirecting' | 'awaiting-code'>('idle');
    const [message, setMessage] = useState('');
    const [institutionRequested, setInstitutionRequested] = useState(false);
    const [showInstitutionForm, setShowInstitutionForm] = useState(false);
    const [codeError, setCodeError] = useState('');
    const router = useRouter();

    // useEffect(() => {
    //     if (status === 'user-not-found') {
    //         const timeout = setTimeout(() => {
    //             router.push('/');
    //         }, 10000);

    //         return () => clearTimeout(timeout);
    //     }
    // }, [status]);

    useEffect(() => {
        if (reset) {
            setEmail('');
            setCode('');
            setStatus('idle');
            setMessage('');
            setInstitutionRequested(false);
            setShowInstitutionForm(false);
            setCodeError('');
        }
    }, [reset]);


    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');
        setCodeError('');

        const domain = extractDomain(email);
        if (!domain) {
            setStatus('error');
            setMessage('Invalid email address.');
            return;
        }

        const locationResult = await fetchLocationByDomain(domain);

        if (!locationResult.location) {
            setStatus('institution-not-found');
            // setMessage('We’ve noted your institution’s domain and will review it for inclusion.');

            // const res = await fetch(`/api/auth/test-email?email=${encodeURIComponent(email)}`);

            // if (!res.ok) {
            //     console.error('Failed to notify Art Now Database');
            //     setMessage('We could not notify Art Now Database at this time. Please try again later.');
            // }

            return;
        }

        const userResult = await fetchUserByEmail(email);

        if (!userResult.user) {

            try {
                const res = await fetch('/api/auth/request-invite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                const data = await res.json();

                if (!res.ok) {
                    if (data.error === 'Unrecognized institution') {
                        setStatus('idle');
                        setShowInstitutionForm(true);
                    } else {
                        setStatus('error');
                        setMessage(data.error || 'Something went wrong.');
                    }
                    return;
                }
                // Change if needed
                // setStatus('user-not-found');
                setStatus('awaiting-code');
                setMessage(
                    "Invite email sent! Please check your inbox (and spam folder) to create your account.\n\n" +
                    "Didn’t get the email? Try signing in again to receive a new one.\n\n" +
                    "You’ll be redirected to the homepage shortly."
                );
                return;


            } catch {
                setStatus('error');
                setMessage('Unexpected error occurred.');
            }
            // setInstitutionRequested(true);
            // setStatus('not-in-database');
            // setMessage('We’ve noted your institution’s domain and will review it for inclusion.');

            // const res = await fetch(`/api/auth/test-email?email=${encodeURIComponent(email)}`);

            // if (!res.ok) {
            //     console.error('Failed to notify Art Now Database');
            //     setMessage('We could not notify Art Now Database at this time. Please try again later.');
            // }

            // return;
        }



        try {
            const res = await fetch('/api/auth/send-login-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error === 'User not found') {
                    setStatus('redirecting');
                    setMessage('This email isn’t registered yet. Redirecting to sign-up…');
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Something went wrong.');
                }
                return;
            }

            setStatus('awaiting-code');
            setMessage('Login code sent! Please check your inbox.');
        } catch {
            setStatus('error');
            setMessage('Unexpected error occurred.');
        }
    };

    const handleCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setCodeError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/verify-login-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus('awaiting-code');
                setCodeError(data.error || 'Invalid or expired code.');
                return;
            }

            router.push('/dashboard');
        } catch {
            setStatus('awaiting-code');
            setCodeError('Unexpected error occurred during verification.');
        }
    };


    return (
        <>
            {status === 'awaiting-code' &&
                <LoginCodeForm
                    email={email}
                    code={code}
                    setCode={setCode}
                    codeError={codeError}
                    message={message}
                    handleCodeSubmit={handleCodeSubmit}
                />
            }

            {(status !== 'awaiting-code' && status !== 'institution-not-found' && status !== 'user-not-found') &&
                <LoginMailForm
                    email={email}
                    message={message}
                    status={status}
                    setEmail={setEmail}
                    handleEmailSubmit={handleEmailSubmit}
                />
            }

            {(status === "institution-not-found") &&
                <RequestAddDomainForm
                    email={email}
                />
            }
            {(status === 'user-not-found') && (
                <p className={`mt-4 text-center text-green-600`}>
                    {message.split('\n').map((line, i) => (
                        <span key={i}>
                            {line}
                            <br />
                        </span>
                    ))}
                </p>
            )}
        </>
    );
}
