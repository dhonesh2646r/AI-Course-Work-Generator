from google import genai
from google.genai import types
import httpx

client = genai.Client(api_key="GEMINI_API_KEY")

doc_url = "https://alex.smola.org/drafts/thebook.pdf"  # Replace with the actual URL of your PDF

# Retrieve and encode the PDF byte
doc_data = httpx.get(doc_url).content

prompt = "create 10 flash cards for important concepts in this document for last minute revision.give flahcards contents in python list format [dict(),] where each element is a flashcard content in string format do not give any comments in the list. the flashcard should have question and answer in the front and back of the card respectively. The list must be a contionous string for indents and new lines it can be mentioned in the string itself like back slash n."
response = client.models.generate_content(
  model="gemini-2.0-flash",
  contents=[
      types.Part.from_bytes(
        data=doc_data,
        mime_type='application/pdf',
      ),
      prompt])


response_text = response.text.replace("```python", "").replace("```","").strip()

print(eval(response_text))