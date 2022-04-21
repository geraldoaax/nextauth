import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";
import { useCan } from "../hooks/useCan";


export default function Dashboard() {
  const { user } = useContext(AuthContext)

  const userCanSeeMetrics = useCan({
    roles: ['administrator', 'editor']
  })


  useEffect(() => {
    api.get('/me')
      .then(response => console.log(response))
      .catch(err => console.log(err))

  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>Dashboard: {user?.email}</h1>
        {userCanSeeMetrics && <div>Métricas</div>}
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
