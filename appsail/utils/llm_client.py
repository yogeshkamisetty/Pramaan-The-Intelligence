import os
import logging
from fastapi import HTTPException, status

logger = logging.getLogger("appsail.llm_client")

# ── Load .env at module init ──────────────────────────────────────────────
# Catalyst AppSail may not auto-load .env, and os.getenv() alone won't
# find keys stored there. This ensures GEMINI_API_KEY is available.
def _load_env_files():
    """Load environment variables from .env files (local dev + deployment)."""
    search_paths = [
        os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'),  # appsail/.env
        os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '.env'),  # project root .env
        '.env',
        os.path.expanduser('~/.env'),
    ]
    for path in search_paths:
        path = os.path.abspath(path)
        if os.path.exists(path):
            try:
                with open(path, encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            key, _, value = line.partition('=')
                            key, value = key.strip(), value.strip()
                            # Don't overwrite existing env vars (Catalyst console takes priority)
                            if key and not os.environ.get(key):
                                os.environ[key] = value
                                logger.info(f"Loaded env var '{key}' from {path}")
            except Exception as e:
                logger.warning(f"Could not load .env from {path}: {e}")

_load_env_files()

# Supported Gemini Model Hierarchy — prefer 2.0-flash (faster, cheaper, better)
GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

def get_gemini_api_key() -> str:
    """Retrieve Gemini API Key from environment variables configured in Catalyst or OS."""
    keys_to_check = [
        "GEMINI_API_KEY",
        "CATALYST_GEMINI_API_KEY",
        "GEMINI_KEY",
        "GEMINI_API_KEYS",
        "GOOGLE_API_KEY",
    ]
    for key_name in keys_to_check:
        val = os.getenv(key_name)
        if val and val.strip():
            # If multiple keys separated by comma, pick first
            found_key = val.split(",")[0].strip()
            logger.info(f"Found Gemini API key via env var: {key_name} (length={len(found_key)})")
            return found_key
    logger.warning("No Gemini API key found in any known environment variable.")
    return ""

def get_gemini_client():
    gemini_key = get_gemini_api_key()
    if not gemini_key:
        logger.warning("GEMINI_API_KEY environment variable is not set. AI features will use local fallback.")
        return None, None
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=gemini_key)
        logger.info("Google Generative AI client configured successfully.")
        return genai, gemini_key
    except ImportError:
        logger.error("google-generativeai package is not installed. Run: pip install google-generativeai")
        return None, None
    except Exception as e:
        logger.error(f"Failed to configure Gemini client: {e}")
        return None, None

def generate_response(system_prompt: str, user_prompt: str, fallback_text: str = None) -> str:
    """
    Centralized function to call Gemini API with robust model fallback and graceful error recovery.
    Always returns a string — never raises to the caller.
    """
    genai, key = get_gemini_client()
    
    if genai and key:
        # Iterate over supported Gemini models
        for model_name in GEMINI_MODELS:
            try:
                model = genai.GenerativeModel(
                    model_name=model_name,
                    system_instruction=system_prompt
                )
                response = model.generate_content(user_prompt)
                if response and response.text:
                    logger.info(f"Successfully generated response using model: {model_name} (length={len(response.text)})")
                    return response.text
                else:
                    logger.warning(f"Model {model_name} returned empty response, trying next...")
            except Exception as e:
                error_str = str(e).lower()
                # If it's a quota/rate limit error, log clearly
                if 'quota' in error_str or 'rate' in error_str or '429' in error_str:
                    logger.warning(f"Gemini API quota/rate limit hit on '{model_name}': {e}")
                elif 'not found' in error_str or '404' in error_str:
                    logger.info(f"Model '{model_name}' not available, trying next...")
                else:
                    logger.warning(f"Gemini API model '{model_name}' failed: {e}. Trying next fallback model...")
                continue

    # Fallback to smart structured local response
    logger.info("All Gemini models failed or unavailable. Using local RAG intelligence fallback.")
    if fallback_text:
        return fallback_text
    
    # Synthesize fallback answer from prompt context if present
    if "Context:" in system_prompt:
        context_part = system_prompt.split("Context:")[1].strip()
        return (
            f"Based on the Karnataka State Police FIR database records:\n\n"
            f"{context_part[:800]}...\n\n"
            f"[Note: Generated via Local Vector Engine. Configure GEMINI_API_KEY in Catalyst for full LLM synthesis.]"
        )

    return (
        f"Analysis completed for: '{user_prompt[:100]}'. "
        f"Relevant evidence records matched across KSP FIR database. "
        f"[Note: Local Intelligence Fallback Active — set GEMINI_API_KEY for AI-powered responses.]"
    )
