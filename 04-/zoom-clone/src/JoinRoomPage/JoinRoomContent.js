import React, { useState } from "react";
import { connect } from "react-redux";
import {
  setConnectOnlyWithAudio,
  setIdentity,
  setRoomId,
} from "../store/actions";
import JoinRoomInputs from "./JoinRoomInputs";
import OnlyWithAudioCheckbox from "./OnlyWithAudioCheckbox";
import RoomNotFoundMessage from "./RoomNotFoundMessage";
import JoinRoomButtons from "./JoinRoomButtons";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { checkIfRoomExists } from "../utils/twilioUtils";

const JoinRoomContent = (props) => {
  // 'props' are the common inputs to these hooks

  //
  const {
    isRoomHost,
    setConnectOnlyWithAudioAction,
    connectOnlyWithAudio,
    setRoomIdAction,
    setIdentityAction,
    setShowLoadingOverlay,
  } = props;

  const [roomIdValue, setRoomIdValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [showRoomNotFoundMessage, setShowRoomNotFoundMessage] = useState(false); // default initial value

  const history = useHistory();

  const handleJoinToRoom = async () => {
    // logic to join the room
    setIdentityAction(nameValue);
    if (!isRoomHost) {
      setShowLoadingOverlay(true);
      // check if room exists: yes: join
      const roomExists = await checkIfRoomExists(roomIdValue);
      // after response arrives
      setShowLoadingOverlay(false);

      if (roomExists) {
        console.log(roomIdValue);
        setRoomIdAction(roomIdValue);
        history.push("/room");
      } else {
        setShowRoomNotFoundMessage(true);
      }
    } else {
      setRoomIdAction(uuidv4()); //this sets a random ID to the room
      history.push("/room");
    }
  };

  //
  return (
    <>
      <JoinRoomInputs
        roomIdValue={roomIdValue}
        setRoomIdValue={setRoomIdValue}
        nameValue={nameValue}
        setNameValue={setNameValue}
        isRoomHost={isRoomHost}
      />
      <OnlyWithAudioCheckbox
        setConnectOnlyWithAudio={setConnectOnlyWithAudioAction}
        connectOnlyWithAudio={connectOnlyWithAudio}
      />
      <RoomNotFoundMessage showRoomNotFoundMessage={showRoomNotFoundMessage} />
      <JoinRoomButtons
        isRoomHost={isRoomHost}
        handleJoinToRoom={handleJoinToRoom}
      />
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setConnectOnlyWithAudioAction: (onlyWithAudio) =>
      dispatch(setConnectOnlyWithAudio(onlyWithAudio)),
    setIdentityAction: (identity) => dispatch(setIdentity(identity)),
    setRoomIdAction: (id) => dispatch(setRoomId(id)),
  };
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(
  mapStoreStateToProps,
  mapDispatchToProps
)(JoinRoomContent);
