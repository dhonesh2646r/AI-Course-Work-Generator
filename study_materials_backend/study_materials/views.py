from rest_framework import viewsets
from .models import Topic, StudyMaterial
from .serializers import TopicSerializer, StudyMaterialSerializer

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

class StudyMaterialViewSet(viewsets.ModelViewSet):
    queryset = StudyMaterial.objects.all()
    serializer_class = StudyMaterialSerializer

import logging
import os
import httpx
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from google import genai
from google.genai import types
from pydantic import BaseModel

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def generate_res(contents):
    try:
        client = genai.Client(api_key="GEMINI_API_KEY")
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=contents,
        )
        print(response.text)
        result=response.text.replace("flashcards =",'').replace("```python", "").replace("```","").strip()
        res=eval(result)
        return res
    except Exception as e:
        return generate_res(contents)


@api_view(['POST'])
def generate_flash_cards(request):
    topic = request.data.get('topic')
    question_type = request.data.get('question_type')
    file = request.FILES.get('file')
    no_of_questions = request.data.get('no_of_questions')
    
    if not topic and not file:
        return Response({'error': 'Either a topic or a file is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not question_type or not no_of_questions:
        return Response({'error': 'Question type and number of questions are required.'}, status=status.HTTP_400_BAD_REQUEST)

    client = genai.Client(api_key="GEMINI_API_KEY")
    try:
        doc_data = None
        if file:
            file_extension = file.name.split('.')[-1].lower()
            if file_extension == 'pdf':
                mime_type = 'application/pdf'
            elif file_extension in ['doc', 'docx']:
                mime_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            else:
                return Response({'error': 'Unsupported file format. Use PDF or DOCX.'}, status=status.HTTP_400_BAD_REQUEST)

            doc_data = file.read()

        prompt = (
            "Generate flashcards for all {no_of_questions} important {question_type} in each concept or unit from this document.\n\n"+"Formatting:\n"+"- Each flashcard should be a dictionary inside a Python list.\n"+"- The format should be: [dict(front: ..., back: ...), dict(front: ..., back: ...), ...]\n"+"- No extra comments or explanations—only the list as output.\n"+"- Use \\n to represent new lines within strings.\n"+"- Ensure all string literals are properly enclosed (avoid unterminated strings).\n"
            "- The list must be syntactically correct and directly usable in Python.\n\n"+"Flashcard Structure:\n"+"- **Front:** Question\n"+  "- **Back:** Answer\n"+"- **Answer Length:**\n"+"  - **Long Answer Questions:** At least 500 words\n"+"  - **Short Answer Questions:** At least 200 words\n"+"  - **Very Short Answer Questions:** At least 20 words\n\n"+"Return only the correctly formatted list, without any additional text."
        ).format(no_of_questions=no_of_questions, question_type=question_type)


        contents = [prompt]
        if doc_data:
            contents.insert(0, types.Part.from_bytes(data=doc_data, mime_type=mime_type))
        
        return Response({'message': generate_res(contents) }, status=status.HTTP_200_OK)

    except httpx.TimeoutException:
        logger.error('Gemini API request timed out.')
        return Response({'error': 'Gemini API request timed out.'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except json.JSONDecodeError as e:
        logger.error(f'JSON Decode Error: {str(e)}')
        return Response({'error': 'Failed to parse response from API.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Internal Server Error: {str(e)}')
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
