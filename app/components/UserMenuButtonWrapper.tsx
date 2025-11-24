'use client';
import { usePathname } from 'next/navigation';
import UserMenuButton from './UserMenuButton';

type UserMenuButtonWrapperProps = {
    isLoggedIn: boolean;
};

const UserMenuButtonWrapper = ({ isLoggedIn }: UserMenuButtonWrapperProps) => {
    const pathname = usePathname();

    return <UserMenuButton
        key={pathname}
        isLoggedIn={isLoggedIn} />;
};

export default UserMenuButtonWrapper;
