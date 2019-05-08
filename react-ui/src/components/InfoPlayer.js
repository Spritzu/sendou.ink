import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Loader, Header, Image, Icon } from 'semantic-ui-react'

import { playerInfo } from '../graphql/queries/playerInfo'
import TopPlacementTable from '../components/TopPlacementsTable'
import WpnPlayedTable from '../components/WpnPlayedTable'
import MonthsTable from '../components/MonthsTable'

const InfoPlayer = ({ uid }) => {
  const { data, error, loading } = useQuery(playerInfo, {variables: { uid: uid }})
  const [top, setTop] = useState([])

  useEffect(() => {
    if (loading) {
      return
    }
    document.title = `${data.playerInfo.player.alias ? data.playerInfo.player.alias : data.playerInfo.player.name} Top 500 X Rank - sendou.ink`
    const placements = data.playerInfo.placements

    //reducing placements to top sz, tc etc. rank and x power
    const tops = ["", "szTop", "tcTop", "rmTop", "cbTop"]
    const exs = ["", "szX", "tcX", "rmX", "cbX"]
    setTop(placements.reduce((acc, cur) => {
      const topKey = tops[cur.mode]
      const xKey = exs[cur.mode]
      if (!acc[xKey]) {
        acc[xKey] = cur
        acc[topKey] = cur
        return acc
      } 
      if (acc[xKey].x_power < cur.x_power) {
        acc[xKey] = cur
      }
      if (acc[topKey].rank > cur.rank) {
        acc[topKey] = cur
      }

      return acc
    }, {
      szX: null, szTop: null, 
      tcX: null, tcTop: null, 
      rmX: null, rmTop: null, 
      cbX: null, cbTop: null
    }))

  }, [data, loading])

  if (loading || top.length === 0) {
    return <div style={{"paddingTop": "25px", "paddingBottom": "20000px"}} ><Loader active inline='centered' /></div>
  }
  if (error) {
    return <div style={{"color": "red"}}>{error.message}</div>
  }
  const playerData = data.playerInfo.player

  return (
    <div style={{"paddingTop": "20px"}}>
      <Header as='h2'>
        {playerData.twitter ? <Image circular src={`https://avatars.io/twitter/${playerData.twitter}`} /> : null} {playerData.alias ? playerData.alias : playerData.name} 
        {playerData.twitter ? <a href={`https://twitter.com/${playerData.twitter}`}><Icon style={{"paddingLeft": "5px"}} size='small' name="twitter"/></a> : null}
      </Header>
      <TopPlacementTable top={top} />
      <Header dividing style={{"paddingTop": "5px"}}>All Top 500 placements</Header>
      <MonthsTable placements={data.playerInfo.placements} />
      <Header dividing style={{"paddingTop": "5px"}}>Weapons reached Top 500 with</Header>
      <WpnPlayedTable weapons={playerData.weapons} />
    </div>
  )
}

export default InfoPlayer