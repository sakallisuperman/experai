interface ResultCardProps {
  suggestedPrice?: string;
  marketAverage?: string;
  riskLevel?: string;
  profitRange?: string;
}

export default function ResultCard({ suggestedPrice, marketAverage, riskLevel, profitRange }: ResultCardProps) {
  if (!suggestedPrice) return null;

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-6 space-y-3">
      <h3 className="text-xl font-semibold text-gray-800">Analysis Result</h3>
      <div className="space-y-1">
        <p>💰 Suggested Price: <span className="font-bold">{suggestedPrice}</span></p>
        <p>📈 Market Average: <span className="font-bold">{marketAverage}</span></p>
        <p>⚠️ Risk Level: <span className="font-bold">{riskLevel}</span></p>
        <p>✅ Profit Range: <span className="font-bold">{profitRange}</span></p>
      </div>
    </div>
  );
}
