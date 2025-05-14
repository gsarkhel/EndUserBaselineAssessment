import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/VideoPlayer.scss';
import parentStyles from '../styles/commonStyles.scss';
import parse from 'html-react-parser';
import { t } from '../helpers/LanguageTranslator';
import globalStore from '../thunk';
import ButtonComponent from './ButtonComponent';
import '../../../public/common/assets/fonts/fonts.css';

interface videoPlayerPropsInterface {
    src: string;
    closeHandler?: Function;
}

const VideoPlayer = (props: videoPlayerPropsInterface) => {
    const closeBtnRef = useRef(null);
    const videoRef = useRef(null);
    const { src = '', closeHandler } = props;
    const { images } = globalStore.useStoreState((store) => store.player);

    useEffect(() => {
        if (closeBtnRef?.current) {
            closeBtnRef.current.addEventListener("click", (e: Event) => {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                closeHandler();
            })
        }
    }, [])

    return (
        <>
            <ButtonComponent text={t('Close')} reference={closeBtnRef} normalCSS={styles.videoCloseBtn} ariaLabel="Close" title='Close' />
            <video ref={videoRef} width="850" height="auto" poster={`${src}/poster.jpg`} controls autoPlay disablePictureInPicture controlsList="nodownload">
                <source src={`${src}/video.mp4`} type="video/mp4" />
                <track
                    src={`${src}/video.vtt`}
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                    default
                />
                Your browser does not support the video tag.
            </video>
        </>
    );
};

export default VideoPlayer;


