import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';
import '@rainbow-me/rainbowkit/styles.css';
import { DefaultSeo } from 'next-seo';
import WagmiConfigRoot from '../components/WagmiRoot';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="IM3 Meet"
        titleTemplate="%s"
        defaultTitle="IM3 Meet"
        description="IM3 Meet"
        twitter={{
          handle: '@livekitted',
          site: '@livekitted',
          cardType: 'summary_large_image',
        }}
        openGraph={{
          url: 'https://Meet.im3.live',
          images: [
            {
              url: 'https://Meet.im3.live/images/im3.svg',
              width: 2000,
              height: 1000,
              type: 'image/png',
            },
          ],
          site_name: 'IM3 Meet',
        }}
        additionalMetaTags={[
          {
            property: 'theme-color',
            content: '#070707',
          },
        ]}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/images/enterRoom/favicon_logo.svg',
          },
          {
            rel: 'apple-touch-icon',
            href: '/images/enterRoom/favicon_logo.svg',
            sizes: '180x180',
          },
          {
            rel: 'mask-icon',
            href: '/images/enterRoom/favicon_logo.svg',
            color: '#070707',
          },
        ]}
      />
      <WagmiConfigRoot>
        <Component {...pageProps} />
      </WagmiConfigRoot>
    </>
  );
}

export default MyApp;
