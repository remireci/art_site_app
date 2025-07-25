type LoginMailFormProps = {
    email: string;
    message: string;
    status: 'idle' | 'institution-not-found' | 'institution-not-confirmed' | 'user-not-found' | 'loading' | 'success' | 'error' | 'redirecting' | 'awaiting-code';
    setEmail: (email: string) => void;
    handleEmailSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const LoginMailForm = ({
    email,
    message,
    status,
    setEmail,
    handleEmailSubmit
}: LoginMailFormProps) => {

    return (
        <form onSubmit={handleEmailSubmit} className="flex flex-col items-center space-y-4">
            <h1 className="text-lg text-center mb-2">Sign in or create an account</h1>
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
                {status === 'loading' ? 'Sending…' : 'Continue'}
            </button>
            {message && (
                <p
                    className={`mt-4 text-center ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}
                    style={{ whiteSpace: 'pre-line' }}
                >
                    {message}
                    {status === 'institution-not-confirmed' && (
                        <>
                            {' '}
                            <a
                                href="mailto:info@artnowdatabase.eu?subject=Request%20for%20Institution%20Confirmation"
                                className="underline text-blue-600 hover:text-blue-800"
                            >
                                Email us
                            </a>{' '}
                            to request confirmation.
                        </>
                    )}
                </p>
            )}

        </form>
    )
}