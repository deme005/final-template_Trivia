export async function fetchQuestions(amount, category) {
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=multiple`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Server returned status code: ${response.status}`);
  }
  const data = await response.json();
  if (data.response_code !== 0) {
    throw new Error(
      "Could not find enough trivia questions for this specific combination.",
    );
  }
  return data.results;
}
