import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  border: 1px solid black;
  width: 50vw;
  max-width: 300px;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 2px;
  position: relative;
`;

const TextField = styled.input`
  border: none;
  display: inline-block;
  width: 100%;
  font-size: 12px;
  padding: 2px 4px;
`;

const Button = styled.button`
  background-color: var(--primary);
  border: none;
  color: white;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  width: 20px;
  cursor: pointer;
`;

const state = [
  {
    text: "Hello 👋👋",
    translation: "Heyaaa 👋👋",
  },
  {
    text: "There",
    translation: "Eto",
  },
  {
    text: "Me",
    translation: "Mya",
  },
  {
    text: "Just text",
  },
];

const ScrollArea = styled.div`
  border: 1px solid red;
  height: 25vh;
  max-height: 400px;
  position: absolute;
  width: 170px;
  bottom: 30px;

  -ms-overflow-style: none;
  scrollbar-width: none;

  overflow-y: scroll;
`;

const Bubble = styled.div`
  background-color: white;
  margin: 0.5rem;
  margin-left: 0.25rem;
  border-radius: 2px;
  padding: 0.25rem;
`;

// if translation is present then gray out the text

const Text = styled.div`
  font-size: 12px;
`;

const Translation = styled.div`
  font-size: 12px;
`;

export const Chat = () => {
  const lastRef = useRef(null);

  const [messageList, setState] = useState(state);

  useEffect(() => {
    if (lastRef.current) {
      lastRef.current.scrollIntoView();
    }
  }, [messageList]);

  const renderBubbles = () => {
    const list = [];

    messageList.forEach((message, index) => {
      if (index !== messageList.length - 1) {
        list.push(
          <Bubble>
            {message?.translation && (
              <Translation>{message.translation}</Translation>
            )}
            <Text>{message.text}</Text>
          </Bubble>
        );
      }
    });

    const last = messageList[messageList.length - 1];

    list.push(
      <Bubble ref={lastRef}>
        {last?.translation && <Translation>{last.translation}</Translation>}
        <Text>{last.text}</Text>
      </Bubble>
    );
    return list;
  };

  return (
    <Wrapper>
      <ScrollArea className="scroll-hide">{renderBubbles()}</ScrollArea>
      <TextField type="text" />
      <Button
        onClick={() =>
          setState((prev) => [
            ...prev,
            {
              text: "New one!!",
              translation: "Nya une",
            },
          ])
        }
      >
        &gt;
      </Button>
    </Wrapper>
  );
};
