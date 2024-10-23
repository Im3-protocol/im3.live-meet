import { LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
import { ButtonHTMLAttributes } from 'react';

export interface SessionProps {
  roomName: string;
  identity: string;
  audioTrack?: LocalAudioTrack;
  videoTrack?: LocalVideoTrack;
  region?: string;
  turnServer?: RTCIceServer;
  forceRelay?: boolean;
}

export interface TokenResult {
  identity: string;
  accessToken: string;
}

export type RecordButtonType = ButtonHTMLAttributes<HTMLButtonElement> & {
  roomName: string;
  identity: string;
  onDataReceived?: any;
  isAdmin: boolean;
  className?: string;
  recordType: any;
  participantsList: any;
};

export type EnterRoomButtonType = {
  variation?: string;
}