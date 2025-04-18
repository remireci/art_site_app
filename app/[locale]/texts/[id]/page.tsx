import { getDocumentById } from "../../../db/mongo";
import { Metadata } from "next";
import Link from 'next/link';

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const { id } = params;
  const article = await getDocumentById(id);

  return {
    title: article?.title || "Text Page",
    description:
      article?.excerpt || "An article about modern and contemporary art",
  };
}

// Server component for text detail page
const TextPage = async ({
  params,
}: {
  params: { locale: string; id: string };
}) => {
  const { id } = params;
  const article = await getDocumentById(id);

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

      <div className="w-full px-1 mb-8 mt-2 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 bg-slate-100">

        <div className="w-full flex justify-center mt-20">
          <div className="max-w-md w-full mt-12">
            <p className="text-slate-400 text-center">
              “ArtNowDatabase helps you discover insightful texts about modern and contemporary art from trusted sources.”
            </p>
          </div>
        </div>

        {article && (
          <>
            {/* Article link */}
            <div className="w-full flex justify-center mt-10">
              <div className="max-w-md w-full">
                <Link
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-white hover:bg-[#87bdd8] text-[#87bdd8] font-medium border border-blue-400 rounded-lg px-6 py-3 shadow transition-all duration-300"
                >
                  <h1 className="text-slate-400 text-lg">{article.title}</h1>
                  Read the full article on the original website ↗
                </Link>
              </div>
            </div>

            {/* Event promotion block */}
            <div className="w-full flex justify-center mt-28">
              <div className="max-w-md w-full bg-[#fdf6ec] text-slate-800 p-4 rounded-lg shadow text-center">
                <p className="text-sm text-slate-400 mb-2">Looking for more? Discover art events related to your interests.</p>
                <Link
                  href="/"
                  className="inline-block bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 px-4 py-1 rounded font-medium uppercase"
                >
                  Browse Exhibitions →
                </Link>
              </div>
            </div>

            {/* HTML Content */}
            <div className="w-full flex justify-center mt-10">
              <div className="max-w-md w-full text-slate-100 prose prose-sm prose-slate">
                <div dangerouslySetInnerHTML={{ __html: article.html_content }} />
              </div>
            </div>
          </>
        )}


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

export default TextPage;
