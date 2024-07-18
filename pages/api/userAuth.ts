import { axiosInstance } from './base';

export async function userAuthApi(
  sig: string,
  roomName: string,
  participantName: string,
  wallet: string,
) {
  const response = await axiosInstance.post(
    '/api/v1/rooms/create-token',
    {
      roomName,
      participantName,
      wallet,
    },
    {
      headers: {
        sig: sig,
      },
    },
  );
  return response.data;
}
