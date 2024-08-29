import styles from "../../styles/EnterRoomButton.module.css"
import Image from 'next/image'
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { randomString, generateRoomId, encodePassphrase } from "../../lib/client-utils";
interface startMeetingButtonTypes {
    tittle: string,
    icon: string,
    type: string,
}


const EnterRoomButton = ({tittle, icon, type}: startMeetingButtonTypes) => {
    const router = useRouter();
    const [e2ee, setE2ee] = useState(false);
    const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));

    const startMeeting = (type: any) => {
    if ( e2ee && type === 'meet' ) {
        router.push(`/rooms/${generateRoomId()}#${encodePassphrase(sharedPassphrase)}`);
    }
    if ( type === 'meet' ) {
        router.push(`/rooms/${generateRoomId()}`);
    }
    // /space.im3.live
    if ( e2ee && type === 'space' ) {
        window.location.href = "https://www.space.im3.live/rooms/${generateRoomId()}#${encodePassphrase(sharedPassphrase)}";
    }
    if ( type === 'space' ) {
        window.location.href = `https://space.im3.live/rooms/${generateRoomId()}`;
    }
    };

    return(
        <button className={`${styles.btn} md:mt-6`} onClick={ () => startMeeting(type) } >
            <Image
                src={icon}
                width={24}
                height={24}
                alt="Im3_Logo"
            />
                {tittle}
        </button>
    )
};

export default EnterRoomButton;