import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: calc(100% - 0.5rem);
  border: 1px solid var(--primary);
  border-radius: 2px;
  padding: 0.5rem 0.25rem;
  margin: 0.25rem;
`;

const Button = styled.button`
  border: none;
  border-radius: 2px;
  font-size: 10px;
  font-weight: bold;
  display: inline-block;
  width: 95px;
  height: 25px;
  cursor: pointer;
  background-color: var(--primary);
  color: white;
  margin: 0.25rem;
`;

const ControlWrapper = styled.div`
  display: flex;
  margin-bottom: 0.25rem;
`;

const Label = styled.label`
  font-size: 12px;
  display: inline-block;
  padding-right: 0.5rem;
  cursor: pointer;
`;

const Select = styled.select`
  margin-left: 0.5rem;
  cursor: pointer;
`;

const SelectorWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const Settings = () => {
  return (
    <Wrapper>
      <ControlWrapper>
        <Button>Start Translation</Button>
      </ControlWrapper>

      <SelectorWrapper>
        <Label htmlFor="select-camera">
          Camera:
          <Select id="select-camera"></Select>
        </Label>
        <Label htmlFor="select-mic">
          Mic:
          <Select id="select-mic"></Select>
        </Label>
      </SelectorWrapper>
    </Wrapper>
  );
};
