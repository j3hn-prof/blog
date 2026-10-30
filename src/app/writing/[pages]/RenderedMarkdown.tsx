import { remark } from 'remark'; 
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { readFile } from 'fs/promises';
import path from 'path';
import { WRITING_PATH } from '@/app/constants';

export async function getMarkdown(file_name: string) {
  const filePath = path.join(WRITING_PATH, file_name);
  const markdown = await readFile(filePath, 'utf-8');
  return markdown;
}

export async function RenderedMarkdown({name}: {name: string}) {
  try {
    const markdown = await getMarkdown(name);
    const html_code = (await remark()
      .use(remarkParse)
      .use(remarkHtml)
      .use(remarkGfm)
      .process(markdown)).value;

    return (
      <div dangerouslySetInnerHTML={{__html: html_code}} />
    );
  }
  catch (e) {
      console.error(e);
    return (
      <div>Invalid Post</div>
    );
  }
}
