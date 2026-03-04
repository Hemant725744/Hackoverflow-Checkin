import { getParticipantByIdAction } from "@/actions/participants";
import { MEAL_LABELS } from "@/lib/constants"; 

// Update interface to support Next.js 15 async params safely
interface PageProps {
  params: Promise<{ participantId: string }> | { participantId: string };
}

export default async function FoodPage({ params }: PageProps) {
  // Safely resolve params (handles both older and newer Next.js versions)
  const resolvedParams = await params;
  const participantId = resolvedParams.participantId;

  // Fetch participant data
  const result = await getParticipantByIdAction(participantId);

  // INSTEAD of notFound() which causes a 404, let's print the actual error to the screen!
  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-red-500 text-2xl font-bold mb-4">Error Loading Data</h1>
        <p>Participant ID: {participantId}</p>
        <p className="bg-red-500/10 p-4 rounded mt-4 font-mono text-sm border border-red-500/20">
          {JSON.stringify(result, null, 2)}
        </p>
      </div>
    );
  }

  const participant = result.data;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Food & <span className="text-[#FCB216]">Meals</span>
        </h1>
        <p className="text-gray-400 text-sm">
          Track your meal passes and current food eligibility for Hackoverflow 4.0.
        </p>
      </div>

      {/* Main Grid for Meal Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(MEAL_LABELS).map(([mealKey, label]) => {
          
          const typedMealKey = mealKey as keyof typeof MEAL_LABELS;
          
          // @ts-ignore - Temporarily ignore the red line until your types compile properly
          const isAvailed = participant.mealStatus?.[typedMealKey]?.status || false;

          return (
            <div 
              key={mealKey} 
              className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 ${
                isAvailed 
                  ? "bg-[#1A1A1A] border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
                  : "bg-[#111111] border-white/10 hover:border-white/20"
              }`}
            >
              {isAvailed && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${isAvailed ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-400'}`}>
                    🍔 
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{label.split('-')[0].trim()}</h3>
                    <p className="text-sm text-gray-400">{label.split('-')[1]?.trim() || 'Meal'}</p>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isAvailed 
                    ? "bg-green-500/20 text-green-400 border border-green-500/20" 
                    : "bg-white/5 text-gray-400 border border-white/10"
                }`}>
                  {isAvailed ? "Consumed" : "Available"}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {isAvailed ? "Already scanned at counter" : "Present QR at food desk"}
                </span>
                
                {!isAvailed && (
                  <button className="px-4 py-2 bg-[#FCB216]/10 text-[#FCB216] hover:bg-[#FCB216]/20 transition-colors rounded-lg text-sm font-medium border border-[#FCB216]/20">
                    Show QR
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}