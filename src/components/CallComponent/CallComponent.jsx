import styled, { css } from "styled-components";
import { usePeer } from "../../context/Context";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--primary);
  border-radius: 2px;
  margin: auto;
  padding: 0.5rem;
  padding-bottom: 1.75rem;
  width: 70%;
  max-width: 400px;
  height: 40%;
  max-height: 300px;
  position: relative;
  background-color: white;
  z-index: 200;
  top: 20vh;
`;

const FieldWrapper = styled.div`
  margin: 1rem 0;
`;

const TextField = styled.input`
  border-radius: 2px;
  border-width: 1px;
  display: inline-block;
  width: 110px;
  margin-right: 0.5rem;
  font-size: 12px;
  padding: 2px 4px;
  height: 22px;
`;

const Label = styled.label`
  font-size: 12px;
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
`;

const Button = styled.button`
  background-color: var(--primary);
  border: none;
  color: white;
  border-radius: 2px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  width: 60px;
  height: 22px;
  cursor: pointer;
  ${(props) =>
    props.disabled &&
    css`
      background-color: gray;
    `}
`;

const ClearBtn = styled(Button)`
  position: absolute;
  bottom: 0.25rem;
  right: 0.25rem;
  color: red;
  font-size: 10px;
  width: 45px;
  height: 20px;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
`;

export const CallComponent = () => {
  const {
    username,
    setUsername,
    callOnClick,
    roomId,
    setRoomId,
    joinRoom,
    isJoinedRoom,
  } = usePeer();

  const updateUsername = (e) => setUsername(e.target.value);
  const updateRoomId = (e) => setRoomId(e.target.value);

  return (
    <Wrapper>
      <FieldWrapper>
        <Label htmlFor="room">Room ID:</Label>
        <Form onSubmit={joinRoom}>
          <TextField
            type="text"
            id="room"
            value={roomId}
            onChange={updateRoomId}
            disabled={isJoinedRoom}
          />
          <Button type="submit" disabled={isJoinedRoom}>
            {isJoinedRoom ? "Joined" : "Join"}
          </Button>
        </Form>
      </FieldWrapper>
      <FieldWrapper>
        <Label htmlFor="name">Your name:</Label>
        <Form onSubmit={callOnClick}>
          <TextField
            type="text"
            id="name"
            value={username}
            onChange={updateUsername}
            disabled={!isJoinedRoom}
            title={!isJoinedRoom ? "Join room to call" : ""}
            placeholder={!isJoinedRoom ? "Join a room first" : ""}
          />
          <Button
            type="submit"
            disabled={!isJoinedRoom}
            title={!isJoinedRoom ? "Join room to call" : ""}
          >
            Call
          </Button>
        </Form>
      </FieldWrapper>
      <ClearBtn onClick={() => window.location.reload()}>Reset</ClearBtn>
    </Wrapper>
  );
};
