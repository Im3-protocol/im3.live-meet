import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';
import { DefaultSeo } from 'next-seo';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="im3 meet"
        titleTemplate="%s"
        defaultTitle="im3 meet"
        description="im3"
        twitter={{
          handle: '@livekitted',
          site: '@livekitted',
          cardType: 'summary_large_image',
        }}
        openGraph={{
          url: 'https://im3.live',
          images: [
            {
              url: 'https://meet.livekit.io/images/im3.svg',
              width: 2000,
              height: 1000,
              type: 'image/png',
            },
          ],
          site_name: 'LiveKit Meet',
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
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
