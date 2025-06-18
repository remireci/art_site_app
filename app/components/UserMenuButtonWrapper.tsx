'use client';
import { usePathname } from 'next/navigation';
import UserMenuButton from './UserMenuButton';

const UserMenuButtonWrapper = () => {
    const pathname = usePathname();

    return <UserMenuButton key={pathname} />;
};

export default UserMenuButtonWrapper;
