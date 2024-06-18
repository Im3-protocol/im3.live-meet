import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { encodePassphrase, randomString } from '../lib/client-utils';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCameraSlash, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

interface TabsProps {
  children: ReactElement[];
  selectedIndex?: number;
  onTabSelected?: (index: number) => void;
}

function Tabs(props: TabsProps) {
  const activeIndex = props.selectedIndex ?? 0;
  if (!props.children) {
    return <></>;
  }

  let tabs = React.Children.map(props.children, (child, index) => {
    return (
      <button
        className="lk-button"
        onClick={() => {
          if (props.onTabSelected) props.onTabSelected(index);
        }}
        aria-pressed={activeIndex === index}
      >
        {child?.props.label}
      </button>
    );
  });
  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabSelect}>{tabs}</div>
      {props.children[activeIndex]}
    </div>
  );
}

function DemoMeetingTab({ label }: { label: string }) {
  const router = useRouter();
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));
  const startMeeting = () => {
    if (e2ee) {
      router.push(`/rooms/${randomString(10)}#${encodePassphrase(sharedPassphrase)}`);
    } else {
      router.push(`/rooms/${randomString(10)}`);
    }
  };
  return (
    <div className={styles.tabContent}>
      <p style={{ margin: 0 }}>Try IM3 Meet for free with our live demo project.</p>
      <button style={{ marginTop: '1rem' }} className="lk-button" onClick={startMeeting}>
        Start Meeting
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
          <input
            id="use-e2ee"
            type="checkbox"
            checked={e2ee}
            onChange={(ev) => setE2ee(ev.target.checked)}
          ></input>
          <label htmlFor="use-e2ee">Enable end-to-end encryption</label>
        </div>
        {e2ee && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <label htmlFor="passphrase">Passphrase</label>
            <input
              id="passphrase"
              type="password"
              value={sharedPassphrase}
              onChange={(ev) => setSharedPassphrase(ev.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

async function createMeeting(username: string) {
  try {
    const response = await axios.post('https://gateway.im3.live/api/create-meeting', {
      username,
      user_count_limit: 10,
      time_limit: 60
    });

    if (response.data && response.data.url) {
      return response.data.url;
    } else {
      throw new Error('Failed to create meeting');
    }
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
}

async function joinMeeting(url: string, username: string) {
  try {
    const response = await axios.post('https://gateway.im3.live/api/join-meeting', {
      url,
      username,
    });

    if (response.data && response.data.token) {
      return response.data.token;
    } else {
      throw new Error('Failed to join meeting');
    }
  } catch (error) {
    console.error('Error joining meeting:', error);
    throw error;
  }
}

function CustomConnectionTab({ label }: { label: string }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [username, setUsername] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));
  const [audioTest, setAudioTest] = useState<string>('Audio test not started');
  const [isCameraWorking, setIsCameraWorking] = useState<boolean>(false);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraWorking(true);
        }
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, b) => a + b, 0);
          if (sum > 0) {
            setAudioTest('Audio input detected');
          } else {
            setAudioTest('No audio input detected');
          }
          requestAnimationFrame(checkAudio);
        };

        checkAudio();
      } catch (err) {
        console.error('Error accessing media devices.', err);
        setAudioTest('Error accessing media devices');
        setIsCameraWorking(false);
      }
    };

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
      const url = await createMeeting(username);
      setMeetingUrl(url);
      alert(`Meeting created! URL: ${url}`);
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Error creating meeting');
    }
  };

  const handleJoinMeeting = async () => {
    try {
      const userToken = await joinMeeting(meetingUrl, username);

      if (e2ee) {
        router.push(
          `/custom/?liveKitUrl=${encodeURIComponent('wss://livekit.im3.live')}&token=${userToken}#${encodePassphrase(sharedPassphrase)}`,
        );
      } else {
        router.push(`/custom/?liveKitUrl=${encodeURIComponent('wss://livekit.im3.live')}&token=${userToken}`);
      }
    } catch (error) {
      console.error('Error joining the meeting:', error);
      alert('Error joining the meeting');
    }
  };

  return (
    <div className={styles.tabContent}>
      <div style={{ marginBottom: '1rem', textAlign: 'center', border: '2px solid #ccc', padding: '10px', borderRadius: '10px' }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: '400px', height: 'auto', borderRadius: '10px', marginBottom: '10px' }} />
        {!isCameraWorking && <p>Error accessing camera</p>}
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={toggleCamera} className="lk-button" style={{ padding: '10px' }}>
              {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
          </button>
          <button onClick={toggleMic} className="lk-button" style={{ padding: '10px' }}>
              {isMicOn ? 'Turn Mic Off' : 'Turn Mic On'}
          </button>
        </div>

      </div>
      <p style={{ marginTop: 0 }}>
        Connect IM3 Meet - Enjoy IM3 Meet
      </p>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ padding: '1px 2px', fontSize: 'inherit', lineHeight: 'inherit', marginBottom: '1rem' }}
      />
      <button onClick={handleCreateMeeting} style={{ paddingInline: '1.25rem', width: '100%' }} className="lk-button">
        Create Meeting
      </button>
      <input
        type="text"
        name="meetingUrl"
        placeholder="Meeting URL"
        value={meetingUrl}
        onChange={(e) => setMeetingUrl(e.target.value)}
        required
        style={{ padding: '1px 2px', fontSize: 'inherit', lineHeight: 'inherit', marginBottom: '1rem', marginTop: '1rem' }}
      />
      <button onClick={handleJoinMeeting} style={{ paddingInline: '1.25rem', width: '100%' }} className="lk-button">
        Join Meeting
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
          <input
            id="use-e2ee"
            type="checkbox"
            checked={e2ee}
            onChange={(ev) => setE2ee(ev.target.checked)}
          ></input>
          <label htmlFor="use-e2ee">Enable end-to-end encryption</label>
        </div>
        {e2ee && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <label htmlFor="passphrase">Passphrase</label>
            <input
              id="passphrase"
              type="password"
              value={sharedPassphrase}
              onChange={(ev) => setSharedPassphrase(ev.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  res,
}) => {
  res.setHeader('Cache-Control', 'public, max-age=7200');
  return { props: {} };
};

const Home = () => {
  return (
    <>
      <main className={styles.main} data-lk-theme="default">
        <div className="header">
          <img src="/images/im3.svg" alt="LiveKit Meet"  />
        </div>
        <CustomConnectionTab label="IM3 Meet" />
      </main>
      <footer data-lk-theme="default">
        Hosted on{' '}
        <a href="https://meet.IM3.live" rel="noopener">
          IM3 Cloud
        </a>
        .
      </footer>
    </>
  );
};

export default Home;

