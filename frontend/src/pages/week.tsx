import React from 'react'
import { format } from 'date-fns'

export default () => <h1>redirecting</h1>

export async function getServerSideProps() {
  return {
    redirect: {
      destination: `/week/${format(new Date(), 'II')}`,
      permanent: false,
    },
  }
}
