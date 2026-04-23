import TrackBusWrapper from './TrackBusWrapper'

export default async function TrackPage(props: { params: Promise<{ tripId: string }> }) {
  const params = await props.params;
  return <TrackBusWrapper tripId={params.tripId} />
}
