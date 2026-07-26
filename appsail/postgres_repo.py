import os
try:
    import asyncpg
except ImportError:
    asyncpg = None
import logging

logger = logging.getLogger("appsail.postgres_repo")
logger.setLevel(logging.INFO)

class PostgresRepository:
    def __init__(self):
        self.pool = None

    async def init_schema(self):
        if not self.pool:
            if not hasattr(self, '_mock_cases'):
                self._mock_cases = {}
            if not hasattr(self, '_mock_complainants'):
                self._mock_complainants = []
            if not hasattr(self, '_mock_victims'):
                self._mock_victims = []
            if not hasattr(self, '_mock_suspects'):
                self._mock_suspects = []
            if not hasattr(self, '_mock_witnesses'):
                self._mock_witnesses = []
            if not hasattr(self, '_mock_evidence'):
                self._mock_evidence = []
            if not hasattr(self, '_mock_attachments'):
                self._mock_attachments = []
            if not hasattr(self, '_mock_timeline'):
                self._mock_timeline = []
            if not hasattr(self, '_mock_ai_summary'):
                self._mock_ai_summary = {}
            if not hasattr(self, '_mock_case_relationships'):
                self._mock_case_relationships = []
            return
        
        schema_query = """
        CREATE TABLE IF NOT EXISTS cases (
            id VARCHAR(50) PRIMARY KEY,
            fir VARCHAR(50),
            title VARCHAR(255),
            category VARCHAR(100),
            sub_category VARCHAR(100),
            severity VARCHAR(50),
            status VARCHAR(50),
            state VARCHAR(100),
            district VARCHAR(100),
            station VARCHAR(100),
            address TEXT,
            pincode VARCHAR(20),
            latitude FLOAT,
            longitude FLOAT,
            incident_date DATE,
            incident_time TIME,
            reported_date TIMESTAMP,
            fir_registered_date TIMESTAMP,
            io_name VARCHAR(100),
            io_rank VARCHAR(100),
            io_badge VARCHAR(100),
            io_unit VARCHAR(100),
            io_supervisor VARCHAR(100),
            crime_description_en TEXT,
            crime_description_kn TEXT,
            tags JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS complainants (
            id SERIAL PRIMARY KEY,
            case_id VARCHAR(50) REFERENCES cases(id) ON DELETE CASCADE,
            name VARCHAR(255),
            mobile VARCHAR(20),
            alternate_mobile VARCHAR(20),
            email VARCHAR(255),
            address TEXT,
            aadhaar VARCHAR(50),
            gender VARCHAR(20),
            age INT
        );
        CREATE TABLE IF NOT EXISTS victims (
            id SERIAL PRIMARY KEY,
            case_id VARCHAR(50) REFERENCES cases(id) ON DELETE CASCADE,
            name VARCHAR(255),
            age INT,
            gender VARCHAR(20),
            mobile VARCHAR(20),
            address TEXT,
            injuries TEXT,
            medical_report_url TEXT
        );
        CREATE TABLE IF NOT EXISTS suspects (
            id SERIAL PRIMARY KEY,
            case_id VARCHAR(50) REFERENCES cases(id) ON DELETE CASCADE,
            name VARCHAR(255),
            alias VARCHAR(255),
            nickname VARCHAR(255),
            age INT,
            gender VARCHAR(20),
            mobile VARCHAR(20),
            address TEXT,
            known_associates TEXT,
            previous_records TEXT,
            identification_marks TEXT,
            photo_url TEXT
        );
        CREATE TABLE IF NOT EXISTS witnesses (
            id SERIAL PRIMARY KEY,
            case_id VARCHAR(50) REFERENCES cases(id) ON DELETE CASCADE,
            name VARCHAR(255),
            mobile VARCHAR(20),
            address TEXT,
            statement TEXT
        );
        CREATE TABLE IF NOT EXISTS evidence (
            id SERIAL PRIMARY KEY,
            case_id VARCHAR(50) REFERENCES cases(id) ON DELETE CASCADE,
            evidence_id VARCHAR(100),
            type VARCHAR(100),
            description TEXT,
            collected_by VARCHAR(100),
            collection_date TIMESTAMP,
            gps_location VARCHAR(100),
            images JSONB,
            videos JSONB,
            documents JSONB
        );
        CREATE TABLE IF NOT EXISTS attachments (
            id SERIAL PRIMARY KEY,
            case_id VARCHAR(50) REFERENCES cases(id) ON DELETE CASCADE,
            file_url TEXT,
            file_type VARCHAR(50),
            file_name VARCHAR(255)
        );
        CREATE TABLE IF NOT EXISTS timeline (
            id SERIAL PRIMARY KEY,
            case_id VARCHAR(50) REFERENCES cases(id) ON DELETE CASCADE,
            event VARCHAR(255),
            timestamp TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS ai_summary (
            case_id VARCHAR(50) PRIMARY KEY REFERENCES cases(id) ON DELETE CASCADE,
            incident_summary TEXT,
            crime_type VARCHAR(100),
            modus_operandi TEXT,
            keywords JSONB,
            investigation_suggestions JSONB,
            risk_score INT
        );
        CREATE TABLE IF NOT EXISTS case_relationships (
            id SERIAL PRIMARY KEY,
            case_id VARCHAR(50) REFERENCES cases(id) ON DELETE CASCADE,
            related_case_id VARCHAR(50),
            relationship_type VARCHAR(100)
        );
        """
        await self.execute(schema_query)

    async def insert_case_full(self, case_data: dict):
        if not self.pool:
            if not hasattr(self, '_mock_cases'):
                await self.init_schema()
            case_id = case_data['case']['id']
            self._mock_cases[case_id] = case_data['case']
            self._mock_complainants.append(case_data.get('complainant', {}))
            for v in case_data.get('victims', []): self._mock_victims.append(v)
            for s in case_data.get('suspects', []): self._mock_suspects.append(s)
            for w in case_data.get('witnesses', []): self._mock_witnesses.append(w)
            for e in case_data.get('evidence', []): self._mock_evidence.append(e)
            for t in case_data.get('timeline', []): self._mock_timeline.append(t)
            for a in case_data.get('attachments', []): self._mock_attachments.append(a)
            if 'ai_summary' in case_data: self._mock_ai_summary[case_id] = case_data['ai_summary']
            for cr in case_data.get('case_relationships', []): self._mock_case_relationships.append(cr)
            return True
            
        # For simplicity, we just return True for now in postgres mode, we would do a transaction here
        return True
        
    async def get_all_cases(self):
        if not self.pool:
            if not hasattr(self, '_mock_cases'):
                return []
            return list(self._mock_cases.values())
        return await self.fetch("SELECT * FROM cases")

    async def init_pool(self):
        # Allow fallback or mock connection if PostgreSQL URI isn't provided
        uri = os.getenv("POSTGRES_URI")
        if not uri:
            logger.warning("POSTGRES_URI not found. PostgreSQL agent will run in Mock Mode.")
            return

        try:
            self.pool = await asyncpg.create_pool(uri)
            logger.info("PostgreSQL connection pool initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize PostgreSQL pool: {e}")

    async def close_pool(self):
        if self.pool:
            await self.pool.close()
            logger.info("PostgreSQL connection pool closed.")

    async def fetch(self, query, *args):
        if not self.pool:
            logger.warning("PostgreSQL pool not initialized, returning empty results for query.")
            return []
        
        async with self.pool.acquire() as conn:
            try:
                records = await conn.fetch(query, *args)
                return [dict(r) for r in records]
            except Exception as e:
                logger.error(f"Error executing query {query}: {e}")
                return []

    async def execute(self, query, *args):
        if not self.pool:
            logger.warning("PostgreSQL pool not initialized, query skipped.")
            return None
        
        async with self.pool.acquire() as conn:
            try:
                status = await conn.execute(query, *args)
                return status
            except Exception as e:
                logger.error(f"Error executing statement {query}: {e}")
                return None

    async def search_similar_chunks(self, embedding: list, top_k: int = 5):
        if not self.pool:
            logger.warning("PostgreSQL pool not initialized, skipping vector search.")
            return []

        # Use pgvector's <-> operator for L2 distance (or <=> for cosine similarity)
        query = """
            SELECT dc.chunk_id, dc.document_id, dc.chunk_text, d.title, d.source_type, d.case_id,
                   (dc.embedding <=> $1::vector) AS distance
            FROM DocumentChunks dc
            JOIN Documents d ON dc.document_id = d.document_id
            ORDER BY distance ASC
            LIMIT $2
        """
        # Convert embedding list to pgvector string format
        embedding_str = "[" + ",".join(str(x) for x in embedding) + "]"
        return await self.fetch(query, embedding_str, top_k)
    async def insert_face_record(self, record: dict):
        if not self.pool:
            if not hasattr(self, '_mock_face_dataset'):
                self._mock_face_dataset = {}
            self._mock_face_dataset[record['person_id']] = record
            return True
        query = """
            INSERT INTO PoliceFaceDataset (person_id, full_name, age, gender, case_number, station, status, notes, image_path, embedding)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::vector)
            ON CONFLICT (person_id) DO UPDATE SET
                full_name = EXCLUDED.full_name, age = EXCLUDED.age, gender = EXCLUDED.gender,
                case_number = EXCLUDED.case_number, station = EXCLUDED.station, status = EXCLUDED.status,
                notes = EXCLUDED.notes, image_path = EXCLUDED.image_path, embedding = EXCLUDED.embedding,
                updated_at = CURRENT_TIMESTAMP
        """
        embedding_str = "[" + ",".join(str(x) for x in record['embedding']) + "]"
        status = await self.execute(query, record['person_id'], record['full_name'], record.get('age'),
                           record.get('gender'), record.get('case_number'), record.get('station'),
                           record.get('status'), record.get('notes'), record.get('image_path'), embedding_str)
        return status is not None

    async def get_face_dataset(self):
        if not self.pool:
            if not hasattr(self, '_mock_face_dataset'):
                return []
            return list(self._mock_face_dataset.values())
        query = "SELECT person_id, full_name, age, gender, case_number, station, status, notes, image_path, created_at FROM PoliceFaceDataset"
        return await self.fetch(query)

    async def delete_face_record(self, person_id: str):
        if not self.pool:
            if hasattr(self, '_mock_face_dataset') and person_id in self._mock_face_dataset:
                del self._mock_face_dataset[person_id]
                return True
            return False
        query = "DELETE FROM PoliceFaceDataset WHERE person_id = $1"
        return await self.execute(query, person_id) is not None

    async def search_faces(self, embedding: list, top_k: int = 3, threshold: float = 0.6):
        import numpy as np
        
        if not self.pool:
            if not hasattr(self, '_mock_face_dataset') or not self._mock_face_dataset:
                return []
            
            results = []
            emb_vec = np.array(embedding)
            for record in self._mock_face_dataset.values():
                db_vec = np.array(record['embedding'])
                # Cosine distance
                dist = 1.0 - np.dot(emb_vec, db_vec) / (np.linalg.norm(emb_vec) * np.linalg.norm(db_vec))
                if dist < threshold:
                    matched_record = {k: v for k, v in record.items() if k != 'embedding'}
                    matched_record['distance'] = dist
                    matched_record['similarity'] = max(0, 100 - (dist * 100))
                    results.append(matched_record)
            
            results.sort(key=lambda x: x['distance'])
            return results[:top_k]

        query = """
            SELECT person_id, full_name, age, gender, case_number, station, status, notes, image_path,
                   (embedding <=> $1::vector) AS distance
            FROM PoliceFaceDataset
            WHERE (embedding <=> $1::vector) < $2
            ORDER BY distance ASC
            LIMIT $3
        """
        embedding_str = "[" + ",".join(str(x) for x in embedding) + "]"
        records = await self.fetch(query, embedding_str, threshold, top_k)
        
        # Add similarity percentage
        for r in records:
            r['similarity'] = max(0, 100 - (r['distance'] * 100))
        return records

# Global instance
pg_repo = PostgresRepository()
