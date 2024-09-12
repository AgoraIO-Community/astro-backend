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
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { astrobackend } from "../proto/definition";

function Transcriptions({ transcriptions }: { transcriptions: string[] }) {
  return (
    <div className="fixed z-10 top-0 right-0 w-1/4 h-full bg-white bg-opacity-75 overflow-y-auto p-4">
      <h2 className="text-lg font-bold mb-2">Transcriptions</h2>
      {transcriptions.map((text, index) => (
        <p key={index} className="mb-2">
          {text}
        </p>
      ))}
    </div>
  );
}

type RecordingInfo = {
  uid: string;
  channel: string;
  sid: string;
  resourceId: string;
};

type TranscriptionInfo = {
  taskId: string;
  builderToken: string;
};

function Call(props: {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
}) {
  const client = useMemo(
    () => AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }),
    []
  );

  const [isRecording, setIsRecording] = useState(false);
  const [recordingInfo, setRecordingInfo] = useState<RecordingInfo | null>(
    null
  );
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionInfo, setTranscriptionInfo] =
    useState<TranscriptionInfo | null>(null);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);

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

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTranscribing) {
      timer = setInterval(checkTranscriptionStatus, 10000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [isTranscribing]);

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

  const checkTranscriptionStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/transcription/query.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: transcriptionInfo!.taskId,
          builderToken: transcriptionInfo!.builderToken,
        }),
      });

      if (!response.ok) {
        setIsTranscribing(false);
        setTranscriptionInfo(null);
      } else {
        console.log("Transcription found and running");
      }
    } catch (error) {
      console.error("Error checking transcription status:", error);
    }
  }, [transcriptionInfo, setIsTranscribing]);

  const toggleTranscription = async () => {
    if (isTranscribing) {
      try {
        const response = await fetch("/api/transcription/stop.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transcriptionInfo),
        });
        if (response.ok) {
          setIsTranscribing(false);
          setTranscriptionInfo(null);
          console.log("Transcription stopped");
        } else {
          console.error("Failed to stop transcription");
        }
      } catch (error) {
        console.error("Error stopping transcription:", error);
      }
    } else {
      try {
        const response = await fetch("/api/transcription/start.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: props.channelName,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setTranscriptionInfo(data);
          setIsTranscribing(true);
          console.log("Transcription started");
        } else {
          console.error("Failed to start transcription");
        }
      } catch (error) {
        console.error("Error starting transcription:", error);
      }
    }
  };

  return (
    <AgoraRTCProvider client={client}>
      <Videos
        channelName={props.channelName}
        AppID={props.appId}
        token={props.token}
        uid={props.uid}
        setTranscriptions={setTranscriptions}
      />
      <Transcriptions transcriptions={transcriptions} />
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
        {isTranscribing ? (
          <div
            className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 w-40"
            onClick={toggleTranscription}
          >
            Stop Transcription
          </div>
        ) : (
          <div
            className="px-5 py-3 text-base font-medium text-center text-white bg-green-400 rounded-lg hover:bg-green-500 w-40"
            onClick={toggleTranscription}
          >
            Start Transcription
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
  uid: number;
  setTranscriptions: Dispatch<SetStateAction<string[]>>;
}) {
  const { AppID, channelName, token, uid, setTranscriptions } = props;

  const client = useRTCClient();

  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();

  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: token,
    uid: uid,
  });

  useClientEvent(client, "stream-message", (_, msg) => {
    try {
      const decodedMsg = astrobackend.Text.deserializeBinary(msg);

      const { words } = decodedMsg;

      if (words && words.length > 0) {
        let isFinal = false;
        let text = "";
        words.forEach((item: any) => {
          if (item.is_final) {
            setTranscriptions((prev) => [...prev, `${uid}: ${text}`]);
            isFinal = true;
          }
          text += item?.text || "";
        });
      }
    } catch (error) {
      console.error("Error decoding stream message:", error);
    }
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
