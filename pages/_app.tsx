import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';
import { DefaultSeo } from 'next-seo';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="IM3 Meet"
        titleTemplate="%s"
        defaultTitle="IM3 Meet"
        description="IM3 is an open source WebRTC project that gives you everything needed to build scalable and real-time audio and/or video experiences in your applications."
        
        openGraph={{
          url: 'https://meet.im3.live',
          images: [
            {
              url: '/images/im3.svg',
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
