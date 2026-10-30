import { readdir, stat } from "fs/promises"
import { WRITING_PATH } from "@/app/constants"
import { PostNameToLinkComponent } from "./PostNameToLink";
import { join } from "path";

async function getAllPosts() {
  const files = await readdir(WRITING_PATH);
  
  const files_with_stats = await Promise.all(
    files.map(async (file) => ({
      name: file,
      time: (await stat(join(WRITING_PATH, file))).birthtimeMs,
    }))
  );
  
  files_with_stats.sort((a, b) => b.time - a.time);
  
  const valid_posts = files_with_stats
    .filter((file) => file.name.endsWith('.md'))
    .map((file) => file.name.substring(0, file.name.indexOf('.')));
  
  return valid_posts;
}


export default async function PostList() {
  const posts = await getAllPosts();
  
  return (
    <div className="post-list">
      {
        posts.map((post, idx) => {
          return (
            <div key={idx} >
            <PostNameToLinkComponent name={post} />
            </div>
          )
        })
      }
    </div>
  )
}
