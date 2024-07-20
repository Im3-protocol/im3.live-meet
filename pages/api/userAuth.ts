import { axiosInstance } from './base';

export async function userAuthApi(
  sig: string,
  roomName: string,
  participantName: string,
  identity: string,
  wallet: string,
) {
  console.log(sig, roomName, participantName, identity, wallet);
  const response = await axiosInstance.post(
    '/api/v1/rooms/create-token',
    {
      roomName,
      participantName,
      identity,
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
