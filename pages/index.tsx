import type { GetServerSideProps } from "next";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import styles from "../styles/Home.module.css";
import { parseCookies } from "nookies";



export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // console.log(ctx.req.cookies)
  const cookies = parseCookies(ctx) //passar o primeiro parametro o contexto

  if (cookies['nextauth.token']) {
    return {
      redirect: {
        destination: 'dashboard',
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}
