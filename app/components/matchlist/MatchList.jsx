import { useEffect, useState } from "react";

export default function MatchList({ userId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const response = await fetch(`/api/match?userId=${userId}`);
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [userId]);

  if (loading) return <p>Loading matches...</p>;
  if (matches.length === 0) return <p>No compatible matches found.</p>;

  return (
    <div>
      <h2 className="page-heading">Top Matches</h2>
      <ul>
        {matches.map((match) => (
          <li key={match.user?.id}>
            <h3>{match.user?.name}</h3>
            <p>Compatibility Score: {match.score}</p>
            <p>Cleanliness: {match.user?.cleanliness}</p>
            <p>Noise Tolerance: {match.user?.noiseTolerance}</p>
            <p>Bedtime: {match.user?.bedtime}</p>
            <p>Social Preference: {match.user?.socialPreference}</p>
            <p>
              Budget Range: ₦{match.user?.budgetRange.min} - ₦
              {match.user?.budgetRange.max}
            </p>
            <p>Smoking: {match.user?.smoking ? "Yes" : "No"}</p>
            <p>Drinking: {match.user?.drinking ? "Yes" : "No"}</p>
            <p>Shared Interests: {match.user?.interests.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
