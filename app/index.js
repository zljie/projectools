// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>欢迎使用项目管理工具</h1>
      <Link href="/form">
        <a>填写项目表单</a>
      </Link>
    </div>
  );
}
