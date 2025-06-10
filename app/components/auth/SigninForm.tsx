'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchLocationByDomain } from '@/actions/getLocationByDomain';
import { extractDomain } from '@/utils/extractDomain';

export default function SigninForm() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'redirecting' | 'awaiting-code'>('idle');
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

        const result = await fetchLocationByDomain(domain);
        console.log(`this is the domain: ${domain}; this is the result: ${JSON.stringify(result)}`);

        if (!result.location) {
            setInstitutionRequested(true);
            setStatus('idle');
            setMessage('We’ve noted your institution’s domain and will review it for inclusion.');

            // Optional: send to logging API for your backend
            await fetch('/api/log-unmatched-domain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, domain }),
            });

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
            {status === 'awaiting-code' ? (
                <form onSubmit={handleCodeSubmit}>
                    <h1 className="text-lg text-center">A login code was sent to</h1>
                    <p className="text-sm text-center font-semibold mt-2 mb-6">{email}</p>
                    <p className="text-lg text-center mt-2 mb-6">Please, check your inbox</p>
                    <div className="flex flex-row justify-center space-x-2">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            required
                            className="h-8 bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                        />
                        <button
                            type="submit"
                            className="w-14 h-8 bg-[#87bdd8] hover:bg-blue-700 text-slate-100 mx-1 rounded-xl flex items-center justify-center"
                        >
                            Verify
                        </button>
                    </div>
                    {codeError && <p className="text-red-500 mt-4 text-center">{codeError}</p>}
                    {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
                </form >
            ) : (
                <form onSubmit={handleEmailSubmit} className="flex flex-col items-center space-y-4">
                    <h1 className="text-lg text-center mb-2">Sign in</h1>
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-80 h-8 bg-slate-50 p-1 rounded border border-slate-300 placeholder:text-slate-300"
                        required
                    />
                    <button
                        type="submit"
                        className="w-30 h-8 bg-[#87bdd8] hover:bg-blue-700 text-white px-4 rounded-xl"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Sending…' : 'Send Login Code'}
                    </button>
                    {message && (
                        <p className={`mt-4 text-center ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}
                </form>
            )}

        </>
    );
}
