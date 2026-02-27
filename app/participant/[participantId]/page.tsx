import { redirect } from 'next/navigation';

interface Props {
    params: Promise<{ participantId: string }>;
}

export default async function ParticipantPage({ params }: Props) {
    const { participantId } = await params;
    redirect(`/participant/${participantId}/login`);
}
