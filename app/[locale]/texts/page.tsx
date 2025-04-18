import { getDocuments } from '../../db/mongo.js';
import Link from 'next/link';
import { Metadata } from 'next';
// interface SearchParams {
//   page?: string; // or a number if you prefer
// }

export async function generateMetadata({ params, searchParams }: { params: { locale: string }; searchParams: { page?: string } }) {
  const page = searchParams.page ? Math.max(parseInt(searchParams.page), 1) : 1;

  return {
    title: `Text List - Page ${page}`,
    description: `Browse page ${page} of texts about modern and contemporary art`,
    keywords: 'modern art, contemporary art, database, texts, reviews, art critics',
  };
}

export default async function TextListPage({ searchParams }: { searchParams: { page?: string } }) {
  // Define page size for pagination
  const pageSize = 50;

  // Extract current page from query parameters, defaulting to page 1
  const page = searchParams.page ? Math.max(parseInt(searchParams.page), 1) : 1;

  // Skip documents for pagination
  const skip = (page - 1) * pageSize;

  // Get paginated texts from MongoDB
  const texts = await getDocuments({}, skip, pageSize);

  // Handle the case where no texts are returned (e.g., last page)
  const hasMoreTexts = texts.length === pageSize;

  return (
    <>

      <div>
        <h1 className='text-slate-100'>Texts</h1>

        {/* List of clickable titles */}
        <ul>
          {texts.map((text) => (
            <li key={text._id.toString()}>
              <Link href={`/texts/${text._id}`} className='text-slate-400'>{text.title}</Link>
            </li>
          ))}
        </ul>

        {/* Pagination Buttons */}
        <div>
          <a
            href={`?page=${page - 1}`}
            className={page <= 1 ? 'disabled' : ''}
            aria-disabled={page <= 1 ? 'true' : 'false'}
          >
            Previous
          </a>

          <a
            href={`?page=${page + 1}`}
            className={hasMoreTexts ? '' : 'disabled'}
            aria-disabled={!hasMoreTexts ? 'true' : 'false'}
          >
            Next
          </a>
        </div>
      </div>
    </>
  );
}
