import os
import sys
import argparse

# Add appsail to path so we can import llm_client
sys.path.append(os.path.join(os.path.dirname(__file__), "appsail"))

from utils.llm_client import generate_response

def test_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY environment variable is missing!")
        print("Please set it in your terminal before running this script.")
        print("Example (Windows PowerShell): $env:GEMINI_API_KEY=\"your_key_here\"")
        print("Example (Command Prompt): set GEMINI_API_KEY=your_key_here")
        return
        
    print(f"Loaded GEMINI_API_KEY: {api_key[:4]}...{api_key[-4:] if len(api_key) > 8 else ''}")
    print("Testing connection to Gemini API...")
    
    try:
        response = generate_response(
            system_prompt="You are a helpful test assistant.",
            user_prompt="Hello, this is a test. Please respond with exactly 'Gemini connection successful'."
        )
        print("\n--- GEMINI RESPONSE ---")
        print(response)
        print("-----------------------")
        print("\nSUCCESS! The AI integration is fully functional.")
    except Exception as e:
        print("\n--- ERROR ---")
        print(f"Failed to connect to Gemini API: {e}")
        print("Please verify your API key is valid and has not expired.")

if __name__ == "__main__":
    test_gemini()
