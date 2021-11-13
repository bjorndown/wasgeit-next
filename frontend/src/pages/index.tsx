import { format } from 'date-fns'
import React from 'react'

export default () => <h1>redirecting</h1>

export async function getServerSideProps() {
  return {
    redirect: {
      destination: `/week/${format(new Date(), 'yyyy-II')}`,
      permanent: false,
    },
  }
}
