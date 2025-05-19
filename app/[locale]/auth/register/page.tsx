'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [locationId, setLocationId] = useState('');
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');
    const [tokenError, setTokenError] = useState('');

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {

        const token = searchParams.get('token');

        if (!token) {
            setCodeError('No invite token provided.');
            setLoading(false);
            return;
        }

        const tokenKey = `tokenChecked:${token}`;
        const tokenAlreadyChecked = sessionStorage.getItem(tokenKey);
        if (tokenAlreadyChecked) return;

        async function verifyTokenAndSendCode() {
            sessionStorage.setItem(tokenKey, 'true');

            try {
                const res = await fetch('/api/auth/verify-invite-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();
                // const data = { success: true, email: "dirk_mertens@fastmail.fm", locationId: "896AD7", error: "" }

                if (data.success) {

                    setEmail(data.email);
                    setLocationId(data.locationId);

                    await fetch('/api/auth/send-login-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: data.email }),
                    });
                    setMessage('A login code has been sent to your email address.');
                } else {
                    console.log("Yes, we are here!!")
                    setTokenError(data.error || 'Invalid or expired invite token.');
                }
            } catch {
                setTokenError('Something went wrong while verifying your token.');
            } finally {
                setLoading(false);
            }
        }

        verifyTokenAndSendCode();
    }, [searchParams]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setCodeError('');
        setMessage('');

        const res = await fetch('/api/auth/verify-login-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });

        const data = await res.json();
        if (data.success) {
            setMessage('Verification successful! Redirecting...');
            // You could redirect here:
            router.push('/dashboard');
        } else {
            setCodeError(data.error || 'Oops, that code isn’t right. Make sure you typed it correctly.');
        }
    }

    return (
        <main className="w-96 mx-auto text-slate-600 my-40 p-4 border rounded shadow">
            {loading ? (
                <p className="text-center">Checking invitation link…</p>
            ) : tokenError ? (
                <p className="text-red-500 text-center">{tokenError}</p>
            ) : (
                <form onSubmit={handleSubmit}>
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
                </form>
            )}
        </main>
    );
}
