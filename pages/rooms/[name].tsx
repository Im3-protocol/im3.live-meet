'use client';
import {
  LiveKitRoom,
  VideoConference,
  formatChatMessageLinks,
  useToken,
  LocalUserChoices,
  PreJoin,
} from '@livekit/components-react';
import {
  DeviceUnsupportedError,
  ExternalE2EEKeyProvider,
  Room,
  RoomConnectOptions,
  RoomOptions,
  VideoCodec,
  VideoPresets,
  setLogLevel,
} from 'livekit-client';

import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { DebugMode } from '../../lib/Debug';
import { decodePassphrase, useServerUrl } from '../../lib/client-utils';
import { SettingsMenu } from '../../lib/SettingsMenu';
import useWagmi from '../../hooks/useWagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useSignMessage } from 'wagmi';
import { userAuthApi } from '../api/userAuth';
const Home: NextPage = () => {
  const router = useRouter();
  const { name: roomName } = router.query;
  const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(
    undefined,
  );

  const [roomValues, setRoomValues] = React.useState<LocalUserChoices | null>();
  const [joinAsGuestText, setJoinAsGuestText] = React.useState('Join as Guest');

  const { openConnectModal } = useConnectModal();

  const { account } = useWagmi();

  const zeroAddress = '0x0000000000000000000000000000000000000000';

  const [token, setToken] = React.useState('');

  const [isGuest, setIsGuest] = React.useState(false);

  const { data: signMessageData, signMessage, isLoading } = useSignMessage();

  const preJoinDefaults = React.useMemo(() => {
    return {
      username: '',
      videoEnabled: true,
      audioEnabled: true,
    };
  }, []);

  const handleAuthApi = async (userName: string) => {
    if (signMessageData && roomName && !Array.isArray(roomName) && account) {
      try {
        const res = await userAuthApi(signMessageData, roomName, userName, account, account);
        console.log(token);
        setToken(res);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  };

  const handleAuthApiGuest = async (userName: string) => {
    if (roomName && !Array.isArray(roomName)) {
      try {
        const res = await userAuthApi('', roomName, userName, zeroAddress, zeroAddress);
        console.log(res);
        setToken(res);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  };

  const truncateAddress = (address: string, size = 4) => {
    return `${address.substring(0, size + 2)}...${address.substring(address.length - size)}`;
  };

  const handleSignMessage = () => {
    if (account) {
      signMessage({
        message: 'Please sign this message to verify connecting your wallet',
      });
    }
  };

  const handleConnectWallet = async () => {
    openConnectModal!();
  };

  const handleSetPreJonChoices = async () => {
    if (roomValues) {
      const res = await handleAuthApi(roomValues.username);
      console.log(res);
      if (!res) return;
      setPreJoinChoices(roomValues);
    }
  };

  React.useEffect(() => {
    if (account && !signMessageData && roomValues) handleSignMessage();

    if (signMessageData && roomValues) handleSetPreJonChoices();
  }, [account, signMessageData]);

  const handlePreJoinSubmit = React.useCallback(
    async (values: LocalUserChoices) => {
      setRoomValues(values);
      if (isGuest) {
        setJoinAsGuestText('Joining as Guest ...');
        const res = await handleAuthApiGuest(values.username);
        if (!res) return;
        setPreJoinChoices(values);
      } else {
        if (!account) handleConnectWallet();
        if (account && !signMessageData) handleSignMessage();
      }
    },
    [isGuest],
  );

  const onPreJoinError = React.useCallback((e: any) => {
    console.error(e);
  }, []);

  const onLeave = React.useCallback(() => router.push('/'), []);

  return (
    <>
      <Head>
        <title>LiveKit Meet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main data-lk-theme="default">
        {account && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              padding: '30px',
              position: 'absolute',
              zIndex: '100000',
              top: 0,
              right: 0,
            }}
          >
            {truncateAddress(account)}
          </div>
        )}
        {roomName && !Array.isArray(roomName) && preJoinChoices ? (
          <ActiveRoom
            roomName={roomName}
            userChoices={preJoinChoices}
            onLeave={onLeave}
            token={token}
          ></ActiveRoom>
        ) : (
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              height: '100%',
            }}
          >
            <div className="preJoin-wrapper">
              {!isGuest ? (
                <PreJoin
                  onError={onPreJoinError}
                  defaults={preJoinDefaults}
                  joinLabel={
                    !account && !isLoading
                      ? 'Connect wallet'
                      : account && isLoading
                      ? 'Signing Message'
                      : account && !isLoading && !signMessageData
                      ? 'Sign message to Join Room'
                      : 'Joining Room ...'
                  }
                  onSubmit={handlePreJoinSubmit}
                ></PreJoin>
              ) : (
                <PreJoin
                  onError={onPreJoinError}
                  defaults={preJoinDefaults}
                  joinLabel={joinAsGuestText}
                  onSubmit={handlePreJoinSubmit}
                ></PreJoin>
              )}
              <div style={{ minHeight: '20px', marginTop: '-8px' }}>
                {!isGuest && (
                  <div className="join-as-guest-button" onClick={() => setIsGuest(true)}>
                    If don't have Wallet Join as Guest!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;

type ActiveRoomProps = {
  userChoices: LocalUserChoices;
  roomName: string;
  region?: string;
  onLeave?: () => void;
  token: string | undefined;
};
const ActiveRoom = ({ roomName, userChoices, onLeave, token }: ActiveRoomProps) => {
  const tokenOptions = React.useMemo(() => {
    return {
      userInfo: {
        identity: userChoices.username,
        name: userChoices.username,
      },
    };
  }, [userChoices.username]);
  // const token = useToken(process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT, roomName, tokenOptions);

  const router = useRouter();
  const { region, hq, codec } = router.query;

  const e2eePassphrase =
    typeof window !== 'undefined' && decodePassphrase(location.hash.substring(1));

  const liveKitUrl = useServerUrl(region as string | undefined);

  const worker =
    typeof window !== 'undefined' &&
    e2eePassphrase &&
    new Worker(new URL('livekit-client/e2ee-worker', import.meta.url));

  const e2eeEnabled = !!(e2eePassphrase && worker);
  const keyProvider = new ExternalE2EEKeyProvider();
  const roomOptions = React.useMemo((): RoomOptions => {
    let videoCodec: VideoCodec | undefined = (
      Array.isArray(codec) ? codec[0] : codec ?? 'vp9'
    ) as VideoCodec;
    if (e2eeEnabled && (videoCodec === 'av1' || videoCodec === 'vp9')) {
      videoCodec = undefined;
    }
    return {
      videoCaptureDefaults: {
        deviceId: userChoices.videoDeviceId ?? undefined,
        resolution: hq === 'true' ? VideoPresets.h2160 : VideoPresets.h720,
      },
      publishDefaults: {
        dtx: false,
        videoSimulcastLayers:
          hq === 'true'
            ? [VideoPresets.h1080, VideoPresets.h720]
            : [VideoPresets.h540, VideoPresets.h216],
        red: !e2eeEnabled,
        videoCodec,
      },
      audioCaptureDefaults: {
        deviceId: userChoices.audioDeviceId ?? undefined,
      },
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
      e2ee: e2eeEnabled
        ? {
            keyProvider,
            worker,
          }
        : undefined,
    };
    // @ts-ignore
    setLogLevel('debug', 'lk-e2ee');
  }, [userChoices, hq, codec]);

  const room = React.useMemo(() => new Room(roomOptions), []);

  if (e2eeEnabled) {
    keyProvider.setKey(decodePassphrase(e2eePassphrase));
    room.setE2EEEnabled(true).catch((e) => {
      if (e instanceof DeviceUnsupportedError) {
        alert(
          `You're trying to join an encrypted meeting, but your browser does not support it. Please update it to the latest version and try again.`,
        );
        console.error(e);
      }
    });
  }
  const connectOptions = React.useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true,
    };
  }, []);

  return (
    <>
      {liveKitUrl && (
        <LiveKitRoom
          room={room}
          token={token}
          serverUrl={liveKitUrl}
          connectOptions={connectOptions}
          video={userChoices.videoEnabled}
          audio={userChoices.audioEnabled}
          onDisconnected={onLeave}
        >
          <VideoConference
            chatMessageFormatter={formatChatMessageLinks}
            SettingsComponent={
              process.env.NEXT_PUBLIC_SHOW_SETTINGS_MENU === 'true' ? SettingsMenu : undefined
            }
          />
          <DebugMode />
        </LiveKitRoom>
      )}
    </>
  );
};
