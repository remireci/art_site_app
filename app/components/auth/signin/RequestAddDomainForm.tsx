'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { extractDomain } from '@/utils/extractDomain';

type RequestAddDomainFormProps = {
    email: string;
    // message: string;
    // status: 'show-now' | 'idle' | 'not-in-database' | 'loading' | 'success' | 'error' | 'redirecting' | 'awaiting-code';
    // setEmail: (email: string) => void;
    // handleEmailSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

type InstitutionField = 'location' | 'address' | 'city' | 'mail' | 'url' | 'domain';

export const RequestAddDomainForm = ({ email }: RequestAddDomainFormProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
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

    const institutionFields: { name: InstitutionField; placeholder: string }[] = [
        { name: 'location', placeholder: 'Name of your institution' },
        { name: 'address', placeholder: 'Address of your institution' },
        { name: 'city', placeholder: 'City' },
        { name: 'mail', placeholder: 'Email – your.name@yourdomain.com' },
        { name: 'url', placeholder: 'Website – https://www.yourdomain.com' },
    ];

    useEffect(() => {
        setInstitution(prev => ({ ...prev, mail: email }));
    }, [email]);

    useEffect(() => {
        if (status === 'success') {
            const timeout = setTimeout(() => router.push('/'), 8000);
            return () => clearTimeout(timeout);
        }
    }, [status, router]);



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
            setMessage(
                'Your request has been successfully submitted. You’ll receive an email once it has been reviewed. Redirecting you to the homepage...'
            );
            setShowInstitutionForm(false);
        } catch {
            setStatus('error');
            setMessage('Submission failed. Try again later.');
        }
    };


    return (

        <>
            {status !== 'success' ? (
                <form onSubmit={handleInstitutionSubmit} className="mt-4 flex flex-col space-y-3">


                    <div className="text-center text-sm text-gray-700">

                        <h2 className="text-md text-center text-orange-500 mb-2">

                            Your institution is not in our database.
                        </h2>
                        <p className="text-sm text-center text-gray-700">
                            Please fill out the form below to request its addition.
                            <br />
                            We’ll review your request and send you an email once it’s approved so you can complete your sign-up.
                        </p>

                    </div>


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
            ) : (
                <p className="mt-4 text-green-600 text-center">
                    {message}
                </p>
            )}

            {/* {message && (
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
            )} */}
        </>
    );
}
