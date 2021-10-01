import React, { useRef, useState, useEffect } from 'react';

import SwiperCore, { Navigation, Keyboard } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Box, styled } from '@mui/system';
import { Typography, IconButton } from '@mui/material';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { GlobalStyles } from '../../components/GlobalStyles';
import { SlideControls } from './components/SlideControls';

import { IAgoraRTCClient, ClientRole, IMicrophoneAudioTrack, IAgoraRTC } from 'agora-rtc-sdk-ng';

// TODO Token Generator

SwiperCore.use([Navigation, Keyboard]);

const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 100%;
`;

const options = {
  // Pass your app ID here.
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "",
  // Set the channel name.
  channel: "test-channel",
  // Pass a token if your project enables the App Certificate.
  token: "006d32246dedc6f421fb57687c4e957bd93IABYwlQDUMfGjbaDNYXqm/74eX8VQctTrGhO6kkTvlP272LMzZAAAAAAEADSvifOO4FYYQEAAQA8gVhh",
  // Set the user role in the channel.
  role: "host" as ClientRole
};

export const EditSlidePresenterPageContainer = () => {
  const navPrevButtonRef = useRef<HTMLButtonElement>(null);
  const navNextButtonRef = useRef<HTMLButtonElement>(null);

  const [agoraRtc, setAgoraRtc] = useState<IAgoraRTC | null>(null);
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const loadAgora = async () => {
      const instance = (await import('agora-rtc-sdk-ng')).default;
      setAgoraRtc(instance);
    };

    loadAgora();
  }, []);

  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null) 

  const onBeforeInit = (swiper: SwiperCore) => {
    if (typeof swiper.params.navigation === 'boolean') {
      return;
    }

    const navigation = swiper.params.navigation;

    if (!navigation) {
      return;
    }

    navigation.prevEl = navPrevButtonRef.current;
    navigation.nextEl = navNextButtonRef.current;
  };

  const createClient = () => {
    if (!agoraRtc) return 

    const createdClient = agoraRtc.createClient({ mode: "live", codec: "vp8" })
    setClient(createdClient);

    return createdClient;
  }

  const startLive = async () => {
    const createdClient = createClient()

    if (!createdClient) return 
    if (!agoraRtc) return 

    createdClient.setClientRole(options.role);
    await createdClient.join(options.appId, options.channel, options.token, null);

    var audioTrack = await agoraRtc.createMicrophoneAudioTrack();
    setLocalAudioTrack(audioTrack);

    await createdClient.publish([audioTrack]);
  }

  const endLive = async () => {
    localAudioTrack?.close()
    client?.leave()
  }

  const onMicOpen = async () => {
    if (isLive) endLive()
    else startLive()

    setIsLive((prev) => !prev) 
  }

  return (
    <>
      <GlobalStyles />
      <Box
        sx={{
          height: '100%',
        }}
      >
        <SlideControls 
          onMicOpen={onMicOpen} 
        />
        <StyledSwiper
          onBeforeInit={onBeforeInit}
          spaceBetween={50}
          slidesPerView={1}
          keyboard={{
            enabled: true,
          }}
          navigation={{
            prevEl: navPrevButtonRef.current,
            nextEl: navNextButtonRef.current,
          }}
        >
          <SwiperSlide>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography variant="h1">Slider</Typography>
              <Typography
                variant="h5"
                sx={{
                  mt: '40px',
                }}
              >
                An interactive way to create presentations
              </Typography>
            </Box>
          </SwiperSlide>
          <SwiperSlide>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              Slide 2
            </Box>
          </SwiperSlide>
          <SwiperSlide>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              Slide 3
            </Box>
          </SwiperSlide>
          <SwiperSlide>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              Slide 4
            </Box>
          </SwiperSlide>
          <IconButton
            ref={navPrevButtonRef}
            sx={{
              position: 'absolute',
              bottom: 24,
              right: 72,
              zIndex: 2,
            }}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton
            ref={navNextButtonRef}
            sx={{
              position: 'absolute',
              bottom: 24,
              right: 24,
              zIndex: 2,
            }}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </StyledSwiper>
      </Box>
    </>
  );
};
