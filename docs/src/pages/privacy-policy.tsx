import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useColorMode } from '@docusaurus/theme-common';
function HomepageHeader() {
  const { isDarkTheme } = useColorMode();

  return (
    <header>
      <section className="max-w-[900px] m-4 p-4 md:p-6 md:m-auto md:my-12 border border-red-400 rounded bg-slate-200 dark:bg-wizarr-dark-gray">
        
      </section>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Home"
      description="immich Self-hosted photo and video backup solution directly from your mobile phone "
      noFooter={true}
    >
      <HomepageHeader />
      <div className="flex flex-col place-items-center place-content-center">
        <p>This project is available under MIT license.</p>
        <p className="text-xs">Privacy should not be a luxury</p>
      </div>
    </Layout>
  );
}
