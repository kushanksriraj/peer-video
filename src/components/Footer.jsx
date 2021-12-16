import styled from "styled-components";

const Wrapper = styled.div`
  color: var(--primary);
  padding-top: 0.5rem;
  text-align: center;
  font-weight: bold;
  height: 50px;
`;

const Link = styled.a`
  color: #3f3fe7;
  text-decoration: none;
`;

export const Footer = () => {
  return (
    <Wrapper>
      <pre>
        &lt;/&gt; with 💛 by{" "}
        <Link href="https://linktr.ee/kushank" target="_blank">
          Kushank
        </Link>
      </pre>
    </Wrapper>
  );
};
