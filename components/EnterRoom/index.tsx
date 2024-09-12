import React from "react";
import EnterRoomButton from "../EnterRoomButton";
import styles from "../../styles/EnterRoom.module.css"
import Image from 'next/image'
import Logo from "../../public/images/im3.svg"
import RecorderIcon from '../../public/images/enterRoom/RecorderIcon.svg'

const EnterRoom = () => {
    return(
        <section className="flex flex-col justify-center items-start">
            <div className={`${styles.logo} mx-12 mt-6`}>
                <Image
                className="mb-48"
                    src={Logo}
                    width={180}
                    height={200}
                    alt="Im3_Logo"
                />
            </div>
            <div className={`${styles.page}`}>
                <h1 className={styles.tittle}>Video Calls and Meetings via a  <span className={styles.secondaryTextColor}>Decentralized</span> Public Network </h1>
                <p className={styles.subtitle}>Connect with your web3 identity, mint NFTs and POAPs, and more.</p>
                <div className=" flex justify-start md:flex-row flex-col gap-6 pt-8">
                    <EnterRoomButton tittle={"Enter a new Meeting"} icon={RecorderIcon} type={"meet"} />
                    <EnterRoomButton tittle={"Enter a new Space"} icon={RecorderIcon} type={"space"} />
                </div>
            </div>
        </section>
    )
};

export default EnterRoom;