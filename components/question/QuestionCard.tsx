/**
 * The output of every scenario screen — PRD.md §2.1. Converts a
 * confrontation into a conversation: what to do, then what to ask.
 */
export function QuestionCard({ nextAction, questionToAsk }: { nextAction: string; questionToAsk: string }) {
  return (
    <div className="border-2 border-ink rounded-lg p-4 sm:p-6 space-y-4">
      <div>
        <h3 className="text-caption font-bold uppercase tracking-wide text-ink/70">Yang bisa dilakukan sekarang</h3>
        <p className="text-body-lg mt-1">{nextAction}</p>
      </div>
      <div>
        <h3 className="text-caption font-bold uppercase tracking-wide text-ink/70">Pertanyaan untuk petugas</h3>
        <p className="text-key font-medium mt-1">{questionToAsk}</p>
      </div>
    </div>
  );
}
