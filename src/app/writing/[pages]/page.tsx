import { RenderedMarkdown } from './RenderedMarkdown';

export default async function Page({ params }: { params: { pages: string } }) {
  var { pages } = await params;
  pages = decodeURIComponent(pages);
  const filename = pages + '.md';

  return (
    <RenderedMarkdown name={filename} />
  );
}

