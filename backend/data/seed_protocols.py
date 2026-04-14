"""
Seed Protocols — Pre-loads the offline knowledge base.

Seeds HAZMAT protocols, medical triage protocols, and equipment
inventory into the vector store at startup.
"""

from __future__ import annotations

import uuid

from core import Document, store
from core.embeddings import embed_text


def seed_all() -> None:
    """Seed all protocol collections."""
    seed_hazmat_protocols()
    seed_medical_protocols()
    seed_inventory()
    seed_sample_field_data()


def seed_hazmat_protocols() -> None:
    """Seed HAZMAT protocol documents with UN codes."""
    protocols = [
        {
            "title": "HAZMAT Protocol: UN-1090 Acetone",
            "content": "UN-1090 Acetone — Flammable liquid, Class 3. Flash point -20°C. Immediate health effects: eye and respiratory irritation, dizziness, headache. Skin contact may cause dermatitis. For chemical burns, immediately flush affected area with copious amounts of water for minimum 20 minutes. Remove contaminated clothing. Do NOT apply neutralizing agents. Required PPE: Level B suit minimum, SCBA for enclosed spaces. Decontamination: Remove to fresh air, flush skin and eyes. If inhaled, provide oxygen. Evacuation zone: 100m radius minimum.",
            "metadata": {"category": "HAZMAT", "un_code": "UN-1090", "priority_level": "IMMEDIATE", "equipment_required": ["Level A Suit", "SCBA", "Chemical Splash Goggles"], "contraindications": [], "zone": "Sector_3", "equipment_available": True},
        },
        {
            "title": "HAZMAT Protocol: UN-1823 Sodium Hydroxide (Caustic Soda)",
            "content": "UN-1823 Sodium Hydroxide — Corrosive solid, Class 8. Causes severe chemical burns on contact. Penetrates tissue rapidly. For skin exposure: immediately flush with water for 30+ minutes. Do NOT attempt to neutralize with acid. For eye contact: continuous irrigation for minimum 30 minutes while transporting to medical facility. Ingestion: Do NOT induce vomiting. Give water or milk to dilute. Required PPE: Level A suit, chemical-resistant gloves (butyl rubber), face shield. Thermal decomposition produces toxic sodium oxide fumes.",
            "metadata": {"category": "HAZMAT", "un_code": "UN-1823", "priority_level": "IMMEDIATE", "equipment_required": ["Level A Suit", "Chemical Gloves", "Face Shield"], "contraindications": [], "zone": "Sector_1", "equipment_available": True},
        },
        {
            "title": "HAZMAT Protocol: UN-1017 Chlorine Gas",
            "content": "UN-1017 Chlorine — Toxic gas, Class 2.3 (8). Yellow-green gas with pungent odor. LC50: 293 ppm/1hr. Symptoms: severe eye and respiratory irritation, pulmonary edema (may be delayed 24-48 hrs), coughing, chest tightness. IMMEDIATELY evacuate downwind population. Establish exclusion zone minimum 800m. Required PPE: Level A suit with SCBA in all cases. Decontamination: Move to fresh air immediately. Remove contaminated clothing. Provide oxygen. Monitor for delayed pulmonary edema. Do NOT administer epinephrine — may cause cardiac arrhythmia.",
            "metadata": {"category": "HAZMAT", "un_code": "UN-1017", "priority_level": "IMMEDIATE", "equipment_required": ["Level A Suit", "SCBA"], "contraindications": ["epinephrine"], "zone": "Sector_2", "equipment_available": True},
        },
        {
            "title": "HAZMAT Protocol: UN-2811 Toxic Solid (Organic)",
            "content": "UN-2811 Toxic solid, organic, n.o.s. — Class 6.1. May include pesticides, industrial toxins. Identify specific compound if possible. General response: prevent dust generation, contain spill with inert absorbent. Required PPE: minimum Level B with SCBA. Decontamination corridor required. Medical monitoring for all exposed personnel for minimum 72 hours. Symptoms vary by compound — obtain SDS if available. For unknown compounds, treat as maximum hazard.",
            "metadata": {"category": "HAZMAT", "un_code": "UN-2811", "priority_level": "DELAYED", "equipment_required": ["Level B Suit", "SCBA", "Absorbent Material"], "contraindications": [], "zone": "Sector_4", "equipment_available": True},
        },
        {
            "title": "HAZMAT Protocol: UN-1005 Ammonia (Anhydrous)",
            "content": "UN-1005 Ammonia (Anhydrous) — Toxic gas, Class 2.3 (8). Colorless gas with sharp, pungent odor. Immediately dangerous at 300 ppm. Causes severe burns to eyes, skin, and respiratory tract. Heavier than air — pools in low-lying areas. Evacuate downwind immediately, 1600m minimum. Decontamination: flush with water for 20+ minutes. Remove all contaminated clothing. Do NOT apply oil-based ointments. Required PPE: Level A fully encapsulating suit with SCBA. Monitor for laryngeal edema and bronchospasm.",
            "metadata": {"category": "HAZMAT", "un_code": "UN-1005", "priority_level": "IMMEDIATE", "equipment_required": ["Level A Suit", "SCBA"], "contraindications": [], "zone": "Sector_5", "equipment_available": True},
        },
        {
            "title": "HAZMAT Protocol: UN-1830 Sulfuric Acid",
            "content": "UN-1830 Sulfuric Acid — Corrosive liquid, Class 8. Concentrated sulfuric acid causes immediate, severe chemical burns. Generates heat on contact with water — dilute slowly. For skin contact: brush off excess, then flush with large quantities of water for 30+ minutes. For eye contact: continuous gentle irrigation. Do NOT use baking soda to neutralize. Required PPE: Level A suit, acid-resistant gloves (Viton or PVA), chemical splash goggles with face shield. Spill containment: use dry sand or vermiculite, NOT sawdust.",
            "metadata": {"category": "HAZMAT", "un_code": "UN-1830", "priority_level": "IMMEDIATE", "equipment_required": ["Level A Suit", "Acid-Resistant Gloves", "Face Shield"], "contraindications": [], "zone": "Sector_3", "equipment_available": True},
        },
        {
            "title": "HAZMAT Protocol: UN-1203 Gasoline",
            "content": "UN-1203 Gasoline — Flammable liquid, Class 3. Flash point -43°C. Extremely flammable — eliminate ALL ignition sources within 300m. Vapors heavier than air and may travel to distant ignition source. Health effects: CNS depression, respiratory irritation, potential carcinogen (contains benzene). For skin contact: wash with soap and water. Do NOT induce vomiting if ingested — aspiration risk. Fire suppression: AFFF foam or dry chemical. Do NOT use water stream directly on burning pool.",
            "metadata": {"category": "HAZMAT", "un_code": "UN-1203", "priority_level": "DELAYED", "equipment_required": ["Level B Suit", "SCBA", "AFFF Foam"], "contraindications": [], "zone": "Sector_6", "equipment_available": True},
        },
        {
            "title": "HAZMAT Decontamination Setup Protocol",
            "content": "Standard 3-stage decontamination corridor: Stage 1 (Hot Zone Exit): initial gross decontamination with high-volume low-pressure water. Remove outer PPE. Stage 2 (Warm Zone): soap and water wash, equipment bagging. Stage 3 (Cold Zone): medical evaluation, clean clothing. Corridor orientation: upwind from incident. Minimum staffing: 4 personnel per stage. Water runoff must be contained — use portable berms and collection pools. Decon corridor should be minimum 15m long. Monitor ambient air at each stage.",
            "metadata": {"category": "HAZMAT", "un_code": None, "priority_level": "DELAYED", "equipment_required": ["Decon Tent", "Portable Berms", "Collection Pools"], "contraindications": [], "zone": "Sector_1", "equipment_available": True},
        },
        {
            "title": "HAZMAT Protocol: Radiation Emergency (General)",
            "content": "Radiation emergency response: Time, Distance, Shielding. Minimize time in radiation field. Maintain maximum distance. Use available shielding (concrete, lead, earth). Establish hot zone based on dosimeter readings — typical exclusion at >2 mR/hr. All personnel require TLD or electronic dosimeters. Contaminated patients: treat life-threatening injuries FIRST, then decontaminate. Remove clothing (removes ~90% of external contamination). Bag all removed items. Internal contamination: administer KI (Potassium Iodide) for iodine isotopes only.",
            "metadata": {"category": "HAZMAT", "un_code": None, "priority_level": "IMMEDIATE", "equipment_required": ["Dosimeter", "KI Tablets", "Lead Apron"], "contraindications": [], "zone": "Sector_7", "equipment_available": True},
        },
        {
            "title": "HAZMAT Protocol: UN-1789 Hydrochloric Acid",
            "content": "UN-1789 Hydrochloric Acid — Corrosive liquid, Class 8. Fuming liquid producing irritating hydrogen chloride gas. Causes severe burns to skin, eyes, and respiratory tract. For exposure: immediately flush with water for minimum 20 minutes. Remove contaminated clothing while flushing. For inhalation: move to fresh air, administer oxygen if available. Monitor for pulmonary edema for 24-48 hours. Do NOT administer sodium bicarbonate to neutralize skin burns. Required PPE: Level B with SCBA, acid-resistant suit.",
            "metadata": {"category": "HAZMAT", "un_code": "UN-1789", "priority_level": "IMMEDIATE", "equipment_required": ["Level B Suit", "SCBA", "Acid-Resistant Gloves"], "contraindications": [], "zone": "Sector_3", "equipment_available": True},
        },
    ]

    for proto in protocols:
        content = proto["content"]
        vector = embed_text(content)
        doc = Document(
            id=str(uuid.uuid4()),
            content=content,
            title=proto["title"],
            vector=vector,
            metadata=proto["metadata"],
            data_type="TEXT",
            collection="protocols",
        )
        store.insert(doc)


def seed_medical_protocols() -> None:
    """Seed medical triage protocols."""
    protocols = [
        {
            "title": "START Triage Protocol",
            "content": "Simple Triage and Rapid Treatment (START): Step 1: Walking wounded → MINOR (Green). Step 2: Check breathing — no breathing after positioning → EXPECTANT (Black). Breathing rate >30/min → IMMEDIATE (Red). Step 3: Check circulation — capillary refill >2 seconds OR absent radial pulse → IMMEDIATE (Red). Step 4: Check mental status — cannot follow simple commands → IMMEDIATE (Red). Otherwise → DELAYED (Yellow). Triage tags must be applied before treatment begins. Reassess every 15 minutes.",
            "metadata": {"category": "MEDICAL", "priority_level": "IMMEDIATE", "contraindications": [], "zone": "Sector_1", "equipment_available": True},
        },
        {
            "title": "Chemical Burn Treatment Protocol",
            "content": "Chemical burn treatment: FIRST priority is copious water irrigation — minimum 20 minutes continuous flushing. Remove all contaminated clothing while irrigating. Do NOT attempt to neutralize the chemical. For acid burns: prolonged water flush. For alkali burns: extended flush (30+ minutes) — alkali penetrates deeper. Cover with sterile dry dressing after irrigation. Pain management: IV morphine 2-4mg titrated. Do NOT apply topical anesthetics to chemical burns. Monitor for systemic toxicity. If penicillin-based antibiotics are indicated, verify NO penicillin allergy first. Alternative: ciprofloxacin for penicillin-allergic patients.",
            "metadata": {"category": "MEDICAL", "priority_level": "IMMEDIATE", "contraindications": ["penicillin"], "zone": "Sector_3", "equipment_available": True},
        },
        {
            "title": "Crush Syndrome Management",
            "content": "Crush syndrome: occurs when compressed muscle is released after >1 hour. Release of myoglobin, potassium, and phosphorus can cause fatal cardiac arrhythmia and acute renal failure. BEFORE extraction: establish IV access with 0.9% Normal Saline — bolus 1-2L. Administer sodium bicarbonate 1 mEq/kg IV. Continuous cardiac monitoring mandatory. After extraction: aggressive fluid resuscitation (target urine output >200 mL/hr). Monitor potassium — treat hyperkalemia immediately with calcium gluconate, insulin/glucose, and albuterol nebulizer. Do NOT use Ringer's Lactate (contains potassium).",
            "metadata": {"category": "MEDICAL", "priority_level": "IMMEDIATE", "contraindications": [], "zone": "Sector_5", "equipment_available": True},
        },
        {
            "title": "Burn Treatment Protocol — Thermal Burns",
            "content": "Thermal burn treatment by severity: First degree (superficial) — cool running water 10-20 minutes, aloe vera, ibuprofen. Second degree (partial thickness) — cool water, sterile non-adherent dressing, pain management. DO NOT pop blisters. Third degree (full thickness) — do NOT apply cold water (hypothermia risk with large burns). Cover with clean dry sheet. IV fluid resuscitation per Parkland formula: 4mL × kg × %TBSA in first 24hrs, half in first 8hrs. Estimate TBSA using Rule of Nines. Intubate early if inhalation injury suspected (singed nasal hairs, facial burns, hoarse voice).",
            "metadata": {"category": "MEDICAL", "priority_level": "IMMEDIATE", "contraindications": [], "zone": "Sector_2", "equipment_available": True},
        },
        {
            "title": "Anaphylaxis Treatment Protocol",
            "content": "Anaphylaxis emergency protocol: IMMEDIATELY administer epinephrine 0.3-0.5mg IM (1:1000) in anterolateral thigh. Repeat every 5-15 minutes if no improvement. Position patient supine with legs elevated (unless respiratory distress — semi-recumbent). Establish large-bore IV access. Secondary medications: Diphenhydramine 50mg IV, Methylprednisolone 125mg IV, Albuterol nebulizer for bronchospasm. Monitor for biphasic reaction — observe minimum 4 hours. CONTRAINDICATED in patients on beta-blockers — may need glucagon 1-5mg IV instead. Document all allergens.",
            "metadata": {"category": "MEDICAL", "priority_level": "IMMEDIATE", "contraindications": [], "zone": "Sector_1", "equipment_available": True, "equipment_required": ["Epinephrine Auto-Injector", "IV Kit", "Albuterol Nebulizer"]},
        },
        {
            "title": "Wound Care — Infection Prevention",
            "content": "Field wound care protocol: Control bleeding with direct pressure. Irrigate wound with clean water or saline (minimum 500mL for contaminated wounds). Remove visible debris. Apply topical antibiotic (bacitracin preferred over neomycin — fewer allergic reactions). For deep contaminated wounds: prophylactic antibiotics — Amoxicillin-Clavulanate 875/125mg PO twice daily. Alternative for PENICILLIN ALLERGY: Clindamycin 300mg PO QID + Ciprofloxacin 500mg PO BID. Tetanus prophylaxis if last booster >5 years ago. Suture only clean wounds <6 hours old.",
            "metadata": {"category": "MEDICAL", "priority_level": "DELAYED", "contraindications": ["penicillin"], "zone": "Sector_4", "equipment_available": True},
        },
        {
            "title": "Hypothermia Treatment Protocol",
            "content": "Hypothermia management by severity: Mild (32-35°C): passive external rewarming — remove wet clothing, warm blankets, warm environment. Moderate (28-32°C): active external rewarming — heated blankets, warm IV fluids (38-42°C). Severe (<28°C): active core rewarming — warmed humidified oxygen, warm IV fluids, warm peritoneal lavage if available. Handle hypothermic patients GENTLY — rough handling can trigger ventricular fibrillation. Do NOT give warm drinks to unconscious patients. Do NOT rub extremities. Cardiac rhythm may show Osborn (J) waves — do NOT treat arrhythmias until core temp >30°C.",
            "metadata": {"category": "MEDICAL", "priority_level": "DELAYED", "contraindications": [], "zone": "Sector_6", "equipment_available": True},
        },
        {
            "title": "Tourniquets and Hemorrhage Control",
            "content": "Hemorrhage control protocol (MARCH): Massive hemorrhage first. Apply commercial tourniquet (CAT or SOF-T) 2-3 inches above wound. Tighten until bleeding stops. Note time of application. Do NOT remove tourniquet in field — risk of reperfusion injury and cardiovascular collapse. For junctional hemorrhage (groin, axilla, neck): use hemostatic gauze (QuikClot Combat Gauze or Celox) packed tightly into wound with sustained pressure for minimum 3 minutes. Pelvic binder for suspected pelvic fracture with hemorrhage. Target: systolic BP 80-90 mmHg (permissive hypotension) until surgical care available.",
            "metadata": {"category": "MEDICAL", "priority_level": "IMMEDIATE", "contraindications": [], "zone": "Sector_5", "equipment_available": True, "equipment_required": ["CAT Tourniquet", "Combat Gauze", "Pelvic Binder"]},
        },
        {
            "title": "SALT Mass Casualty Triage Protocol",
            "content": "Sort, Assess, Lifesaving, Treatment/Transport (SALT): Step 1 SORT: Direct all walking wounded to designated area. Ask remaining patients to wave/follow commands. Those with purposeful movement → assess second. Still/obvious life threats → assess first. Step 2 ASSESS: Check for obstructed airway, severe hemorrhage, shock. Step 3 LIFESAVING: Only 3 interventions allowed during triage — open airway, apply tourniquet/pressure, auto-injector. Step 4 CATEGORIZE: Dead, Expectant, Immediate, Delayed, Minimal. Document on triage tag. Review categories every 30 min as resources allow.",
            "metadata": {"category": "MEDICAL", "priority_level": "IMMEDIATE", "contraindications": [], "zone": "Sector_1", "equipment_available": True},
        },
        {
            "title": "Pediatric Triage Considerations",
            "content": "JumpSTART pediatric triage (age 1-8): Differs from adult START: Step 1: Walking → MINOR. Step 2: Breathing? If not breathing, give 5 rescue breaths. If breathing resumes → IMMEDIATE. If no response → EXPECTANT. Step 3: Respiratory rate <15 or >45 → IMMEDIATE. Step 4: Palpable pulse? No → EXPECTANT. Yes → check AVPU: P or U → IMMEDIATE, A or V → DELAYED. Key differences from adult: Lower weight means faster drug absorption — reduce all medication doses by weight. Use Broselow tape for weight estimation. IV access: intraosseous if peripheral IV fails after 2 attempts or 90 seconds.",
            "metadata": {"category": "MEDICAL", "priority_level": "IMMEDIATE", "contraindications": [], "zone": "Sector_2", "equipment_available": True},
        },
    ]

    for proto in protocols:
        content = proto["content"]
        vector = embed_text(content)
        doc = Document(
            id=str(uuid.uuid4()),
            content=content,
            title=proto["title"],
            vector=vector,
            metadata=proto["metadata"],
            data_type="TEXT",
            collection="protocols",
        )
        store.insert(doc)


def seed_inventory() -> None:
    """Seed equipment inventory."""
    items = [
        {"name": "Level A Hazmat Suit", "category": "PPE", "quantity": 8, "zone": "Sector_1"},
        {"name": "Level B Hazmat Suit", "category": "PPE", "quantity": 15, "zone": "Sector_1"},
        {"name": "SCBA Respirator", "category": "PPE", "quantity": 12, "zone": "Sector_1"},
        {"name": "CAT Tourniquet", "category": "Medical", "quantity": 35, "zone": "Sector_2"},
        {"name": "Combat Gauze (QuikClot)", "category": "Medical", "quantity": 20, "zone": "Sector_2"},
        {"name": "Epinephrine Auto-Injector", "category": "Medical", "quantity": 10, "zone": "Sector_3"},
        {"name": "IV Start Kit", "category": "Medical", "quantity": 30, "zone": "Sector_2"},
        {"name": "Normal Saline 1L", "category": "Medical", "quantity": 25, "zone": "Sector_2"},
        {"name": "Burn Dressing Kit", "category": "Medical", "quantity": 3, "zone": "Sector_3"},
        {"name": "Cervical Collar", "category": "Medical", "quantity": 10, "zone": "Sector_4"},
        {"name": "Backboard", "category": "Medical", "quantity": 6, "zone": "Sector_4"},
        {"name": "Portable Oxygen Tank", "category": "Medical", "quantity": 4, "zone": "Sector_1"},
        {"name": "Chemical Splash Goggles", "category": "PPE", "quantity": 20, "zone": "Sector_3"},
        {"name": "Decontamination Tent", "category": "Tool", "quantity": 2, "zone": "Sector_1"},
        {"name": "Radiation Dosimeter", "category": "Tool", "quantity": 15, "zone": "Sector_7"},
        {"name": "KI Tablets (Potassium Iodide)", "category": "Medical", "quantity": 50, "zone": "Sector_7"},
        {"name": "Pelvic Binder", "category": "Medical", "quantity": 4, "zone": "Sector_5"},
        {"name": "Amoxicillin 875mg", "category": "Medical", "quantity": 40, "zone": "Sector_2"},
        {"name": "Ciprofloxacin 500mg", "category": "Medical", "quantity": 30, "zone": "Sector_2"},
        {"name": "Morphine 10mg/mL", "category": "Medical", "quantity": 2, "zone": "Sector_3"},
        {"name": "Penicillin V 500mg", "category": "Medical", "quantity": 25, "zone": "Sector_2"},
        {"name": "Triage Tags (SET)", "category": "Tool", "quantity": 100, "zone": "Sector_1"},
        {"name": "AFFF Foam (5gal)", "category": "Tool", "quantity": 3, "zone": "Sector_6"},
        {"name": "Portable Berms", "category": "Tool", "quantity": 6, "zone": "Sector_1"},
    ]

    for item in items:
        desc = f"{item['name']} — {item['category']} supply located in {item['zone']}. Quantity: {item['quantity']}."
        vector = embed_text(desc)
        doc = Document(
            id=str(uuid.uuid4()),
            content=desc,
            title=item["name"],
            vector=vector,
            metadata={
                "category": item["category"],
                "quantity": item["quantity"],
                "zone": item["zone"],
            },
            data_type="TEXT",
            collection="inventory",
        )
        store.insert(doc)


def seed_sample_field_data() -> None:
    """Seed some sample field data to pre-populate the dashboard."""
    field_reports = [
        {
            "title": "Drone Recon — Sector 3 Chemical Plant",
            "content": "Aerial reconnaissance showing damaged chemical storage facility. Multiple barrels overturned, visible liquid pooling. Orange hazard diamonds on containers. Structural damage to western wall with partial roof collapse. Two personnel visible near staging area.",
            "data_type": "PHOTO",
            "metadata": {"zone": "Sector_3", "reporter": "Drone-Alpha", "priority_level": "IMMEDIATE"},
        },
        {
            "title": "Audio Report — Medic Team Bravo",
            "content": "This is field medic Bravo-3. We have two casualties at the chemical plant in Sector 3. Patient 1: male, approximately 40 years old, second-degree chemical burns on both forearms and face. Patient is conscious and alert. Reports penicillin allergy. Patient 2: female, 30s, inhalation exposure, coughing, mild respiratory distress. Both patients ambulatory. Requesting burn treatment supplies and decontamination setup. Over.",
            "data_type": "AUDIO",
            "metadata": {"zone": "Sector_3", "reporter": "Medic-Bravo-3", "priority_level": "IMMEDIATE", "transcript": "This is field medic Bravo-3..."},
        },
        {
            "title": "Situation Report — Sector 5 Structural Collapse",
            "content": "Building collapse at intersection of Main and 5th. Three-story residential structure, pancake collapse. Estimated 12-15 occupants based on neighbor reports. K9 unit detected 3 live victims in southeast corner. Heavy rescue equipment en route. Power lines down — utility company notified. Gas meter shows no active leaks. Command post established at north parking lot.",
            "data_type": "TEXT",
            "metadata": {"zone": "Sector_5", "reporter": "IC-Command", "priority_level": "IMMEDIATE"},
        },
        {
            "title": "Drone Recon — Sector 2 Flood Zone",
            "content": "Aerial view of flooded residential area in Sector 2. Water level approximately 4 feet. Multiple vehicles submerged. Two residents visible on second-floor balcony requesting evacuation. Power lines partially submerged. Access road from the north is passable with high-clearance vehicles only.",
            "data_type": "PHOTO",
            "metadata": {"zone": "Sector_2", "reporter": "Drone-Beta", "priority_level": "DELAYED"},
        },
        {
            "title": "Audio Report — Rescue Unit 7",
            "content": "Rescue Unit 7 checking in from Sector 5. We've extracted one victim from the rubble — male, approximately 55, crush injury to right leg, trapped for estimated 3 hours. IV access established, normal saline bolus administered. Requesting crush syndrome protocol and continuous cardiac monitoring. Patient is conscious but confused. Second victim located but still pinned — need heavylift airbags.",
            "data_type": "AUDIO",
            "metadata": {"zone": "Sector_5", "reporter": "Rescue-7", "priority_level": "IMMEDIATE"},
        },
    ]

    for report in field_reports:
        content = report["content"]
        vector = embed_text(content)
        doc = Document(
            id=str(uuid.uuid4()),
            content=content,
            title=report["title"],
            vector=vector,
            metadata=report["metadata"],
            data_type=report["data_type"],
            collection="field_data",
        )
        store.insert(doc)
