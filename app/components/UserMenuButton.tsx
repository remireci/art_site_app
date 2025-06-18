'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const UserMenuButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => setIsLoggedIn(res.ok))
            .catch(() => setIsLoggedIn(false));

    }, []);

    const handleLogout = async () => {
        const confirmed = window.confirm('Are you sure you want to log out?');
        if (!confirmed) return;

        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
            setIsLoggedIn(false);
            router.refresh();
        } else {
            alert('Logout failed.');
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="text-center p-2 rounded-md">
                {!isLoggedIn ? (
                    <DropdownMenuItem className="justify-center"
                        onClick={() => router.push('/auth/signin?reset=1')}>
                        Log in
                    </DropdownMenuItem>
                ) : (
                    <>
                        <DropdownMenuItem className="hover:bg-gray-500 hover:text-white justify-center transition-colors duration-200 rounded-md"
                            onClick={() => router.push('/dashboard')}>
                            Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-500 hover:text-white justify-center transition-colors duration-200 rounded-md" onClick={handleLogout}>Log out</DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenuButton;


// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useRef, useState } from 'react';
// import { User } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// const UserMenuButton = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);
//     const router = useRouter();

//     // Check login status on mount
//     useEffect(() => {
//         fetch('/api/auth/me')
//             .then((res) => setIsLoggedIn(res.ok))
//             .catch(() => setIsLoggedIn(false));
//     }, []);

//     // Close dropdown on outside click
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setShowDropdown(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const handleToggleMenu = () => {
//         setShowDropdown((prev) => !prev);
//     };

//     const handleLogin = () => {
//         setShowDropdown(false);
//         router.push('/auth/signin');
//     };

//     const handleDashboard = () => {
//         setShowDropdown(false);
//         router.push('/dashboard');
//     };

//     const handleLogout = async () => {
//         const res = await fetch('/api/auth/logout', { method: 'POST' });
//         if (res.ok) {
//             setIsLoggedIn(false);
//             setShowDropdown(false);
//             router.refresh();
//         } else {
//             alert('Logout failed. Please try again.');
//         }
//     };

//     return (
//         <div className="relative" ref={dropdownRef}>
//             <Button variant="ghost" size="icon" onClick={handleToggleMenu}>
//                 <User className="h-5 w-5" />
//                 <span className="sr-only">Account</span>
//             </Button>

//             {showDropdown && (

//                 <div className="fixed top-20 right-4 z-[9999] mt-2 w-64 bg-white border border-gray-300 rounded shadow p-4 text-sm">
//                     <ul className="flex flex-col text-sm text-slate-700">
//                         {!isLoggedIn ? (
//                             <li>
//                                 <button
//                                     onClick={handleLogin}
//                                     className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                                 >
//                                     Log in
//                                 </button>
//                             </li>
//                         ) : (
//                             <>
//                                 <li>
//                                     <button
//                                         onClick={handleDashboard}
//                                         className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                                     >
//                                         Dashboard
//                                     </button>
//                                 </li>
//                                 <li>
//                                     <button
//                                         onClick={handleLogout}
//                                         className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
//                                     >
//                                         Log out
//                                     </button>
//                                 </li>
//                             </>
//                         )}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UserMenuButton;
