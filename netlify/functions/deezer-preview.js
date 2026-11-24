export default async (request) => {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const song = new URL(request.url).searchParams.get('song')?.trim()

  if (!song) {
    return Response.json({ error: 'Missing song parameter' }, { status: 400 })
  }

  const deezerUrl = new URL('https://api.deezer.com/search')
  deezerUrl.searchParams.set('q', song)
  deezerUrl.searchParams.set('limit', '1')

  let data
  try {
    const response = await fetch(deezerUrl)

    if (!response.ok) {
      return Response.json(
        { error: `Deezer request failed (${response.status})` },
        { status: 502 }
      )
    }

    data = await response.json()
  } catch (error) {
    console.error('Deezer lookup failed:', error)
    return Response.json({ error: 'Could not reach Deezer' }, { status: 502 })
  }

  const previewUrl = data.data?.[0]?.preview

  if (!previewUrl) {
    return Response.json({ error: `No preview found for "${song}"` }, { status: 404 })
  }

  return Response.json({ previewUrl })
}