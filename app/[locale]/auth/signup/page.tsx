'use client';

import { useState } from 'react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/auth/request-invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus('error');
                setMessage(data.error || 'Something went wrong.');
                return;
            }

            setStatus('success');
            setMessage('Invite email sent! Please check your inbox.');
        } catch (error) {
            setStatus('error');
            setMessage('Unexpected error occurred.');
        }
    };

    return (
        <main className="w-96 mx-auto text-slate-600 my-40 p-4 border rounded shadow">
            <h1 className="text-lg text-center mb-4">Request an Invite</h1>

            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-80 h-8 bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                    required
                />

                <button
                    type="submit"
                    className="w-30 h-8 bg-[#87bdd8] hover:bg-blue-700 text-slate-100 mx-1 px-4 rounded-xl flex items-center justify-center"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Sending...' : 'Request Invite'}
                </button>
            </form>

            {message && (
                <p className={`mt-4 ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {message.split("info@artnowdatabase.eu").map((part, index, arr) =>
                        index < arr.length - 1 ? (
                            <>
                                {part}
                                <a href="mailto:info@artnowdatabase.eu" className='underline'>info@artnowdatabase.eu</a>
                            </>
                        ) : (
                            part
                        )
                    )}
                </p>
            )}
        </main>
    );
}
