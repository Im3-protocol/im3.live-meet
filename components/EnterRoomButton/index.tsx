import styles from "../../styles/EnterRoomButton.module.css"
import Image from 'next/image'
import RecorderIcon from '../../public/images/enterRoom/RecorderIcon.svg'
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { randomString, generateRoomId, encodePassphrase } from "../../lib/client-utils";


const EnterRoomButton = () => {
    const router = useRouter();
    const [e2ee, setE2ee] = useState(false);
    const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));

    const startMeeting = () => {
    if (e2ee) {
        router.push(`/rooms/${generateRoomId()}#${encodePassphrase(sharedPassphrase)}`);
    } else {
        router.push(`/rooms/${generateRoomId()}`);
    }
    };

    return(
        <button className={styles.btn} onClick={startMeeting}>
            <Image
                src={RecorderIcon}
                width={24}
                height={24}
                alt="Im3_Logo"
            />
                Start new meeting
        </button>
    )
};

export default EnterRoomButton;