import React from "react"
import { useQuery } from "@apollo/react-hooks"

import Suggestions from "./Suggestions"
import Loading from "../common/Loading"
import Error from "../common/Error"
import { PLUS_INFO } from "../../graphql/queries/plusInfo"
import { USER } from "../../graphql/queries/user"
//import Voting from "./Voting"
import { Redirect, RouteComponentProps, Link } from "@reach/router"
import PageHeader from "../common/PageHeader"
import { FaHistory } from "react-icons/fa"
import Button from "../elements/Button"
import { Helmet } from "react-helmet-async"

interface PlusInfoData {
  plusInfo: {
    voting_ends?: String
    voter_count: number
    eligible_voters: number
  }
}

const PlusPage: React.FC<RouteComponentProps> = () => {
  const { data, error, loading } = useQuery<PlusInfoData>(PLUS_INFO)
  const {
    data: userData,
    error: userQueryError,
    loading: userQueryLoading,
  } = useQuery(USER)

  if (error) return <Error errorMessage={error.message} />
  if (loading || userQueryLoading || !data) return <Loading />
  if (userQueryError) return <Error errorMessage={userQueryError.message} />
  if (!userData.user) return <Redirect to="/access" />
  if (!data.plusInfo) return <Redirect to="/404" />

  return (
    <>
      <Helmet>
        <title>Plus Server Home | sendou.ink</title>
      </Helmet>
      <PageHeader title="Plus Server" />
      {/*data.plusInfo.voting_ends && userData.user.plus?.membership_status ? (
        <Voting
          user={userData.user}
          handleSuccess={handleSuccess}
          handleError={handleError}
          votedSoFar={data.plusInfo.voter_count}
          eligibleVoters={data.plusInfo.eligible_voters}
          votingEnds={
            data.plusInfo.voting_ends
              ? parseInt(data.plusInfo.voting_ends)
              : null
          }
        />
      ) : (
        <Suggestions
          user={userData.user}
          plusServer={userData.user?.plus?.membership_status}
          showSuggestionForm={showSuggestionForm}
          setShowSuggestionForm={setShowSuggestionForm}
          handleSuccess={handleSuccess}
          handleError={handleError}
        />
      )*/}
      <Link to="/plus/history">
        <Button outlined icon={FaHistory}>
          Show voting history
        </Button>
      </Link>
      <Suggestions user={userData.user} />
    </>
  )
}

export default PlusPage
