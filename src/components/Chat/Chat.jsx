import { useEffect, useRef } from "react";
import styled from "styled-components";
import { usePeer } from "../../context/Context";

const Wrapper = styled.div`
  border: 1px solid black;
  width: 60vw;
  max-width: 400px;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 2px;
  position: relative;
`;

const TextField = styled.input`
  border: none;
  display: block;
  font-size: 1rem;
  padding: 2px 4px;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  background-color: var(--primary);
  border: none;
  color: white;
  font-size: 20px;
  font-weight: bold;
  display: block;
  width: 2.5rem;
  height: 2rem;
  cursor: pointer;
`;

const ScrollArea = styled.div`
  height: fit-content;
  max-height: 140px;
  position: absolute;
  width: fit-content;
  bottom: 40px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: scroll;
`;

const Bubble = styled.div`
  background-color: white;
  margin: 0.5rem;
  margin-left: 0.25rem;
  border-radius: 2px;
  padding: 4px 6px;
  width: fit-content;
`;

const Text = styled.div`
  margin-top: -2px;
  font-size: ${(props) => (props.isTranslation ? "12px" : "14px")};
  color: ${(props) => (props.isTranslation ? "#626262" : "black")};
`;

const Translation = styled.div`
  font-size: 12px;
`;

const Form = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 2rem;
`;

export const Chat = () => {
  const lastRef = useRef(null);

  const { messageList, sendMsg, message, updateMessage, isTyping } = usePeer();

  useEffect(() => {
    if (isTyping) {
      document.querySelector("#typing").scrollIntoView();
    }
  }, [isTyping]);

  useEffect(() => {
    if (lastRef.current) {
      lastRef.current.scrollIntoView();
    }
  }, [messageList]);

  const renderBubbles = () => {
    const list = [];

    messageList.forEach((message, index) => {
      if (index !== messageList.length - 1) {
        const isTranslation = message?.translation;
        list.push(
          <Bubble key={message.timeStamp}>
            {isTranslation && <Translation>{message.translation}</Translation>}
            <Text isTranslation={isTranslation}>{message.text}</Text>
          </Bubble>
        );
      }
    });

    const last = messageList[messageList.length - 1];
    const isTranslation = last?.translation;

    last &&
      list.push(
        <Bubble ref={lastRef} key={last.timeStamp}>
          {isTranslation && <Translation>{last.translation}</Translation>}
          <Text isTranslation={isTranslation}>{last.text}</Text>
        </Bubble>
      );

    if (isTyping) {
      list.push(
        <Bubble key="TYPING" id="typing">
          <Text>Typing...</Text>
        </Bubble>
      );
    }

    return list;
  };

  return (
    <Wrapper>
      <ScrollArea className="scroll-hide">{renderBubbles()}</ScrollArea>
      <Form onSubmit={sendMsg}>
        <TextField type="text" value={message} onChange={updateMessage} />
        <Button type="submit">&gt;</Button>
      </Form>
    </Wrapper>
  );
};
