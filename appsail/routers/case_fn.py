import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Request, HTTPException, status
from pydantic import BaseModel
from postgres_repo import pg_repo
import uuid
from datetime import datetime

logger = logging.getLogger("appsail.case_fn")
router = APIRouter(prefix="/server/case_fn")

class CaseRegistrationRequest(BaseModel):
    title: str
    category: str
    sub_category: Optional[str] = ""
    severity: str
    status: str
    state: str
    district: str
    station: str
    address: str
    pincode: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    incident_date: str
    incident_time: str
    io_name: str
    io_rank: Optional[str] = ""
    io_badge: Optional[str] = ""
    io_unit: Optional[str] = ""
    io_supervisor: Optional[str] = ""
    complainant: Dict[str, Any]
    victims: List[Dict[str, Any]] = []
    suspects: List[Dict[str, Any]] = []
    witnesses: List[Dict[str, Any]] = []
    evidence: List[Dict[str, Any]] = []
    crime_description_en: str
    crime_description_kn: Optional[str] = ""
    ai_summary: Optional[Dict[str, Any]] = None
    tags: List[str] = []

@router.post("/")
async def register_case(req: CaseRegistrationRequest, request: Request):
    try:
        # Generate new IDs
        case_id = f"CASE-AUTO-{uuid.uuid4().hex[:6].upper()}"
        fir_no = f"FIR-{datetime.now().year}-{uuid.uuid4().hex[:4].upper()}"
        
        # Build Case object
        case_obj = {
            "id": case_id,
            "fir": fir_no,
            "title": req.title,
            "category": req.category,
            "sub_category": req.sub_category,
            "severity": req.severity,
            "status": req.status,
            "state": req.state,
            "district": req.district,
            "station": req.station,
            "address": req.address,
            "pincode": req.pincode,
            "latitude": req.latitude,
            "longitude": req.longitude,
            "incident_date": req.incident_date,
            "incident_time": req.incident_time,
            "reported_date": datetime.now().isoformat(),
            "fir_registered_date": datetime.now().isoformat(),
            "io_name": req.io_name,
            "io_rank": req.io_rank,
            "io_badge": req.io_badge,
            "io_unit": req.io_unit,
            "io_supervisor": req.io_supervisor,
            "crime_description_en": req.crime_description_en,
            "crime_description_kn": req.crime_description_kn,
            "tags": req.tags,
            "created_at": datetime.now().isoformat()
        }
        
        # Attach Case ID to all related entities
        complainant = req.complainant.copy()
        complainant["case_id"] = case_id
        
        victims = req.victims.copy()
        for v in victims: v["case_id"] = case_id
            
        suspects = req.suspects.copy()
        for s in suspects: s["case_id"] = case_id
            
        witnesses = req.witnesses.copy()
        for w in witnesses: w["case_id"] = case_id
            
        evidence = req.evidence.copy()
        for e in evidence: e["case_id"] = case_id

        # Timeline
        timeline = [
            {"case_id": case_id, "event": "Case Created", "timestamp": datetime.now().isoformat()},
            {"case_id": case_id, "event": "FIR Registered", "timestamp": datetime.now().isoformat()},
            {"case_id": case_id, "event": f"Officer Assigned ({req.io_name})", "timestamp": datetime.now().isoformat()}
        ]

        # Put everything in a single payload
        full_payload = {
            "case": case_obj,
            "complainant": complainant,
            "victims": victims,
            "suspects": suspects,
            "witnesses": witnesses,
            "evidence": evidence,
            "timeline": timeline,
            "attachments": [],
            "case_relationships": []
        }
        
        if req.ai_summary:
            req.ai_summary["case_id"] = case_id
            full_payload["ai_summary"] = req.ai_summary

        await pg_repo.insert_case_full(full_payload)
        
        return {
            "status": "success",
            "message": "Case Registered Successfully",
            "case_id": case_id,
            "fir_no": fir_no,
            "data": full_payload
        }
        
    except Exception as e:
        logger.error(f"Error registering case: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register case: {str(e)}"
        )

@router.get("/")
async def get_all_cases(request: Request):
    try:
        cases = await pg_repo.get_all_cases()
        return {"status": "success", "data": cases}
    except Exception as e:
        logger.error(f"Error fetching cases: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch cases: {str(e)}"
        )

from utils.llm_client import generate_response

class AIGenerateRequest(BaseModel):
    narrative: str

@router.post("/generate-summary")
async def generate_summary(req: AIGenerateRequest):
    try:
        system_prompt = (
            "You are an AI assistant for a crime intelligence platform. "
            "Given an FIR narrative, you will extract structured information. "
            "Return ONLY a valid JSON object matching this exact schema: "
            "{ "
            "  \"incident_summary\": \"brief summary\", "
            "  \"crime_type\": \"one of: Burglary, Theft, Assault, Robbery, Cyber Crime, Missing Person, Murder, Fraud, Others\", "
            "  \"modus_operandi\": \"extracted MO details\", "
            "  \"keywords\": [\"array\", \"of\", \"keywords\"], "
            "  \"investigation_suggestions\": [\"array\", \"of\", \"suggestions\"], "
            "  \"risk_score\": int from 1 to 100 "
            "}"
        )
        
        response_text = generate_response(system_prompt, req.narrative)
        
        import json
        
        # Clean up any markdown code blocks
        if response_text.startswith("```json"):
            response_text = response_text[7:-3]
        elif response_text.startswith("```"):
            response_text = response_text[3:-3]
            
        data = json.loads(response_text)
        return {"status": "success", "data": data}
        
    except Exception as e:
        logger.error(f"Error generating summary: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate AI summary: {str(e)}"
        )
