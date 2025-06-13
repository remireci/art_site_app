'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchLocationByDomain } from '@/actions/getLocationByDomain';
import { fetchUserByEmail } from '@/actions/findUser';
import { extractDomain } from '@/utils/extractDomain';
import { LoginCodeForm } from './LoginCodeForm';
import { LoginMailForm } from './LoginMailForm';

export default function SigninForm() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'not-in-database' | 'loading' | 'success' | 'error' | 'redirecting' | 'awaiting-code'>('idle');
    const [message, setMessage] = useState('');
    const [institutionRequested, setInstitutionRequested] = useState(false);
    const [codeError, setCodeError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (status === 'redirecting') {
            const timer = setTimeout(() => {
                router.push('/signup');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'not-in-database') {
            const timer = setTimeout(() => {
                router.push('/');
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [status, router]);

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
            setInstitutionRequested(true);
            setStatus('not-in-database');
            setMessage('We’ve noted your institution’s domain and will review it for inclusion.');

            const res = await fetch(`/api/auth/test-email?email=${encodeURIComponent(email)}`);

            if (!res.ok) {
                console.error('Failed to notify Art Now Database');
                setMessage('We could not notify Art Now Database at this time. Please try again later.');
            }

            return;
        }

        const userResult = await fetchUserByEmail(email);

        if (!userResult.success) {
            setInstitutionRequested(true);
            setStatus('not-in-database');
            setMessage('We’ve noted your institution’s domain and will review it for inclusion.');

            const res = await fetch(`/api/auth/test-email?email=${encodeURIComponent(email)}`);

            if (!res.ok) {
                console.error('Failed to notify Art Now Database');
                setMessage('We could not notify Art Now Database at this time. Please try again later.');
            }

            return;
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
            {status === 'not-in-database' && (
                <div className="text-center text-sm text-gray-700">
                    We couldn’t find your institution in our database. We’ve sent a request to Art Now Database to review it.
                    If approved, you’ll receive an email letting you know that you can complete your sign-up.
                    <br />
                    <span className="mt-2 block text-gray-500">You’ll be redirected to the home page shortly.</span>
                </div>
            )}

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

            {(status !== 'awaiting-code' && status !== 'not-in-database') &&
                <LoginMailForm
                    email={email}
                    message={message}
                    status={status}
                    setEmail={setEmail}
                    handleEmailSubmit={handleEmailSubmit}
                />
            }
        </>
    );
}
