import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

export function withSSRAuth<P>(fn: GetServerSideProps<P>) {
  //high order function (deve retornar uma função)
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx) //passar o primeiro parametro o contexto

    if (!cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    try {
      return await fn(ctx)
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'nextauth.token')
        destroyCookie(ctx, 'nextauthRefresh.token')

        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }
  }
}
