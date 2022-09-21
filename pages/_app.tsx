import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import styles from "./_app.module.css";
import * as LDClient from 'launchdarkly-js-client-sdk';
import { useEffect, useRef, useState } from "react";
 import { datadogRum } from '@datadog/browser-rum';


function MyApp({ Component, pageProps }: AppProps) {
     const LDClientRef = useRef<LDClient.LDClient>();
     const [aboutPageFlag, setAboutPageFlag] = useState(false)
 
     useEffect(() => {
        LDClientRef.current = LDClient.initialize('63208636a32b9112171b4bcb', {key: 'abc123'});
        LDClientRef.current.on('ready', () => {
            console.log('>>>', LDClientRef?.current?.variation('about-page', false))
            setAboutPageFlag(LDClientRef?.current?.variation('about-page', false) as boolean);
        }); 
        LDClientRef.current.on('change', () => {
            setAboutPageFlag(LDClientRef?.current?.variation('about-page', false) as boolean);
        }); 
        
        datadogRum.init({
            applicationId: '6f160718-dc06-4270-b6e3-c8d68304b396',
            clientToken: 'pub07b049d73375221cf2de698888cef701',
            site: 'datadoghq.com',
            service:'feature-flags-test-app',
            
            // Specify a version number to identify the deployed version of your application in Datadog 
            // version: '1.0.0',
            sampleRate: 100,
            premiumSampleRate: 100,
            trackInteractions: true,
            defaultPrivacyLevel:'mask-user-input'
        });
            
        datadogRum.startSessionReplayRecording();
      }, []);
      
  return (
    <>
      <nav className={styles["nav-bar"]}>
        <div className={styles.links}>
          <Link href="/">Home</Link>
          { aboutPageFlag ? <Link href="/about">About</Link> : null}
        </div>
      </nav>
      <div className={styles.content}>
        <Component {...pageProps} />
        </div>
    </>
  );
}

export default MyApp;
