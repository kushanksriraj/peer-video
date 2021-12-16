import styled from "styled-components";

const Wrapper = styled.div`
  color: var(--primary);
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  height: 60px
`;

export const Heading = () => {
  return <Wrapper>Video Chat 📽</Wrapper>;
};
