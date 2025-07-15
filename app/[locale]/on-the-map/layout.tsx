import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
    children: ReactNode
    params: { locale: string }
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale: params.locale, namespace: 'on-the-map' })

    return {
        title: t('meta.title'),
        description: t('meta.description'),
        openGraph: {
            title: t('meta.title'),
            description: t('meta.description'),
            url: `https://www.artnowdatabase.eu/${params.locale}/on-the-map`,
            siteName: 'Art Now Database',
            images: [
                {
                    url: '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: t('meta.title'),
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('meta.title'),
            description: t('meta.description'),
            images: ['/og-image.jpg'],
        },
    }
}

export default function OnTheMapLayout({ children }: Props) {
    return <>{children}</>
}
