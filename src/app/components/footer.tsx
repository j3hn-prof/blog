import { headers } from "next/headers";

export default async function Footer() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  
  return (
    <footer className="flex-box-r">
      <div>
        {userAgent}
      </div>
    </footer>
  );
}
