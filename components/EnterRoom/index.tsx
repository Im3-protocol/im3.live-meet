import React from "react";
import EnterRoomButton from "../EnterRoomButton";
import styles from "../../styles/EnterRoom.module.css"
import Image from 'next/image'
import Logo from "../../public/images/enterRoom/im3_logo.svg"

const EnterRoom = () => {
    return(
        <section >
            <div className={styles.logo}>
                <Image
                    src={Logo}
                    width={160}
                    height={130}
                    alt="Im3_Logo"
                />
            </div>
            <div className={styles.page}>
                <h1 className={styles.tittle}>Video Calls and Meetings via a  <span className={styles.gradient}>Decentralized</span> Public Network </h1>
                <p className={styles.subtitle}>Connect with your web3 identity, mint NFTs and POAPs, and more.</p>
                <EnterRoomButton />
            </div>
        </section>
    )
};

export default EnterRoom;