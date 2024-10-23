import Image from 'next/image';
import RecorderIcon from '../../public/images/enterRoom/RecorderIcon.svg';
import RecordIconSolid from '../../public/images/enterRoom/RecorderIconSolid.svg';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { randomString, generateRoomId, encodePassphrase } from "../../lib/client-utils";
import useGetConfigData from '../../hooks/useGetConfigData';
import { EnterRoomButtonType } from "../../lib/types";

const EnterRoomButton = ({variation}: EnterRoomButtonType) => {
    const router = useRouter();
const [e2ee, setE2ee] = useState(false);
    const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));

    const configData = useGetConfigData();

    const startMeeting = () => {
        const slug = configData?.slug || generateRoomId();
        if (e2ee) {
            router.push(`/rooms/${slug}/${encodePassphrase(sharedPassphrase)}`);
        } else {
            router.push(`/rooms/${slug}`);
        }
    };

    return (
        <button className={`${variation === 'solid' ? 'bg-white  w-48 md:w-[272px]' : 'w-44 md:w-[245px]' }  flex md:h-[60px] md:py-6 py-3.5 md:px-8 justify-center items-center rounded-[32px] border border-[#F4F4F4] gap-[10px] hover:border-im3Red duration-200 delay-300`} onClick={startMeeting}>
            <Image
                className='w-[21px] h-[14px]'
                src={variation === 'solid' ? RecordIconSolid : RecorderIcon}
                width={500}
                height={500}
                alt="Im3_Logo"
            />
            <span className={` ${variation === 'solid'? 'text-black': null } flex justify-center items-center text-sm`}>{variation === 'solid' ? 'Enter a new Meeting': 'Start new Space'}</span>
        </button>
    );
};

export default EnterRoomButton;
