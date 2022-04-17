import type { GetServerSideProps } from "next";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import styles from "../styles/Home.module.css";
import { parseCookies } from "nookies";
import { withSSRGuest } from "../utils/withSSRGuest";


export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form onSubmit={handleSubmit} className="bg-gray-light dark:bg-slate-900 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
        <input className="bg-yellow-100 dark:bg-slate-900 rounded-lg px-6 py-58 ring-1 ring-slate-900/5 shadow-xl"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input className="bg-yellow-100 dark:bg-slate-900 rounded-lg px-6 py-58 ring-1 ring-slate-900/5 shadow-xl"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-white dark:bg-slate-900 rounded-lg px-6 py-58 ring-1 ring-slate-900/5 shadow-xl">Entrar</button>
      </form>
    </div>
  );
}

export const getServerSideProps = withSSRGuest(
  async (ctx) => {
    console.log(ctx.req.cookies)

    return {
      props: {},
    };
  }
);
