import { Button } from '@chakra-ui/react';
import { useContext, useEffect } from "react";
import { Can } from "../components/Can";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";



export default function Dashboard() {
  const { user, signOut, isAuthenticated } = useContext(AuthContext)



  useEffect(() => {
    api.get('/me')
      .then(response => console.log(response))
      .catch(err => console.log(err))

  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>Dashboard: {user?.email}</h1>

        <Button colorScheme='teal' variant='outline' onClick={signOut}>Sign Out</Button>

        <Can permissions={['metrics.list']}>
          <div>Métricas</div>
        </Can>
      </div>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me')

  console.log(response.data)

  return {
    props: {}
  }
})
