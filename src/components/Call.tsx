import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useClientEvent,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteUsers,
} from "agora-rtc-react";
import { useCallback, useEffect, useState } from "react";

type RecordingInfo = {
  uid: string;
  channel: string;
  sid: string;
  resourceId: string;
};

function Call(props: {
  appId: string;
  channelName: string;
  token: string;
  uid: string;
}) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  const [isRecording, setIsRecording] = useState(false);
  const [recordingInfo, setRecordingInfo] = useState<RecordingInfo | null>(
    null
  );

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRecording) {
      timer = setInterval(checkRecordingStatus, 10000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [isRecording]);

  const checkRecordingStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/recording/query.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sid: recordingInfo!.sid,
          resourceId: recordingInfo!.resourceId,
        }),
      });

      if (!response.ok) {
        setIsRecording(false);
        setRecordingInfo(null);
      } else {
        console.log("Recording found and running");
      }
    } catch (error) {
      console.error("Error checking recording status:", error);
    }
  }, [recordingInfo, setIsRecording]);

  return (
    <AgoraRTCProvider client={client}>
      <Videos
        channelName={props.channelName}
        AppID={props.appId}
        token={props.token}
        uid={props.uid}
      />
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4 space-x-4">
        <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 w-40"
          href="/"
        >
          End Call
        </a>
        {isRecording ? (
          <div
            className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500  w-40"
            onClick={async () => {
              try {
                const response = await fetch("/api/recording/stop.json", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    uid: recordingInfo!.uid,
                    channel: recordingInfo!.channel,
                    sid: recordingInfo!.sid,
                    resourceId: recordingInfo!.resourceId,
                  }),
                });
                if (response.ok) {
                  console.log(recordingInfo);
                  setRecordingInfo(null);
                  setIsRecording(false);
                  console.log("Recording stopped");
                } else {
                  console.error("Failed to stop recording");
                }
              } catch (error) {
                console.error("Error stopping recording:", error);
              }
            }}
          >
            Stop Recording
          </div>
        ) : (
          <div
            className="px-5 py-3 text-base font-medium text-center text-white bg-green-400 rounded-lg hover:bg-green-500  w-40"
            onClick={async () => {
              try {
                const response = await fetch("/api/recording/start.json", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    uid: "2",
                    channel: props.channelName,
                  }),
                });

                if (response.ok) {
                  const data = await response.json();
                  const recordingInfo = {
                    uid: "2",
                    channel: props.channelName,
                    sid: data.sid,
                    resourceId: data.resourceId,
                  };
                  setRecordingInfo(recordingInfo);
                  setIsRecording(true);
                  console.log("Recording started");
                  console.log(recordingInfo);
                } else {
                  console.error("Failed to start recording");
                }
              } catch (error) {
                console.error("Error starting recording:", error);
              }
            }}
          >
            Start Recording
          </div>
        )}
      </div>
    </AgoraRTCProvider>
  );
}

function Videos(props: {
  channelName: string;
  AppID: string;
  token: string;
  uid: string;
}) {
  const { AppID, channelName, token, uid } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const client = useRTCClient();

  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: token,
    uid: uid,
  });

  useClientEvent(client, "token-privilege-will-expire", async () => {
    try {
      const response = await fetch("/api/token.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          uid: uid,
          channel: channelName,
          role: "publisher",
          expireTime: 3600,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        client.renewToken(data.token);
      } else {
        console.error("Failed to update token");
      }
    } catch (error) {
      console.error("Error updating token:", error);
    }
  });

  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading)
    return (
      <div className="flex flex-col items-center pt-40">Loading devices...</div>
    );

  return (
    <div className="flex flex-col justify-between w-full h-screen">
      <div
        className={`grid gap-1 flex-1 ${
          remoteUsers.length > 9
            ? `grid-cols-4`
            : remoteUsers.length > 4
            ? `grid-cols-3`
            : remoteUsers.length >= 1
            ? `grid-cols-2`
            : `grid-cols-1`
        }`}
      >
        <LocalVideoTrack
          key={uid}
          track={localCameraTrack}
          play={true}
          className="w-full h-full"
        />
        {remoteUsers.map((user) => (
          <RemoteUser key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Call;
