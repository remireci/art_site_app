'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { extractDomain } from '@/utils/extractDomain';

type InstitutionField = 'location' | 'address' | 'city' | 'mail' | 'url' | 'domain';

export default function SignupForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'not-in-database' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [showInstitutionForm, setShowInstitutionForm] = useState(false);

    const [institution, setInstitution] = useState({
        location: '',
        address: '',
        city: '',
        mail: '',
        url: '',
        domain: '',
    });

    useEffect(() => {
        if (searchParams?.get('showInstitutionForm') === '1') {
            setShowInstitutionForm(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (status === 'not-in-database') {
            const timer = setTimeout(() => {
                router.push('/');
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [status, router]);

    const institutionFields: { name: InstitutionField; placeholder: string }[] = [
        { name: 'location', placeholder: 'Name of your institution' },
        { name: 'address', placeholder: 'Address of your institution' },
        { name: 'city', placeholder: 'City' },
        { name: 'mail', placeholder: 'Email – your.name@yourdomain.com' },
        { name: 'url', placeholder: 'Website – https://www.yourdomain.com' },
        { name: 'domain', placeholder: 'Domain – yourdomain.com' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

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

            setStatus('success');
            setMessage('Invite email sent! Please check your inbox. You can now close this tab.');
        } catch {
            setStatus('error');
            setMessage('Unexpected error occurred.');
        }
    };

    const emailDomain = extractDomain(institution.mail);
    const urlDomain = extractDomain(institution.url);
    const domainsMatch = emailDomain && urlDomain && emailDomain === urlDomain;

    const handleInstitutionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/auth/create-location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...institution, domain: urlDomain }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus('error');
                setMessage(data.error || 'Failed to create location.');
                return;
            }

            setStatus('success');
            setMessage('Your request has been sent for review. You’ll receive an email shortly. You can now close this tab.');
            setShowInstitutionForm(false);
        } catch {
            setStatus('error');
            setMessage('Submission failed. Try again later.');
        }
    };



    return (
        <main className="w-96 mx-auto text-slate-600 my-40 p-4 border rounded shadow">
            <h1 className="text-lg text-center mb-4">Request an Invite</h1>

            {!showInstitutionForm && (
                <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="h-8 bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                        required
                    />
                    <button
                        type="submit"
                        className="w-30 h-8 bg-[#87bdd8] hover:bg-blue-700 text-white px-4 rounded-xl"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Sending...' : 'Request Invite'}
                    </button>
                </form>
            )}

            {showInstitutionForm && (
                <form onSubmit={handleInstitutionSubmit} className="mt-4 flex flex-col space-y-3">
                    <h2 className="text-sm text-center text-orange-500">
                        Institution not found. You can request to add it:
                    </h2>
                    {institutionFields.map(({ name, placeholder }) => (
                        <input
                            key={name}
                            type="text"
                            placeholder={placeholder}
                            value={institution[name]}
                            onChange={e => setInstitution(prev => ({ ...prev, [name]: e.target.value }))}
                            required
                            className="h-8 bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                        />
                    ))}

                    {emailDomain && urlDomain && !domainsMatch && (
                        <p className="text-sm text-red-500">
                            The domain of your email address and website do not match. Please ensure you&apos;re using your institutional email and correct website.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="shrink-0 mx-20 text-sm h-6 bg-[#87bdd8] hover:bg-blue-700 text-slate-100 px-4 rounded flex items-center justify-center text-md uppercase"
                    >
                        Submit Institution
                    </button>
                </form>
            )}

            {message && (
                <p className={`mt-4 ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {message.split("info@artnowdatabase.eu").map((part, index, arr) =>
                        index < arr.length - 1 ? (
                            <span key={index}>
                                {part}
                                <a href="mailto:info@artnowdatabase.eu" className="underline">info@artnowdatabase.eu</a>
                            </span>
                        ) : (
                            <span key={index}>{part}</span>
                        )
                    )}
                </p>
            )}
        </main>
    );
}
