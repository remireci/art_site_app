// components/HeaderWithAuth.tsx (server component)
import { cookies } from 'next/headers';
import Header from './Header';

export default async function HeaderWithAuth() {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth_token');

    const isLoggedIn = !!authToken;

    return <Header isLoggedIn={isLoggedIn} />;
}
