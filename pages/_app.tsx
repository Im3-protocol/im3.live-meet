import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';
import '@rainbow-me/rainbowkit/styles.css';
import { DefaultSeo } from 'next-seo';
import WagmiConfigRoot from '../components/WagmiRoot';

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
          url: 'https://meet.im3.live',
          images: [
            {
              url: 'https://meet.im3.live/images/im3.svg',
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
            href: '/images/im3.svg',
          },
          {
            rel: 'apple-touch-icon',
            href: '/images/im3.svg',
            sizes: '180x180',
          },
          {
            rel: 'mask-icon',
            href: '/images/im3.svg',
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
