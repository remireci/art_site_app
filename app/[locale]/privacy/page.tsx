// components/Search.js

const Privacy = () => {
    return (
        <div className="main-container flex flex-wrap min-h-screen overflow-auto">
            {/* <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block h-14 lg:h-40"></div>
            <div className="flex flex-col justify-between w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 h-14 lg:h-40">

            </div>
            <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 h-14 lg:h-40">
                <div className='h-1/3 bg-slate-500'></div>
            </div> */}

            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block h-14 lg:h-40">

            </div>

            <div className="w-full px-1 mb-8 mt-2 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 ">
                <div className='flex flex-col justify-center space-x-10 space-y-16 mt-20'>
                    <div className="max-w-3xl mx-auto p-6 text-gray-800">
                        <h1 className="text-2xl font-bold mb-4">Privacy Policy </h1>
                        <p className="italic mb-4">Last updated: 2025-05-27</p>

                        <h2 className="text-xl font-semibold mt-6">1. Who is responsible for processing your data?</h2>
                        <p><strong>Art Now Database</strong></p>
                        <p>Email: <a href="mailto:info@artnowdatabase.eu" className="text-blue-600 underline">info@artnowdatabase.eu</a></p>
                        <p>If you have any questions about how we handle your data, or if you want to exercise your rights, please contact us.</p>

                        <h2 className="text-xl font-semibold mt-6">2. Use of Cookies</h2>

                        <h3 className="text-lg font-medium mt-4">2.1. Why do we use cookies?</h3>
                        <p>We use cookies only where necessary — primarily to support essential website functionality like user authentication. For general website visitors, no cookies are placed unless they log in or perform an action requiring authentication.</p>

                        <h3 className="text-lg font-medium mt-4">2.2. Functional Cookies</h3>
                        <p>If you log in to access member-only areas of the site, a functional cookie will be placed in your browser to maintain your authenticated session. These cookies are essential for the service and cannot be disabled.</p>

                        <h3 className="text-lg font-medium mt-4">2.3. Analytics Without Cookies</h3>
                        <p>We use <strong>Umami</strong>, a privacy-focused analytics platform, to understand how visitors use our website.</p>
                        <p>Umami does not use cookies and does not collect personally identifiable information.</p>
                        <p>It tracks basic, anonymized usage data such as:</p>
                        <ul className="list-disc pl-6">
                            <li>Pages visited</li>
                            <li>Device and browser type</li>
                            <li>Referring website</li>
                            <li>General location (based on IP, anonymized)</li>
                        </ul>
                        <p>All analytics data is anonymized and stored on servers we control in the European Union. It is never shared with third parties.</p>

                        <h3 className="text-lg font-medium mt-4">2.4. Cookie Banner</h3>
                        <p>Because we do not use tracking or advertising cookies, we do not require consent banners for analytics. However, when logging in, users are informed that a session cookie will be stored to support secure access. This is a necessary, functional cookie that does not require consent under GDPR.</p>


                        <h2 className="text-xl font-semibold mt-6">3. Location Data</h2>
                        <p>We only access your location if you explicitly click a button to find exhibitions near you. Your location is used solely for this feature and is never stored or shared with third parties.</p>

                        <h2 className="text-xl font-semibold mt-6">4. Personal Data and User Accounts</h2>
                        <h3 className="text-lg font-medium mt-4">4.1. What personal data do we collect?</h3>
                        <p>When you create an account to publish event data or advertisements, we collect:</p>
                        <ul className="list-disc pl-6">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Organization or institution (if applicable)</li>
                            <li>Event details (title, location, dates, etc.)</li>
                        </ul>
                        <p>These data are stored securely and only used to display your exhibitions or advertisements in the Art Now Database calendar.</p>

                        <h3 className="text-lg font-medium mt-4">4.2. Your rights</h3>
                        <p>Under the <strong>General Data Protection Regulation (GDPR)</strong>, you have the right to:</p>
                        <ul className="list-disc pl-6">
                            <li>Access your data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Withdraw consent for data processing</li>
                            <li>Request data portability</li>
                        </ul>
                        <p>You can send a request to <a href="mailto:info@artnowdatabase.eu" className="text-blue-600 underline">info@artnowdatabase.eu</a>. To protect your privacy, we may ask for proof of identity.</p>

                        <h2 className="text-xl font-semibold mt-6">5. Data Security</h2>
                        <p>We take appropriate technical and organizational measures to protect your data against unauthorized access, loss, or misuse.</p>

                        <h2 className="text-xl font-semibold mt-6">6. Changes to this Policy</h2>
                        <p>We may update this privacy policy from time to time. Please review this page periodically.</p>
                        <p>If you have any questions, contact us at <a href="mailto:info@artnowdatabase.eu" className="text-blue-600 underline">info@artnowdatabase.eu</a>.</p>
                    </div>
                </div>

                <div className='results-container overflow-y-auto sm:mt-4'
                >
                </div>

                <div className="flex flex-col items-center w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5">
                    {/* <div className='bg-amber-100 md-w-full h-40 w-4/5 border-t-4'></div>
                <div className='bg-green-300 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-indigo-500 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-pink-300 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-amber-100 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-green-300 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-indigo-500 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-pink-300 w-full h-40 md-w-1/2 border-t-4'></div> */}
                </div>

                <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block">

                </div>

                <div className="w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 "></div>

                <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 "></div>

                <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block"></div>

                <div className="w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 "></div>

                <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 "></div>
                {/* <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:w-1/3 lg:px-1 lg:my-1 xl:w-1/3 "></div> */}
            </div>
        </div>
    );
};

export default Privacy;

