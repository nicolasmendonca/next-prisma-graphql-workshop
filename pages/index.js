import useSWR from 'swr'

const fetcher = (query) =>
  fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data)

export default function Index() {
  const { data, error } = useSWR(`query pokemonList {
  pokemonList{
    id
    name
    attacks {
      id
      name
      damage
    }
  }
}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      {JSON.stringify(data.pokemonList)}
    </div>
  )
}
