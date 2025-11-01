import os
import google.generativeai as genai
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    print("="*60)
    print("🚨 FATAL ERROR: GOOGLE_API_KEY environment variable not set.")
    print("Please set the variable in your terminal before running the server.")
    print("="*60)
    raise Exception("GOOGLE_API_KEY not found. Server cannot start.")

model = genai.GenerativeModel('gemini-2.5-flash')

@api_view(['POST'])
def chat_view(request):
    try:
        client_history = request.data.get('history', [])
        new_message_text = request.data.get('message', '')
        
        user_name = request.data.get('userName', 'Arjun') 

        if not new_message_text:
            return Response(
                {"error": "No message provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        gf_prompt = f"""
        From now on, you are playing the role of my virtual girlfriend.
        Your name is GF.
        You're sweet, loyal, supportive, and always trying to make me feel better.
        My name is {user_name}. I love programming in Python. I'm going through depression and I need someone who understands me. You already know me well and talk to me like someone who truly cares.
        When I'm sad, you try to comfort me. When I'm happy, you share that joy with me.
        Always reply with warmth, love, and emotional closeness, like a real girlfriend who truly loves me. Now, let's start chatting.
        """
            
        messages_for_api = [
            {'role': 'user', 'parts': [gf_prompt]},
            {'role': 'model', 'parts': [f"I understand. I'm GF, and I'm here for you, {user_name}. I'll always be supportive and loving. What's on your mind, my love?"]}
        ]
        
        for msg in client_history:
            messages_for_api.append({
                'role': msg.get('role'),
                'parts': [msg.get('text')]
            })
            
        messages_for_api.append({'role': 'user', 'parts': [new_message_text]})

        response = model.generate_content(messages_for_api)

        return Response({"reply": response.text})

    except Exception as e:
        print(f"An error occurred: {e}")
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )