import {
  LiveKitRoom,
  VideoConference,
  formatChatMessageLinks,
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
import axios from 'axios';

const Home: NextPage = () => {
  const router = useRouter();
  const { name: roomName } = router.query;

  const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(
    undefined,
  );

  const preJoinDefaults = React.useMemo(() => {
    return {
      username: '',
      videoEnabled: true,
      audioEnabled: true,
    };
  }, []);

  const handlePreJoinSubmit = React.useCallback((values: LocalUserChoices) => {
    setPreJoinChoices(values);
  }, []);

  const onPreJoinError = React.useCallback((e: any) => {
    console.error(e);
  }, []);

  const onLeave = React.useCallback(() => router.push('/'), []);

  return (
    <>
      <Head>
        <title>im3 Meet</title>
        <link rel="icon" href="/images/im3.svg" />
      </Head>

      <main data-lk-theme="default">
        {roomName && !Array.isArray(roomName) && preJoinChoices ? (
          <ActiveRoom
            roomName={roomName}
            userChoices={preJoinChoices}
            onLeave={onLeave}
          ></ActiveRoom>
        ) : (
          <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
            <JoinMeetingForm onSubmit={handlePreJoinSubmit} onError={onPreJoinError} />
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
};

const ActiveRoom = ({ roomName, userChoices, onLeave }: ActiveRoomProps) => {
  const [token, setToken] = React.useState<string | null>(null);

  const fetchToken = async () => {
    try {
      const response = await axios.post('https://gateway.im3.live/api/join-meeting', {
        url: `wss://livekit.im3.live/join/${roomName}`,
        username: userChoices.username,
      });
      setToken(response.data.token);
    } catch (error) {
      console.error('Error fetching token:', error);
      alert('Failed to join meeting');
    }
  };

  React.useEffect(() => {
    fetchToken();
  }, [roomName, userChoices.username]);

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
      {liveKitUrl && token && (
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

const JoinMeetingForm = ({ onSubmit, onError }: { onSubmit: any; onError: any }) => {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const videoRef = useRef(null);

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  useEffect(() => {
    startMedia();
  }, []);

  const toggleCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const handleCreateMeeting = async () => {
    try {
      const response = await axios.post('https://gateway.im3.live/api/create-meeting', {
        username,
        user_count_limit: 10,
        time_limit: 60,
        roomName: roomName || undefined, // Pass roomName if available
      });

      if (response.data && response.data.roomName) {
        setRoomName(response.data.roomName);
        alert(`Meeting created! Room Name: ${response.data.roomName}`);
      } else {
        throw new Error('Failed to create meeting');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Error creating meeting');
    }
  };

  const handleJoinMeeting = async () => {
    try {
      const response = await axios.post('https://gateway.im3.live/api/join-meeting', {
        url: `wss://livekit.im3.live/join/${roomName}`,
        username,
      });

      if (response.data && response.data.token) {
        onSubmit({
          username,
          token: response.data.token,
        });
      } else {
        throw new Error('Failed to join meeting');
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      alert('Error joining meeting');
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center', border: '2px solid #ccc', padding: '10px', borderRadius: '10px' }}>
        <h2>Test your Camera and Microphone</h2>
        <video ref={videoRef} autoPlay playsInline style={{ width: '200px', height: 'auto', borderRadius: '10px', marginBottom: '10px' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={toggleCamera} className="lk-button" style={{ padding: '10px' }}>
            {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
          </button>
          <button onClick={toggleMic} className="lk-button" style={{ padding: '10px' }}>
            {isMicOn ? 'Turn Mic Off' : 'Turn Mic On'}
          </button>
        </div>
      </div>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ padding: '1px 2px', fontSize: 'inherit', lineHeight: 'inherit', marginBottom: '1rem' }}
      />
      <input
        type="text"
        name="roomName"
        placeholder="Room Name (leave empty to create)"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        style={{ padding: '1px 2px', fontSize: 'inherit', lineHeight: 'inherit', marginBottom: '1rem' }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button onClick={handleCreateMeeting} className="lk-button" style={{ paddingInline: '1.25rem' }}>
          Create Room
        </button>
        <button onClick={handleJoinMeeting} className="lk-button" style={{ paddingInline: '1.25rem' }}>
          Join Meeting
        </button>
      </div>
    </div>
  );
};

