// components/HeaderWithAuth.tsx (server component)
import { cookies } from 'next/headers';
import Header from './Header';

export default async function HeaderWithAuth() {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth_token');

    const isLoggedIn = !!authToken; // You can also verify the token here if needed

    return <Header isLoggedIn={isLoggedIn} />;
}
