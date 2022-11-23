import { gql } from '@urql/core'

export const userFragment = gql`
  fragment UserData on User {
    id
    email
    username
    fullName
    darkMode
  }
`
