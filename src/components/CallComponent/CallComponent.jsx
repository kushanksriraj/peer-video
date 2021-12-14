import styled from "styled-components";
import { usePeer } from "../../context/Context";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextField = styled.input`
  border-radius: 2px;
  border-width: 1px;
  display: inline-block;
  width: 110px;
  margin: 0 0.5rem;
  font-size: 12px;
  padding: 2px 4px;
`;

const Label = styled.label`
  font-size: smaller;
`;

const Button = styled.button`
  background-color: var(--primary);
  border: none;
  color: white;
  border-radius: 2px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  width: 50px;
  height: 20px;
  cursor: pointer;
`;

export const CallComponent = () => {
  const { username, setUsername, callOnClick } = usePeer();

  const updateUsername = (e) => setUsername(e.target.value);

  return (
    <Wrapper>
      <Label htmlFor="name">Enter name:</Label>
      <TextField
        type="text"
        id="name"
        value={username}
        onChange={updateUsername}
      />
      <Button onClick={callOnClick}>Call 📞</Button>
    </Wrapper>
  );
};
