import { getMessaging, getToken } from "firebase/messaging";

/**
 * Requests notification permission and retrieves the FCM registration token.
 * @returns {Promise<string|null>} The FCM token if successful, otherwise null.
 */
export const getFCMToken = async () => {
  try {
    const messaging = getMessaging();
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
      const currentToken = await getToken(messaging, {
        vapidKey:
          "BH9_Twk9MF1rCGz9whDcYM5cGTROTWm1KAUxqEeiekd-4t7Z-omp49J6F6Zr4cB6jjXrGKVqtgV0npGPgyfqyxc",
      });

      if (currentToken) {
        console.log("FCM Token retrieved:", currentToken);
        return currentToken;
      } else {
        console.log("No registration token available.");
        return null;
      }
    } else {
      console.log("Unable to get permission to notify.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token: ", error);
    return null;
  }
};
