import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Metrics() {

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>Metrtics</h1>
      </div>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me')


  return {
    props: {}
  }
}, {
  permissions: ['metrics.list3'],
  roles: ['administrator']
})
