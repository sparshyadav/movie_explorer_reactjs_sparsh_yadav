import { initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken, onMessage } from "firebase/messaging";
import { sendTokenToBackend, toggleNotifications } from "../API";

const firebaseConfig = {
    apiKey: "AIzaSyCKt2wYuYzr0uKWe8o5jUE6p9wb-3lSK68",
    authDomain: "movie-explorer-5bc8a.firebaseapp.com",
    projectId: "movie-explorer-5bc8a",
    storageBucket: "movie-explorer-5bc8a.firebasestorage.app",
    messagingSenderId: "561268525206",
    appId: "1:561268525206:web:9ba893c094bf72aed81ab7",
    measurementId: "G-XPP4G1SXPV"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
    try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.warn('Notification permission not granted:', permission);
            return null;
        }

        const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";

        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
        });

        if (!token || typeof token !== 'string' || token.length < 50) {
            console.warn("Generated token appears invalid");
            return null;
        }

        sendTokenToBackend(token);
        toggleNotifications();

        return token;
    } catch (error) {
        console.error('Error generating FCM token or sending to backend:', error);
        return null;
    }
};

export const monitorToken = async () => {
    try {
        const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
        const token = await getToken(messaging, { vapidKey }).catch(async (error) => {
            if (error.code === 'messaging/token-unsubscribed' || error.code === 'messaging/invalid-token') {
                await deleteToken(messaging).catch(() => console.log('No token to delete'));
                const newToken = await getToken(messaging, { vapidKey });
                return newToken;
            }
            throw error;
        });
        if (token) {
            if (typeof token !== 'string' || token.length < 50) {
                console.warn("Monitored token appears invalid");
                return null;
            }
        }
        return token;
    } catch (error) {
        console.error('Error monitoring FCM token:', error);
        return null;
    }
};

export { onMessage };