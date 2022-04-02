import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';

let cookies = parseCookies()
let isRefreshing = false
let failedRequestQueue = []

export const api = axios.create(
  {
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`
    }
  })

api.interceptors.response.use(response => {
  return response
}, (error: AxiosError) => {
  if (error.response.status === 401) {
    if (error.response.data?.code === 'token.expired') {
      cookies = parseCookies()

      console.log(cookies, 'cookies')

      const { 'nextauth.refreshToken': refreshToken } = cookies

      console.log(refreshToken, 'refreshTokencookies')


      const originalConfig = error.config //requisicoes do backend (Rota, Parametros, callback, etc)

      console.log(isRefreshing)
      if (!isRefreshing) {

        isRefreshing = true
        console.log(refreshToken, 'refreshToken'),

          api.post('/refresh', {
            refreshToken,
          }).then(response => {
            const { token } = response.data

            setCookie(undefined, 'nextauth.token', token, {
              maxAge: 60 * 60 * 24 * 30, // 30 dias
              path: '/'
            })
            setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30, // 30 dias
              path: '/'
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            failedRequestQueue.forEach(request => request.onSuccess(token))
            failedRequestQueue = []
          }).catch(err => {
            failedRequestQueue.forEach(request => request.onFailure(err))
            failedRequestQueue = []
          }).finally(() => {
            isRefreshing = false
          })
      }

      return new Promise((resolve, reject) => { //unica forma do axios retornar uma promise para aguardar q seja executado
        failedRequestQueue.push({

          onSuccess: (token: string) => {
            originalConfig.headers['Authorization'] = `Bearer ${token}`

            resolve(api(originalConfig))
          },
          onFailure: (err: AxiosError) => {
            reject(err)
          }
        })
      })
    } else {
      signOut()
    }
  }

  return Promise.reject(error)
})
