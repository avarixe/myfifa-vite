import gql from 'graphql-tag'

export const userFragment = gql`
  fragment UserData on User {
    id
    email
    username
    fullName
    darkMode
  }
`
