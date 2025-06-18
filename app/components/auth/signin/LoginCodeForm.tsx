type LoginCodeFormProps = {
    email: string;
    code: string;
    setCode: (code: string) => void;
    codeError: string;
    message: string;
    handleCodeSubmit: (e: React.FormEvent) => void;
};


export const LoginCodeForm = ({
    email,
    code,
    setCode,
    codeError,
    message,
    handleCodeSubmit,
}: LoginCodeFormProps) => {


    return (
        <>
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
        </>

    )
}

