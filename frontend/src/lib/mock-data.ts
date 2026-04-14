/* ──────────────────────────────────────────────
   RescueNode Zero — Mock Data for UI Development
   ────────────────────────────────────────────── */

import type { SearchResultItem, InventoryItem } from "./types";

export const MOCK_SEARCH_RESULTS: SearchResultItem[] = [
  {
    id: "proto-001",
    score: 0.9412,
    title: "HAZMAT Protocol: UN-1090 Acetone",
    content_preview:
      "UN-1090 Acetone — Flammable liquid, Class 3. For chemical burns, immediately flush affected area with copious amounts of water for minimum 20 minutes. Remove contaminated clothing. Required PPE: Level A Suit, SCBA.",
    data_type: "TEXT",
    source: "protocols",
    metadata: {
      category: "HAZMAT",
      un_code: "UN-1090",
      priority_level: "IMMEDIATE",
      equipment_required: ["Level A Suit", "SCBA", "Chemical Splash Goggles"],
    },
    match_type: "fused",
  },
  {
    id: "field-001",
    score: 0.8734,
    title: "Drone Recon — Sector 3 Chemical Plant",
    content_preview:
      "Aerial reconnaissance showing damaged chemical storage facility. Multiple barrels overturned, visible liquid pooling. Orange hazard diamonds on containers.",
    data_type: "PHOTO",
    source: "field_data",
    metadata: {
      zone: "Sector_3",
      reporter: "Drone-Alpha",
      priority_level: "IMMEDIATE",
    },
    match_type: "fused",
  },
  {
    id: "field-002",
    score: 0.8521,
    title: "Audio Report — Medic Team Bravo",
    content_preview:
      "This is field medic Bravo-3. We have two casualties at the chemical plant in Sector 3. Patient 1: male, approximately 40 years old, second-degree chemical burns on both forearms and face. Reports penicillin allergy.",
    data_type: "AUDIO",
    source: "field_data",
    metadata: {
      zone: "Sector_3",
      reporter: "Medic-Bravo-3",
      priority_level: "IMMEDIATE",
      transcript: "This is field medic Bravo-3...",
    },
    match_type: "fused",
  },
  {
    id: "proto-002",
    score: 0.8103,
    title: "Chemical Burn Treatment Protocol",
    content_preview:
      "Chemical burn treatment: FIRST priority is copious water irrigation — minimum 20 minutes continuous flushing. Remove all contaminated clothing while irrigating. If penicillin-based antibiotics are indicated, verify NO penicillin allergy first.",
    data_type: "TEXT",
    source: "protocols",
    metadata: {
      category: "MEDICAL",
      priority_level: "IMMEDIATE",
      contraindications: ["penicillin"],
    },
    match_type: "fused",
  },
  {
    id: "proto-003",
    score: 0.7856,
    title: "Burn Treatment Protocol — Thermal Burns",
    content_preview:
      "Thermal burn treatment by severity: First degree (superficial) — cool running water 10-20 minutes. Second degree (partial thickness) — sterile non-adherent dressing. Third degree — IV fluid resuscitation per Parkland formula.",
    data_type: "TEXT",
    source: "protocols",
    metadata: {
      category: "MEDICAL",
      priority_level: "IMMEDIATE",
    },
    match_type: "semantic",
  },
  {
    id: "proto-004",
    score: 0.6912,
    title: "HAZMAT Protocol: UN-1830 Sulfuric Acid",
    content_preview:
      "UN-1830 Sulfuric Acid — Corrosive liquid, Class 8. For skin contact: brush off excess, then flush with large quantities of water for 30+ minutes. Do NOT use baking soda to neutralize.",
    data_type: "TEXT",
    source: "protocols",
    metadata: {
      category: "HAZMAT",
      un_code: "UN-1830",
      priority_level: "IMMEDIATE",
      equipment_required: ["Level A Suit", "Acid-Resistant Gloves"],
    },
    match_type: "keyword",
  },
  {
    id: "proto-005",
    score: 0.6234,
    title: "Wound Care — Infection Prevention (PENICILLIN)",
    content_preview:
      "For deep contaminated wounds: prophylactic antibiotics — Amoxicillin-Clavulanate 875/125mg PO. Alternative for PENICILLIN ALLERGY: Clindamycin 300mg QID + Ciprofloxacin 500mg BID.",
    data_type: "TEXT",
    source: "protocols",
    metadata: {
      category: "MEDICAL",
      priority_level: "DELAYED",
      contraindications: ["penicillin"],
    },
    match_type: "keyword",
  },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: "inv-01", name: "Level A Hazmat Suit", category: "PPE", quantity: 8, zone: "Sector_1" },
  { id: "inv-02", name: "SCBA Respirator", category: "PPE", quantity: 12, zone: "Sector_1" },
  { id: "inv-03", name: "CAT Tourniquet", category: "Medical", quantity: 35, zone: "Sector_2" },
  { id: "inv-04", name: "Burn Dressing Kit", category: "Medical", quantity: 3, zone: "Sector_3" },
  { id: "inv-05", name: "Epinephrine Auto-Injector", category: "Medical", quantity: 10, zone: "Sector_3" },
  { id: "inv-06", name: "IV Start Kit", category: "Medical", quantity: 30, zone: "Sector_2" },
  { id: "inv-07", name: "Normal Saline 1L", category: "Medical", quantity: 25, zone: "Sector_2" },
  { id: "inv-08", name: "Morphine 10mg/mL", category: "Medical", quantity: 2, zone: "Sector_3" },
  { id: "inv-09", name: "Portable O₂ Tank", category: "Medical", quantity: 4, zone: "Sector_1" },
  { id: "inv-10", name: "Radiation Dosimeter", category: "Tool", quantity: 15, zone: "Sector_7" },
  { id: "inv-11", name: "Decon Tent", category: "Tool", quantity: 2, zone: "Sector_1" },
  { id: "inv-12", name: "Penicillin V 500mg", category: "Medical", quantity: 25, zone: "Sector_2" },
  { id: "inv-13", name: "Ciprofloxacin 500mg", category: "Medical", quantity: 30, zone: "Sector_2" },
  { id: "inv-14", name: "Combat Gauze", category: "Medical", quantity: 20, zone: "Sector_2" },
  { id: "inv-15", name: "Triage Tags", category: "Tool", quantity: 100, zone: "Sector_1" },
];
