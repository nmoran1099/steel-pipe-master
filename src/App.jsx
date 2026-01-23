import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// STEEL PIPE MASTER - PROFESSIONAL EDITION WITH LEARNING PATHS
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING PATHS DATA
// ═══════════════════════════════════════════════════════════════════════════════

const KNOWLEDGE_DEPTHS = {
  1: { label: 'Awareness', description: 'Basic recognition and understanding of terms', color: '#94a3b8' },
  2: { label: 'Familiarity', description: 'Can identify and explain concepts when encountered', color: '#60a5fa' },
  3: { label: 'Working Knowledge', description: 'Can apply concepts independently in routine situations', color: '#34d399' },
  4: { label: 'Proficiency', description: 'Deep understanding; can troubleshoot and advise others', color: '#a78bfa' },
  5: { label: 'Expert', description: 'Comprehensive mastery; can train others and handle edge cases', color: '#f59e0b' },
};

const COMPETENCY_CATEGORIES = {
  productKnowledge: {
    id: 'productKnowledge',
    name: 'Product Knowledge',
    icon: '📦',
    competencies: [
      { id: 'pipe-types', name: 'Pipe Types & Materials', description: 'Carbon steel, stainless, alloy identification' },
      { id: 'pipe-sizing', name: 'Pipe Sizing (NPS/DN)', description: 'Nominal pipe sizes, metric equivalents' },
      { id: 'schedules', name: 'Schedules & Wall Thickness', description: 'SCH 40, 80, STD, XS relationships' },
      { id: 'end-finishes', name: 'End Finishes', description: 'PE, BE, T&C options and applications' },
      { id: 'coatings', name: 'Coatings & Linings', description: 'FBE, galvanized, bare specifications' },
      { id: 'fittings', name: 'Fittings & Flanges', description: 'Elbows, tees, reducers, flange types' },
      { id: 'valves', name: 'Valves', description: 'Gate, ball, check, butterfly identification' },
    ],
  },
  specifications: {
    id: 'specifications',
    name: 'Specifications & Standards',
    icon: '📋',
    competencies: [
      { id: 'astm-standards', name: 'ASTM Standards', description: 'A53, A106, A500 specifications' },
      { id: 'api-standards', name: 'API Standards', description: 'API 5L, 5CT pipe specifications' },
      { id: 'grade-marks', name: 'Grade Markings', description: 'Reading and interpreting pipe markings' },
      { id: 'mtrs', name: 'Mill Test Reports', description: 'Understanding and verifying MTRs' },
      { id: 'certifications', name: 'Certifications', description: 'Domestic vs import, compliance docs' },
    ],
  },
  itemCodes: {
    id: 'itemCodes',
    name: 'Item Code System',
    icon: '🏷️',
    competencies: [
      { id: 'code-structure', name: 'Code Structure', description: 'Understanding digit positions and meanings' },
      { id: 'origin-codes', name: 'Origin Codes', description: 'Domestic/import, black/galvanized' },
      { id: 'size-codes', name: 'Size Codes', description: 'NPS to code number translation' },
      { id: 'code-lookup', name: 'Code Lookup', description: 'Finding items by code in system' },
      { id: 'code-creation', name: 'Code Creation', description: 'Building codes for new items' },
    ],
  },
  operations: {
    id: 'operations',
    name: 'Operations & Logistics',
    icon: '🚛',
    competencies: [
      { id: 'weight-calc', name: 'Weight Calculations', description: 'Calculating weights per foot and total' },
      { id: 'load-planning', name: 'Load Planning', description: 'Truck capacity, weight distribution' },
      { id: 'material-handling', name: 'Material Handling', description: 'Safe lifting, storage, staging' },
      { id: 'inventory-systems', name: 'Inventory Systems', description: 'Locating and counting stock' },
      { id: 'receiving', name: 'Receiving Procedures', description: 'Inspection, verification, put-away' },
      { id: 'shipping', name: 'Shipping Procedures', description: 'Picking, staging, documentation' },
    ],
  },
  sales: {
    id: 'sales',
    name: 'Sales & Customer Service',
    icon: '💼',
    competencies: [
      { id: 'order-entry', name: 'Order Entry', description: 'Processing orders accurately' },
      { id: 'pricing', name: 'Pricing & Quoting', description: 'Base pricing, markups, discounts' },
      { id: 'availability', name: 'Availability Checking', description: 'Stock checks, lead times, alternatives' },
      { id: 'customer-needs', name: 'Needs Assessment', description: 'Understanding project requirements' },
      { id: 'product-recommend', name: 'Product Recommendations', description: 'Suggesting appropriate materials' },
      { id: 'objection-handling', name: 'Objection Handling', description: 'Addressing concerns and alternatives' },
    ],
  },
  estimating: {
    id: 'estimating',
    name: 'Estimating & Projects',
    icon: '📐',
    competencies: [
      { id: 'takeoffs', name: 'Material Takeoffs', description: 'Reading drawings, counting materials' },
      { id: 'bid-prep', name: 'Bid Preparation', description: 'Compiling quotes, pricing packages' },
      { id: 'project-specs', name: 'Project Specifications', description: 'Interpreting spec requirements' },
      { id: 'substitutions', name: 'Substitutions', description: 'Identifying equivalent materials' },
      { id: 'waste-factors', name: 'Waste Factors', description: 'Adding appropriate allowances' },
      { id: 'lead-times', name: 'Lead Time Estimation', description: 'Mill orders, special items timing' },
    ],
  },
  safety: {
    id: 'safety',
    name: 'Safety & Compliance',
    icon: '⚠️',
    competencies: [
      { id: 'ppe', name: 'PPE Requirements', description: 'Personal protective equipment' },
      { id: 'lifting-safety', name: 'Lifting Safety', description: 'Proper techniques, equipment use' },
      { id: 'storage-safety', name: 'Storage Safety', description: 'Stacking, securing materials' },
      { id: 'dot-regs', name: 'DOT Regulations', description: 'Transportation compliance' },
      { id: 'hazmat', name: 'Hazmat Awareness', description: 'Coatings, chemicals, disposal' },
    ],
  },
};

const LEARNING_PATHS = {
  yardDriver: {
    id: 'yardDriver',
    name: 'Yard / Driver',
    icon: '🚛',
    color: '#059669',
    description: 'Material handlers, forklift operators, and delivery drivers responsible for physical inventory management and transportation.',
    overview: {
      focus: 'Physical product identification, safe handling, and accurate inventory operations',
      keyOutcome: 'Can independently identify, locate, handle, and deliver pipe products safely and accurately',
      typicalTimeline: '4-6 weeks',
    },
    competencyRequirements: {
      productKnowledge: { 'pipe-types': 3, 'pipe-sizing': 4, 'schedules': 3, 'end-finishes': 3, 'coatings': 2, 'fittings': 2, 'valves': 1 },
      specifications: { 'astm-standards': 1, 'api-standards': 1, 'grade-marks': 3, 'mtrs': 1, 'certifications': 1 },
      itemCodes: { 'code-structure': 3, 'origin-codes': 3, 'size-codes': 4, 'code-lookup': 4, 'code-creation': 1 },
      operations: { 'weight-calc': 4, 'load-planning': 4, 'material-handling': 5, 'inventory-systems': 4, 'receiving': 4, 'shipping': 4 },
      sales: { 'order-entry': 1, 'pricing': 1, 'availability': 2, 'customer-needs': 1, 'product-recommend': 1, 'objection-handling': 1 },
      estimating: { 'takeoffs': 1, 'bid-prep': 1, 'project-specs': 1, 'substitutions': 1, 'waste-factors': 1, 'lead-times': 1 },
      safety: { 'ppe': 5, 'lifting-safety': 5, 'storage-safety': 5, 'dot-regs': 4, 'hazmat': 3 },
    },
    lessonSequence: [
      { phase: 1, phaseName: 'Safety Foundation', phaseDescription: 'Essential safety training before any material handling', duration: '5 days', lessons: [
        { id: 'YD-101', name: 'PPE Requirements & Proper Use', duration: '2 hours', type: 'required', passingScore: 100 },
        { id: 'YD-102', name: 'Safe Lifting Techniques', duration: '3 hours', type: 'required', passingScore: 100 },
        { id: 'YD-103', name: 'Forklift & Crane Safety', duration: '8 hours', type: 'required', passingScore: 90 },
        { id: 'YD-104', name: 'Pipe Storage & Stacking', duration: '2 hours', type: 'required', passingScore: 100 },
        { id: 'YD-105', name: 'Hazard Recognition', duration: '2 hours', type: 'required', passingScore: 85 },
      ]},
      { phase: 2, phaseName: 'Product Identification', phaseDescription: 'Learning to identify pipe products visually and by marking', duration: '5 days', lessons: [
        { id: 'YD-201', name: 'Pipe Sizing Fundamentals', duration: '3 hours', type: 'required', passingScore: 85 },
        { id: 'YD-202', name: 'Measuring Pipe Accurately', duration: '2 hours', type: 'required', passingScore: 90 },
        { id: 'YD-203', name: 'Reading Pipe Markings', duration: '3 hours', type: 'required', passingScore: 80 },
        { id: 'YD-204', name: 'Pipe Types Visual ID', duration: '2 hours', type: 'required', passingScore: 85 },
        { id: 'YD-205', name: 'End Finishes Recognition', duration: '1 hour', type: 'required', passingScore: 85 },
        { id: 'YD-206', name: 'Schedules & Wall Thickness', duration: '2 hours', type: 'required', passingScore: 80 },
      ]},
      { phase: 3, phaseName: 'Item Code System', phaseDescription: 'Master the internal item coding system', duration: '4 days', lessons: [
        { id: 'YD-301', name: 'Item Code Structure', duration: '2 hours', type: 'required', passingScore: 85 },
        { id: 'YD-302', name: 'Origin & Finish Codes', duration: '2 hours', type: 'required', passingScore: 90 },
        { id: 'YD-303', name: 'Size Code Mastery', duration: '3 hours', type: 'required', passingScore: 90 },
        { id: 'YD-304', name: 'System Lookup Practice', duration: '2 hours', type: 'required', passingScore: 85 },
      ]},
      { phase: 4, phaseName: 'Warehouse Operations', phaseDescription: 'Receiving, shipping, and inventory procedures', duration: '5 days', lessons: [
        { id: 'YD-401', name: 'Weight Calculations', duration: '3 hours', type: 'required', passingScore: 85 },
        { id: 'YD-402', name: 'Receiving Procedures', duration: '3 hours', type: 'required', passingScore: 90 },
        { id: 'YD-403', name: 'Inventory Location System', duration: '2 hours', type: 'required', passingScore: 85 },
        { id: 'YD-404', name: 'Order Picking', duration: '3 hours', type: 'required', passingScore: 90 },
        { id: 'YD-405', name: 'Cycle Counting', duration: '2 hours', type: 'required', passingScore: 85 },
      ]},
    ],
    certification: { name: 'Certified Yard/Driver Specialist', badge: '🏆', requirements: { minimumAccuracy: 85, minimumStreak: 5, timeInRole: '30 days' }},
  },
  insideSales: {
    id: 'insideSales',
    name: 'Inside Sales',
    icon: '📞',
    color: '#2563eb',
    description: 'Counter sales, phone orders, and customer service representatives who process orders and assist walk-in/call-in customers.',
    overview: {
      focus: 'Rapid product identification, accurate order processing, and effective customer communication',
      keyOutcome: 'Can efficiently process orders, answer product questions, and provide alternatives when items are unavailable',
      typicalTimeline: '6-8 weeks',
    },
    competencyRequirements: {
      productKnowledge: { 'pipe-types': 4, 'pipe-sizing': 5, 'schedules': 4, 'end-finishes': 4, 'coatings': 3, 'fittings': 4, 'valves': 3 },
      specifications: { 'astm-standards': 3, 'api-standards': 2, 'grade-marks': 3, 'mtrs': 3, 'certifications': 3 },
      itemCodes: { 'code-structure': 4, 'origin-codes': 4, 'size-codes': 5, 'code-lookup': 5, 'code-creation': 2 },
      operations: { 'weight-calc': 3, 'load-planning': 2, 'material-handling': 1, 'inventory-systems': 4, 'receiving': 2, 'shipping': 3 },
      sales: { 'order-entry': 5, 'pricing': 4, 'availability': 5, 'customer-needs': 4, 'product-recommend': 4, 'objection-handling': 3 },
      estimating: { 'takeoffs': 2, 'bid-prep': 2, 'project-specs': 2, 'substitutions': 4, 'waste-factors': 2, 'lead-times': 3 },
      safety: { 'ppe': 2, 'lifting-safety': 2, 'storage-safety': 1, 'dot-regs': 2, 'hazmat': 2 },
    },
    lessonSequence: [
      { phase: 1, phaseName: 'Product Foundations', phaseDescription: 'Build comprehensive product knowledge base', duration: '10 days', lessons: [
        { id: 'IS-101', name: 'Steel Pipe Overview', duration: '3 hours', type: 'required', passingScore: 85 },
        { id: 'IS-102', name: 'Pipe Sizing Mastery', duration: '4 hours', type: 'required', passingScore: 90 },
        { id: 'IS-103', name: 'Schedules Deep Dive', duration: '3 hours', type: 'required', passingScore: 85 },
        { id: 'IS-104', name: 'End Preparations', duration: '2 hours', type: 'required', passingScore: 85 },
        { id: 'IS-105', name: 'Coatings & Protection', duration: '2 hours', type: 'required', passingScore: 80 },
        { id: 'IS-106', name: 'Fittings Fundamentals', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'IS-107', name: 'Valve Basics', duration: '2 hours', type: 'required', passingScore: 80 },
      ]},
      { phase: 2, phaseName: 'Specifications & Standards', phaseDescription: 'Understanding industry standards and documentation', duration: '5 days', lessons: [
        { id: 'IS-201', name: 'ASTM Specifications', duration: '3 hours', type: 'required', passingScore: 80 },
        { id: 'IS-202', name: 'API Standards Overview', duration: '2 hours', type: 'required', passingScore: 75 },
        { id: 'IS-203', name: 'Reading Mill Markings', duration: '2 hours', type: 'required', passingScore: 85 },
        { id: 'IS-204', name: 'Mill Test Reports', duration: '2 hours', type: 'required', passingScore: 80 },
        { id: 'IS-205', name: 'Domestic vs Import', duration: '2 hours', type: 'required', passingScore: 85 },
      ]},
      { phase: 3, phaseName: 'Item Code Mastery', phaseDescription: 'Complete mastery of the item coding system', duration: '5 days', lessons: [
        { id: 'IS-301', name: 'Item Code Structure', duration: '2 hours', type: 'required', passingScore: 90 },
        { id: 'IS-302', name: 'Origin & Type Codes', duration: '2 hours', type: 'required', passingScore: 95 },
        { id: 'IS-303', name: 'Size Code Speed Drills', duration: '4 hours', type: 'required', passingScore: 90 },
        { id: 'IS-304', name: 'Advanced Code Lookup', duration: '3 hours', type: 'required', passingScore: 90 },
      ]},
      { phase: 4, phaseName: 'Sales Operations', phaseDescription: 'Core order processing and customer service skills', duration: '10 days', lessons: [
        { id: 'IS-401', name: 'Order Entry Fundamentals', duration: '4 hours', type: 'required', passingScore: 90 },
        { id: 'IS-402', name: 'Order Entry Advanced', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'IS-403', name: 'Pricing & Quoting', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'IS-404', name: 'Inventory Availability', duration: '3 hours', type: 'required', passingScore: 90 },
        { id: 'IS-405', name: 'Customer Needs Assessment', duration: '3 hours', type: 'required', passingScore: 80 },
        { id: 'IS-406', name: 'Product Recommendations', duration: '3 hours', type: 'required', passingScore: 80 },
        { id: 'IS-407', name: 'Substitutions & Alternatives', duration: '3 hours', type: 'required', passingScore: 85 },
        { id: 'IS-408', name: 'Handling Objections', duration: '2 hours', type: 'required', passingScore: 75 },
      ]},
    ],
    certification: { name: 'Certified Inside Sales Specialist', badge: '🎯', requirements: { minimumAccuracy: 85, minimumStreak: 7, timeInRole: '45 days' }},
  },
  outsideSales: {
    id: 'outsideSales',
    name: 'Outside Sales',
    icon: '🤝',
    color: '#7c3aed',
    description: 'Field sales representatives who visit customers, develop relationships, and manage accounts in assigned territories.',
    overview: {
      focus: 'Deep product expertise, consultative selling, and strategic account management',
      keyOutcome: 'Can serve as trusted advisor to customers, solve complex material challenges, and grow territory revenue',
      typicalTimeline: '10-12 weeks',
    },
    competencyRequirements: {
      productKnowledge: { 'pipe-types': 5, 'pipe-sizing': 5, 'schedules': 5, 'end-finishes': 5, 'coatings': 4, 'fittings': 5, 'valves': 4 },
      specifications: { 'astm-standards': 4, 'api-standards': 4, 'grade-marks': 4, 'mtrs': 4, 'certifications': 5 },
      itemCodes: { 'code-structure': 4, 'origin-codes': 4, 'size-codes': 4, 'code-lookup': 4, 'code-creation': 3 },
      operations: { 'weight-calc': 4, 'load-planning': 3, 'material-handling': 2, 'inventory-systems': 3, 'receiving': 2, 'shipping': 3 },
      sales: { 'order-entry': 3, 'pricing': 5, 'availability': 4, 'customer-needs': 5, 'product-recommend': 5, 'objection-handling': 5 },
      estimating: { 'takeoffs': 4, 'bid-prep': 4, 'project-specs': 4, 'substitutions': 5, 'waste-factors': 3, 'lead-times': 4 },
      safety: { 'ppe': 3, 'lifting-safety': 2, 'storage-safety': 2, 'dot-regs': 2, 'hazmat': 2 },
    },
    lessonSequence: [
      { phase: 1, phaseName: 'Inside Sales Foundation', phaseDescription: 'Complete all Inside Sales training first', duration: '20 days', lessons: [
        { id: 'OS-100', name: 'Inside Sales Curriculum', duration: '80 hours', type: 'required', passingScore: 85, prerequisite: 'Complete Inside Sales certification' },
      ]},
      { phase: 2, phaseName: 'Advanced Product Expertise', phaseDescription: 'Expert-level product knowledge for consultative selling', duration: '10 days', lessons: [
        { id: 'OS-201', name: 'Pipe Metallurgy', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'OS-202', name: 'Application Engineering', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'OS-203', name: 'Advanced Coatings & Linings', duration: '3 hours', type: 'required', passingScore: 80 },
        { id: 'OS-204', name: 'Valve Selection Mastery', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'OS-205', name: 'Complete Fitting Solutions', duration: '4 hours', type: 'required', passingScore: 85 },
      ]},
      { phase: 3, phaseName: 'Consultative Selling', phaseDescription: 'Advanced sales techniques for field success', duration: '10 days', lessons: [
        { id: 'OS-401', name: 'Needs Discovery Techniques', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'OS-402', name: 'Solution Selling', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'OS-403', name: 'Price Negotiation', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'OS-404', name: 'Competitive Positioning', duration: '3 hours', type: 'required', passingScore: 80 },
        { id: 'OS-405', name: 'Substitution Strategy', duration: '3 hours', type: 'required', passingScore: 85 },
      ]},
      { phase: 4, phaseName: 'Field Excellence', phaseDescription: 'Territory management and customer relationships', duration: '10 days', lessons: [
        { id: 'OS-601', name: 'Territory Planning', duration: '3 hours', type: 'required', passingScore: 80 },
        { id: 'OS-602', name: 'Jobsite Visits', duration: '3 hours', type: 'required', passingScore: 85 },
        { id: 'OS-603', name: 'Account Development', duration: '4 hours', type: 'required', passingScore: 80 },
        { id: 'OS-604', name: 'New Account Acquisition', duration: '4 hours', type: 'required', passingScore: 80 },
      ]},
    ],
    certification: { name: 'Certified Outside Sales Professional', badge: '🏅', requirements: { minimumAccuracy: 85, minimumStreak: 10, timeInRole: '60 days', prerequisiteCert: 'insideSales' }},
  },
  projectEstimating: {
    id: 'projectEstimating',
    name: 'Project / Estimating',
    icon: '📐',
    color: '#dc2626',
    description: 'Estimators and project coordinators who perform takeoffs, prepare bids, manage project orders, and coordinate deliveries for large jobs.',
    overview: {
      focus: 'Precise material quantification, competitive bid preparation, and complex project coordination',
      keyOutcome: 'Can independently estimate projects from drawings, prepare winning bids, and coordinate material delivery to meet project schedules',
      typicalTimeline: '12-16 weeks',
    },
    competencyRequirements: {
      productKnowledge: { 'pipe-types': 5, 'pipe-sizing': 5, 'schedules': 5, 'end-finishes': 5, 'coatings': 5, 'fittings': 5, 'valves': 5 },
      specifications: { 'astm-standards': 5, 'api-standards': 4, 'grade-marks': 4, 'mtrs': 4, 'certifications': 5 },
      itemCodes: { 'code-structure': 4, 'origin-codes': 4, 'size-codes': 4, 'code-lookup': 4, 'code-creation': 4 },
      operations: { 'weight-calc': 5, 'load-planning': 4, 'material-handling': 2, 'inventory-systems': 4, 'receiving': 3, 'shipping': 4 },
      sales: { 'order-entry': 4, 'pricing': 5, 'availability': 5, 'customer-needs': 4, 'product-recommend': 4, 'objection-handling': 3 },
      estimating: { 'takeoffs': 5, 'bid-prep': 5, 'project-specs': 5, 'substitutions': 5, 'waste-factors': 5, 'lead-times': 5 },
      safety: { 'ppe': 2, 'lifting-safety': 2, 'storage-safety': 2, 'dot-regs': 3, 'hazmat': 2 },
    },
    lessonSequence: [
      { phase: 1, phaseName: 'Sales Foundation', phaseDescription: 'Complete Inside Sales training as foundation', duration: '20 days', lessons: [
        { id: 'PE-100', name: 'Inside Sales Curriculum', duration: '80 hours', type: 'required', passingScore: 85, prerequisite: 'Complete Inside Sales certification' },
      ]},
      { phase: 2, phaseName: 'Expert Product Knowledge', phaseDescription: 'Complete mastery of all product categories', duration: '10 days', lessons: [
        { id: 'PE-201', name: 'Complete Pipe Specifications', duration: '6 hours', type: 'required', passingScore: 90 },
        { id: 'PE-202', name: 'Complete Fitting Specifications', duration: '6 hours', type: 'required', passingScore: 90 },
        { id: 'PE-203', name: 'Complete Flange Specifications', duration: '4 hours', type: 'required', passingScore: 90 },
        { id: 'PE-204', name: 'Complete Valve Specifications', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'PE-205', name: 'Specialty Products', duration: '4 hours', type: 'required', passingScore: 85 },
      ]},
      { phase: 3, phaseName: 'Takeoff Mastery', phaseDescription: 'Complete material quantification skills', duration: '15 days', lessons: [
        { id: 'PE-401', name: 'Reading Piping Drawings', duration: '8 hours', type: 'required', passingScore: 85 },
        { id: 'PE-402', name: 'Pipe Takeoff Techniques', duration: '8 hours', type: 'required', passingScore: 90 },
        { id: 'PE-403', name: 'Fitting Takeoff Techniques', duration: '6 hours', type: 'required', passingScore: 90 },
        { id: 'PE-404', name: 'Waste Factor Application', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'PE-405', name: 'Weight Calculations', duration: '4 hours', type: 'required', passingScore: 90 },
        { id: 'PE-406', name: 'Takeoff Software', duration: '6 hours', type: 'required', passingScore: 85 },
      ]},
      { phase: 4, phaseName: 'Bid Preparation', phaseDescription: 'Creating competitive, winning bids', duration: '10 days', lessons: [
        { id: 'PE-501', name: 'Pricing Strategy', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'PE-502', name: 'Substitution Strategy', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'PE-503', name: 'Quote Compilation', duration: '6 hours', type: 'required', passingScore: 90 },
        { id: 'PE-504', name: 'Bid Package Preparation', duration: '6 hours', type: 'required', passingScore: 90 },
      ]},
      { phase: 5, phaseName: 'Project Coordination', phaseDescription: 'Managing won projects through delivery', duration: '15 days', lessons: [
        { id: 'PE-601', name: 'Lead Time Management', duration: '4 hours', type: 'required', passingScore: 90 },
        { id: 'PE-602', name: 'Inventory & Sourcing', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'PE-603', name: 'Project Order Entry', duration: '4 hours', type: 'required', passingScore: 90 },
        { id: 'PE-604', name: 'Delivery Scheduling', duration: '4 hours', type: 'required', passingScore: 85 },
        { id: 'PE-605', name: 'Change Order Management', duration: '4 hours', type: 'required', passingScore: 85 },
      ]},
    ],
    certification: { name: 'Certified Project Estimator', badge: '🎖️', requirements: { minimumAccuracy: 90, minimumStreak: 14, timeInRole: '90 days', prerequisiteCert: 'insideSales' }},
  },
};

const getTotalLessons = (roleId) => {
  const role = LEARNING_PATHS[roleId];
  if (!role) return 0;
  return role.lessonSequence.reduce((sum, phase) => sum + phase.lessons.length, 0);
};

const getTotalTrainingHours = (roleId) => {
  const role = LEARNING_PATHS[roleId];
  if (!role) return 0;
  return role.lessonSequence.reduce((sum, phase) => {
    return sum + phase.lessons.reduce((lessonSum, lesson) => {
      const hours = parseInt(lesson.duration);
      return lessonSum + (isNaN(hours) ? 0 : hours);
    }, 0);
  }, 0);
};

// ═══════════════════════════════════════════════════════════════════════════════
// ORIGINAL PIPE DATA
// ═══════════════════════════════════════════════════════════════════════════════

const PIPE_DATA = {
  sizes: [
    { nps: '1/8"', od: 0.405, dn: 6 }, { nps: '1/4"', od: 0.540, dn: 8 },
    { nps: '3/8"', od: 0.675, dn: 10 }, { nps: '1/2"', od: 0.840, dn: 15 },
    { nps: '3/4"', od: 1.050, dn: 20 }, { nps: '1"', od: 1.315, dn: 25 },
    { nps: '1-1/4"', od: 1.660, dn: 32 }, { nps: '1-1/2"', od: 1.900, dn: 40 },
    { nps: '2"', od: 2.375, dn: 50 }, { nps: '2-1/2"', od: 2.875, dn: 65 },
    { nps: '3"', od: 3.500, dn: 80 }, { nps: '4"', od: 4.500, dn: 100 },
    { nps: '6"', od: 6.625, dn: 150 }, { nps: '8"', od: 8.625, dn: 200 },
    { nps: '10"', od: 10.750, dn: 250 }, { nps: '12"', od: 12.750, dn: 300 },
  ],
  schedules: {
    '1/2"': { sch40: { wt: 0.109, lb: 0.85 }, sch80: { wt: 0.147, lb: 1.09 } },
    '3/4"': { sch40: { wt: 0.113, lb: 1.13 }, sch80: { wt: 0.154, lb: 1.47 } },
    '1"': { sch40: { wt: 0.133, lb: 1.68 }, sch80: { wt: 0.179, lb: 2.17 } },
    '2"': { sch40: { wt: 0.154, lb: 3.65 }, sch80: { wt: 0.218, lb: 5.02 } },
    '3"': { sch40: { wt: 0.216, lb: 7.58 }, sch80: { wt: 0.300, lb: 10.25 } },
    '4"': { sch40: { wt: 0.237, lb: 10.79 }, sch80: { wt: 0.337, lb: 14.98 } },
    '6"': { sch40: { wt: 0.280, lb: 18.97 }, sch80: { wt: 0.432, lb: 28.57 } },
    '8"': { sch40: { wt: 0.322, lb: 28.55 }, sch80: { wt: 0.500, lb: 43.39 } },
  },
  terminology: [
    { term: 'NPS', def: 'Nominal Pipe Size - Standard for designating pipe diameter', cat: 'sizing' },
    { term: 'DN', def: 'Diamètre Nominal - Metric equivalent to NPS in millimeters', cat: 'sizing' },
    { term: 'OD', def: 'Outside Diameter - Actual external measurement', cat: 'dimensions' },
    { term: 'ID', def: 'Inside Diameter - Internal measurement', cat: 'dimensions' },
    { term: 'WT', def: 'Wall Thickness - Thickness of the pipe wall', cat: 'dimensions' },
    { term: 'SCH', def: 'Schedule - Number designating wall thickness', cat: 'sizing' },
    { term: 'STD', def: 'Standard Weight - Equivalent to Schedule 40', cat: 'weight' },
    { term: 'XS', def: 'Extra Strong - Thicker than standard, like Sch 80', cat: 'weight' },
    { term: 'ERW', def: 'Electric Resistance Weld - Manufacturing method', cat: 'manufacturing' },
    { term: 'SMLS', def: 'Seamless - Pipe without welded seam', cat: 'manufacturing' },
    { term: 'PE', def: 'Plain End - Square-cut ends, no threading', cat: 'ends' },
    { term: 'BE', def: 'Beveled End - Prepared for butt welding', cat: 'ends' },
    { term: 'T&C', def: 'Threaded and Coupled - Threaded ends with coupling', cat: 'ends' },
    { term: 'SRL', def: 'Single Random Length - Typically 18-22 feet', cat: 'length' },
    { term: 'DRL', def: 'Double Random Length - Typically 35-45 feet', cat: 'length' },
    { term: 'FBE', def: 'Fusion Bonded Epoxy - Protective coating', cat: 'coating' },
    { term: 'PEB', def: 'Plain End Beveled - Cut square with beveled edge', cat: 'ends' },
    { term: 'DSAW', def: 'Double Submerged Arc Weld - Welding method for large pipe', cat: 'manufacturing' },
  ],
};

const ITEM_CODES = {
  firstDigit: [
    { code: '1', meaning: 'Domestic Black' },
    { code: '2', meaning: 'Domestic Galvanized' },
    { code: '3', meaning: 'Import Black' },
    { code: '4', meaning: 'Import Galvanized' },
    { code: '5', meaning: 'REMS' },
  ],
  pipeSizeCodes: [
    { size: '1/8"', code: '001' }, { size: '1/4"', code: '002' }, { size: '3/8"', code: '003' },
    { size: '1/2"', code: '004' }, { size: '3/4"', code: '006' }, { size: '1"', code: '010' },
    { size: '1-1/4"', code: '012' }, { size: '1-1/2"', code: '014' }, { size: '2"', code: '020' },
    { size: '2-1/2"', code: '024' }, { size: '3"', code: '030' }, { size: '3-1/2"', code: '034' },
    { size: '4"', code: '040' }, { size: '5"', code: '055' }, { size: '6"', code: '065' },
    { size: '8"', code: '085' }, { size: '10"', code: '106' }, { size: '12"', code: '126' },
    { size: '14"', code: '140' }, { size: '16"', code: '160' }, { size: '18"', code: '180' },
    { size: '20"', code: '200' }, { size: '22"', code: '220' }, { size: '24"', code: '240' },
    { size: '26"', code: '260' }, { size: '30"', code: '300' }, { size: '32"', code: '320' },
    { size: '36"', code: '360' }, { size: '42"', code: '420' }, { size: '48"', code: '480' },
  ],
};

const MOCK_USERS = [
  { id: '1', name: 'Michael Thompson', email: 'mthompson@acmepipe.com', company: 'Acme Piping Inc.', role: 'user', xp: 2450, streak: 12, bestStreak: 15, sessions: 28, questions: 245, accuracy: 87, lastActive: '2024-01-15', joined: '2023-11-01', certs: ['basics'], topicProgress: { itemcodes: 72, dimensions: 85, schedules: 68, terminology: 91, weight: 45 } },
  { id: '2', name: 'Sarah Chen', email: 'schen@industrialsupply.com', company: 'Industrial Supply Co.', role: 'user', xp: 3200, streak: 18, bestStreak: 22, sessions: 42, questions: 380, accuracy: 92, lastActive: '2024-01-15', joined: '2023-10-15', certs: ['basics', 'terminology'], topicProgress: { itemcodes: 88, dimensions: 95, schedules: 78, terminology: 100, weight: 62 } },
  { id: '3', name: 'James Wilson', email: 'jwilson@steelsolutions.com', company: 'Steel Solutions LLC', role: 'user', xp: 1800, streak: 5, bestStreak: 8, sessions: 19, questions: 165, accuracy: 78, lastActive: '2024-01-14', joined: '2023-12-01', certs: [], topicProgress: { itemcodes: 45, dimensions: 62, schedules: 55, terminology: 70, weight: 30 } },
  { id: '4', name: 'Emily Davis', email: 'edavis@pipelinecorp.com', company: 'Pipeline Corporation', role: 'user', xp: 4500, streak: 25, bestStreak: 25, sessions: 58, questions: 520, accuracy: 94, lastActive: '2024-01-15', joined: '2023-09-20', certs: ['basics', 'schedule', 'terminology'], topicProgress: { itemcodes: 92, dimensions: 98, schedules: 95, terminology: 100, weight: 88 } },
  { id: '5', name: 'Robert Brown', email: 'rbrown@pipelinemasters.com', company: 'Pipeline Masters', role: 'user', xp: 950, streak: 0, bestStreak: 4, sessions: 8, questions: 72, accuracy: 71, lastActive: '2024-01-10', joined: '2024-01-02', certs: [], topicProgress: { itemcodes: 25, dimensions: 35, schedules: 20, terminology: 40, weight: 15 } },
  { id: '6', name: 'Lisa Martinez', email: 'lmartinez@acmepipe.com', company: 'Acme Piping Inc.', role: 'user', xp: 2100, streak: 8, bestStreak: 12, sessions: 24, questions: 198, accuracy: 85, lastActive: '2024-01-15', joined: '2023-11-15', certs: ['basics'], topicProgress: { itemcodes: 68, dimensions: 75, schedules: 70, terminology: 82, weight: 55 } },
  { id: '7', name: 'David Kim', email: 'dkim@steelsolutions.com', company: 'Steel Solutions LLC', role: 'user', xp: 1500, streak: 3, bestStreak: 6, sessions: 15, questions: 128, accuracy: 82, lastActive: '2024-01-13', joined: '2023-12-10', certs: [], topicProgress: { itemcodes: 52, dimensions: 65, schedules: 48, terminology: 72, weight: 38 } },
  { id: '8', name: 'Jennifer Taylor', email: 'jtaylor@industrialsupply.com', company: 'Industrial Supply Co.', role: 'user', xp: 680, streak: 2, bestStreak: 3, sessions: 6, questions: 52, accuracy: 75, lastActive: '2024-01-12', joined: '2024-01-05', certs: [], topicProgress: { itemcodes: 18, dimensions: 28, schedules: 15, terminology: 32, weight: 10 } },
  { id: '9', name: 'Chris Anderson', email: 'canderson@pipelinecorp.com', company: 'Pipeline Corporation', role: 'user', xp: 3800, streak: 21, bestStreak: 21, sessions: 48, questions: 445, accuracy: 89, lastActive: '2024-01-15', joined: '2023-10-01', certs: ['basics', 'schedule'], topicProgress: { itemcodes: 85, dimensions: 92, schedules: 88, terminology: 95, weight: 78 } },
  { id: '10', name: 'Amanda White', email: 'awhite@acmepipe.com', company: 'Acme Piping Inc.', role: 'user', xp: 1200, streak: 6, bestStreak: 9, sessions: 12, questions: 105, accuracy: 80, lastActive: '2024-01-14', joined: '2023-12-20', certs: [], topicProgress: { itemcodes: 42, dimensions: 55, schedules: 38, terminology: 60, weight: 28 } },
];

const CERTIFICATIONS = [
  { id: 'basics', name: 'Pipe Fundamentals', color: '#059669', req: { questions: 20, accuracy: 80, streak: 3 } },
  { id: 'schedule', name: 'Schedule Specialist', color: '#2563eb', req: { questions: 30, accuracy: 85, streak: 5 } },
  { id: 'terminology', name: 'Industry Expert', color: '#7c3aed', req: { questions: 50, accuracy: 90, streak: 7 } },
  { id: 'itemcodes', name: 'Item Code Expert', color: '#dc2626', req: { questions: 40, accuracy: 85, streak: 5 } },
  { id: 'master', name: 'Pipe Master', color: '#f59e0b', req: { questions: 100, accuracy: 85, streak: 14 } },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const genId = () => Math.random().toString(36).substr(2, 9);

const genQuestions = (custom = []) => {
  const q = [];
  
  PIPE_DATA.sizes.forEach(s => {
    q.push({ id: `od_${s.nps}`, cat: 'dimensions', diff: 'beginner', q: `What is the Outside Diameter of ${s.nps} NPS pipe?`, a: `${s.od}"`, opts: shuffle([`${s.od}"`, `${(s.od + 0.1).toFixed(3)}"`, `${(s.od - 0.1).toFixed(3)}"`, `${(s.od + 0.25).toFixed(3)}"`]), hint: 'Refer to the ASME B36.10 standard pipe chart' });
  });
  
  Object.entries(PIPE_DATA.schedules).forEach(([nps, sch]) => {
    q.push({ id: `wt40_${nps}`, cat: 'schedules', diff: 'intermediate', q: `What is the wall thickness of ${nps} Schedule 40 pipe?`, a: `${sch.sch40.wt}"`, opts: shuffle([`${sch.sch40.wt}"`, `${sch.sch80.wt}"`, `${(sch.sch40.wt + 0.02).toFixed(3)}"`, `${(sch.sch40.wt - 0.02).toFixed(3)}"`]), hint: 'Schedule 40 is the standard weight designation' });
    q.push({ id: `lb_${nps}`, cat: 'weight', diff: 'advanced', q: `What is the weight per foot of ${nps} Schedule 40 pipe?`, a: `${sch.sch40.lb} lb/ft`, opts: shuffle([`${sch.sch40.lb} lb/ft`, `${sch.sch80.lb} lb/ft`, `${(sch.sch40.lb + 1).toFixed(2)} lb/ft`, `${(sch.sch40.lb - 1).toFixed(2)} lb/ft`]), hint: 'Weight depends on wall thickness and diameter' });
  });
  
  PIPE_DATA.terminology.forEach(t => {
    q.push({ id: `term_${t.term}`, cat: 'terminology', diff: t.cat === 'sizing' ? 'beginner' : 'intermediate', q: `What does "${t.term}" stand for?`, a: t.def, opts: shuffle([t.def, ...PIPE_DATA.terminology.filter(x => x.term !== t.term).slice(0, 3).map(x => x.def)]), hint: `This term relates to ${t.cat}` });
  });
  
  ITEM_CODES.firstDigit.forEach(d => {
    q.push({ id: `ic_first_${d.code}`, cat: 'itemcodes', diff: 'beginner', q: `In an item code, what does a first digit of "${d.code}" indicate?`, a: d.meaning, opts: shuffle(ITEM_CODES.firstDigit.map(x => x.meaning)), hint: 'The first digit indicates the finish and origin' });
  });
  
  const commonSizes = ['1/2"', '3/4"', '1"', '2"', '4"', '6"', '8"'];
  ITEM_CODES.pipeSizeCodes.filter(p => commonSizes.includes(p.size)).forEach(p => {
    q.push({ id: `ic_size_${p.code}`, cat: 'itemcodes', diff: 'intermediate', q: `What is the 3-digit pipe size code for ${p.size} pipe?`, a: p.code, opts: shuffle([p.code, ...ITEM_CODES.pipeSizeCodes.filter(x => x.code !== p.code).slice(0, 3).map(x => x.code)]), hint: 'Pipe size codes are the 2nd-4th digits' });
  });
  
  const commonSuffixes = [
    { suffix: '05', meaning: 'SRL (Single Random Length)', hint: 'Most common seamless suffix' },
    { suffix: '10', meaning: 'DRL (Double Random Length)', hint: 'Longer lengths than -05' },
    { suffix: '71', meaning: '21FT A53B/API5LB/X42 PEB', hint: 'Plain end beveled ERW' },
    { suffix: '72', meaning: '42FT A53B/API5LB/X42 PEB', hint: 'Long PEB ERW' },
  ];
  
  commonSuffixes.forEach(s => {
    q.push({ id: `ic_suf_${s.suffix}`, cat: 'itemcodes', diff: 'advanced', q: `What does the suffix "-${s.suffix}" indicate?`, a: s.meaning, opts: shuffle([s.meaning, ...commonSuffixes.filter(x => x.suffix !== s.suffix).map(x => x.meaning)]), hint: s.hint });
  });
  
  return [...q, ...custom.map(c => ({ ...c, isCustom: true }))];
};

const calcNextReview = (card, correct) => {
  let { ease = 2.5, interval = 1, reps = 0 } = card;
  if (correct) { reps === 0 ? interval = 1 : reps === 1 ? interval = 6 : interval = Math.round(interval * ease); reps++; ease = Math.max(1.3, ease + 0.1); }
  else { reps = 0; interval = 1; }
  return { ease, interval, reps, next: Date.now() + interval * 86400000 };
};

// SVG Icons
const Icon = ({ name, size = 20 }) => {
  const icons = {
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
    play: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
    award: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    hash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    graduation: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  };
  return icons[name] || null;
};

export default function SteelPipeMaster() {
  const [auth, setAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');
  const [questions] = useState(genQuestions());
  const [cardProgress, setCardProgress] = useState({});
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [showAns, setShowAns] = useState(false);
  const [selected, setSelected] = useState(null);
  const [adminTab, setAdminTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([
    { id: '1', from: 'Admin', to: '1', subject: 'Welcome to Steel Pipe Master!', body: 'Welcome to the training platform. Start with the Item Codes module to get familiar with our part numbering system.', date: '2024-01-10', read: true },
    { id: '2', from: 'Admin', to: '3', subject: 'Keep up the good work!', body: 'Great progress this week! Try to maintain your streak by practicing daily.', date: '2024-01-12', read: false },
  ]);
  const [newMessage, setNewMessage] = useState({ to: '', subject: '', body: '' });
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [userMessages, setUserMessages] = useState([]);
  
  // Learning Paths State
  const [selectedRole, setSelectedRole] = useState(null);
  const [learningView, setLearningView] = useState('select');
  const [expandedPhase, setExpandedPhase] = useState(1);
  const [lpTab, setLpTab] = useState('curriculum');
  const [completedLessons, setCompletedLessons] = useState([]);
  
  const level = Math.floor((user?.xp || 0) / 100) + 1;
  
  const getDue = useCallback((cat = null) => {
    const now = Date.now();
    return questions.filter(q => {
      if (cat && q.cat !== cat) return false;
      const p = cardProgress[q.id];
      return !p || p.next <= now;
    });
  }, [questions, cardProgress]);
  
  const login = (email) => {
    const isAdmin = email.includes('admin');
    setUser({
      id: isAdmin ? 'admin' : genId(), email, name: isAdmin ? 'Administrator' : email.split('@')[0],
      company: 'Your Company', role: isAdmin ? 'admin' : 'user',
      xp: 0, streak: 0, bestStreak: 0, sessions: 0, questions: 0, perfect: 0,
      badges: [], certs: [], created: Date.now()
    });
    setUserMessages(messages.filter(m => m.to === (isAdmin ? 'admin' : genId())));
    setAuth(true);
  };
  
  const startSession = (cat = null) => {
    const due = getDue(cat);
    const cards = shuffle(due).slice(0, 10);
    if (!cards.length) { alert('No questions due!'); return; }
    setSession({ cards, idx: 0, cat });
    setStats({ correct: 0, incorrect: 0 });
    setShowAns(false);
    setSelected(null);
    setView('session');
  };
  
  const answer = (opt) => {
    if (selected) return;
    setSelected(opt);
    const card = session.cards[session.idx];
    const correct = opt === card.a;
    setStats(s => ({ ...s, [correct ? 'correct' : 'incorrect']: s[correct ? 'correct' : 'incorrect'] + 1 }));
    if (correct) setUser(u => ({ ...u, xp: u.xp + 10 }));
    setCardProgress(p => ({ ...p, [card.id]: calcNextReview(p[card.id] || {}, correct) }));
    setShowAns(true);
  };
  
  const nextCard = () => {
    if (session.idx >= session.cards.length - 1) {
      const acc = stats.correct / (stats.correct + stats.incorrect) * 100;
      setUser(u => ({ ...u, sessions: u.sessions + 1, questions: u.questions + stats.correct + stats.incorrect, streak: acc >= 70 ? u.streak + 1 : u.streak, xp: u.xp + (acc >= 70 ? 25 : 0) }));
      setView('results');
      return;
    }
    setSession(s => ({ ...s, idx: s.idx + 1 }));
    setShowAns(false);
    setSelected(null);
  };
  
  const sendMessage = () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.body) { alert('Please fill in all fields'); return; }
    setMessages([...messages, { id: genId(), from: 'Admin', ...newMessage, date: new Date().toISOString().split('T')[0], read: false }]);
    setNewMessage({ to: '', subject: '', body: '' });
    setShowMessageModal(false);
    alert('Message sent!');
  };
  
  const sendBulkMessage = () => {
    const subject = prompt('Enter message subject:');
    if (!subject) return;
    const body = prompt('Enter message body:');
    if (!body) return;
    const newMsgs = MOCK_USERS.map(u => ({ id: genId(), from: 'Admin', to: u.id, subject, body, date: new Date().toISOString().split('T')[0], read: false }));
    setMessages([...messages, ...newMsgs]);
    alert(`Message sent to ${MOCK_USERS.length} users!`);
  };

  // AUTH SCREEN
  const AuthScreen = () => (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-header"><div className="logo">SP</div><h1>Steel Pipe Master</h1><p>Professional Training Platform</p></div>
        <div className="tabs">
          <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Sign In</button>
          <button className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>Create Account</button>
        </div>
        {authMode === 'login' ? (
          <form onSubmit={e => { e.preventDefault(); login(e.target.email.value); }}>
            <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@company.com" required /></div>
            <div className="field"><label>Password</label><input name="password" type="password" placeholder="Enter password" required /></div>
            <button type="submit" className="btn-primary">Sign In</button>
            <p className="hint">Demo: Use "admin@company.com" for admin access</p>
          </form>
        ) : (
          <form onSubmit={e => { e.preventDefault(); login(e.target.email.value); }}>
            <div className="field"><label>Full Name</label><input name="name" placeholder="John Smith" required /></div>
            <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@company.com" required /></div>
            <div className="field"><label>Password</label><input name="password" type="password" placeholder="Create password" required /></div>
            <button type="submit" className="btn-primary">Create Account</button>
          </form>
        )}
      </div>
    </div>
  );

  // HOME SCREEN
  const HomeScreen = () => (
    <div className="app-layout">
      <header className="topbar">
        <div className="brand"><div className="logo sm">SP</div><span>Steel Pipe Master</span></div>
        <div className="actions">
          {user?.role === 'admin' && <button className="icon-btn highlight" onClick={() => setView('admin')}><Icon name="settings" size={18}/></button>}
          <button className="icon-btn" onClick={() => setView('profile')}><Icon name="user" size={18}/></button>
          <button className="icon-btn" onClick={() => { setAuth(false); setUser(null); }}><Icon name="logout" size={18}/></button>
        </div>
      </header>
      <main className="content">
        <div className="welcome"><h1>Welcome back, {user?.name?.split(' ')[0]}</h1><p>Continue your pipe specifications training</p></div>
        <div className="stats-row">
          <div className="stat"><span className="stat-val">{user?.streak || 0}</span><span className="stat-lbl">Day Streak</span></div>
          <div className="stat"><span className="stat-val">{user?.xp || 0}</span><span className="stat-lbl">Points</span></div>
          <div className="stat"><span className="stat-val">{level}</span><span className="stat-lbl">Level</span></div>
          <div className="stat"><span className="stat-val">{user?.sessions || 0}</span><span className="stat-lbl">Sessions</span></div>
        </div>
        <div className="practice-card"><div><h2>Daily Practice</h2><p>{getDue().length} questions ready</p></div><button className="btn-start" onClick={() => startSession()}><Icon name="play" size={16}/> Start</button></div>
        <section className="topics"><h2>Study by Topic</h2>
          <div className="topics-grid">
            {[{ id: 'itemcodes', name: 'Item Codes', desc: 'Part numbers & suffixes', color: '#dc2626' },{ id: 'dimensions', name: 'Dimensions', desc: 'NPS, OD, sizing', color: '#2563eb' },{ id: 'schedules', name: 'Schedules', desc: 'Wall thickness', color: '#059669' },{ id: 'terminology', name: 'Terms', desc: 'Industry terms', color: '#7c3aed' },{ id: 'weight', name: 'Weights', desc: 'lb per foot', color: '#f59e0b' }].map(t => (
              <button key={t.id} className="topic-btn" onClick={() => startSession(t.id)}><div className="topic-color" style={{ background: t.color }}/><div className="topic-info"><h3>{t.name}</h3><p>{t.desc}</p></div><span className="topic-count">{getDue(t.id).length}</span></button>
            ))}
          </div>
        </section>
        <section className="nav-cards">
          <button onClick={() => { setView('learningPaths'); setLearningView('select'); }}><Icon name="graduation" size={22}/><div><h3>Learning Paths</h3><p>Role-based training</p></div></button>
          <button onClick={() => setView('leaderboard')}><Icon name="trophy" size={22}/><div><h3>Leaderboard</h3><p>Top performers</p></div></button>
          <button onClick={() => setView('certs')}><Icon name="award" size={22}/><div><h3>Certifications</h3><p>Earn credentials</p></div></button>
          <button onClick={() => setView('reference')}><Icon name="book" size={22}/><div><h3>Reference</h3><p>Pipe data</p></div></button>
          <button onClick={() => setView('itemcoderef')}><Icon name="hash" size={22}/><div><h3>Item Codes</h3><p>Code reference</p></div></button>
        </section>
      </main>
    </div>
  );

  // SESSION SCREEN
  const SessionScreen = () => {
    if (!session) return null;
    const card = session.cards[session.idx];
    const pct = ((session.idx + 1) / session.cards.length) * 100;
    return (
      <div className="session-wrap">
        <header className="session-bar"><button className="icon-btn" onClick={() => setView('home')}><Icon name="x" size={20}/></button><div className="progress"><div className="prog-bar"><div className="prog-fill" style={{ width: `${pct}%` }}/></div><span>{session.idx + 1} / {session.cards.length}</span></div><span className="score">+{stats.correct * 10}</span></header>
        <main className="session-main">
          <div className={`q-card ${showAns ? (selected === card.a ? 'correct' : 'wrong') : ''}`}>
            <div className="q-meta"><span className={`diff ${card.diff}`}>{card.diff}</span><span className="cat-tag">{card.cat}</span></div>
            <h2>{card.q}</h2>
            {!showAns && <p className="q-hint">{card.hint}</p>}
            <div className="options">{card.opts.map((o, i) => (<button key={i} className={`opt ${showAns ? (o === card.a ? 'correct' : selected === o ? 'wrong' : 'dim') : ''}`} onClick={() => answer(o)} disabled={showAns}><span className="opt-letter">{String.fromCharCode(65 + i)}</span><span className="opt-text">{o}</span>{showAns && o === card.a && <Icon name="check" size={18}/>}</button>))}</div>
            {showAns && (<div className="feedback-area"><div className={`feedback ${selected === card.a ? 'correct' : 'wrong'}`}>{selected === card.a ? 'Correct! +10 points' : 'Incorrect.'}</div><button className="btn-primary" onClick={nextCard}>{session.idx >= session.cards.length - 1 ? 'See Results' : 'Next'}</button></div>)}
          </div>
        </main>
      </div>
    );
  };

  // RESULTS SCREEN
  const ResultsScreen = () => {
    const total = stats.correct + stats.incorrect;
    const acc = total ? Math.round((stats.correct / total) * 100) : 0;
    const passed = acc >= 70;
    return (
      <div className="results-wrap"><div className="results-card">
        <div className={`results-top ${passed ? 'pass' : 'fail'}`}><h1>{passed ? 'Great Work!' : 'Keep Practicing'}</h1><p>{passed ? 'Session completed' : '70% needed to pass'}</p></div>
        <div className="score-ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" className="bg"/><circle cx="50" cy="50" r="42" className="fg" style={{ strokeDasharray: `${acc * 2.64} 264` }}/></svg><span>{acc}%</span></div>
        <div className="results-nums"><div className="correct"><span>{stats.correct}</span><small>Correct</small></div><div className="wrong"><span>{stats.incorrect}</span><small>Incorrect</small></div></div>
        <div className="rewards"><h3>Points Earned</h3><div className="reward-line"><span>Correct answers</span><span>+{stats.correct * 10}</span></div>{passed && <div className="reward-line bonus"><span>Completion bonus</span><span>+25</span></div>}<div className="reward-total"><span>Total</span><span>+{stats.correct * 10 + (passed ? 25 : 0)}</span></div></div>
        <button className="btn-primary" onClick={() => setView('home')}>Back to Dashboard</button>
      </div></div>
    );
  };

  // LEARNING PATHS - ROLE SELECTION
  const LearningPathsScreen = () => {
    if (learningView === 'detail' && selectedRole) {
      return <LearningPathDetail />;
    }
    
    const roles = Object.values(LEARNING_PATHS);
    return (
      <div className="page lp-page">
        <header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Learning Paths</h1></header>
        <main>
          <div className="lp-intro">
            <h2>Choose Your Learning Path</h2>
            <p>Select your role to see your personalized training curriculum</p>
          </div>
          <div className="role-cards">
            {roles.map(role => (
              <div key={role.id} className="role-card" onClick={() => { setSelectedRole(role.id); setLearningView('detail'); setExpandedPhase(1); setLpTab('curriculum'); }} style={{ '--role-color': role.color }}>
                <div className="role-icon">{role.icon}</div>
                <h3>{role.name}</h3>
                <p className="role-desc">{role.description}</p>
                <div className="role-stats">
                  <div className="role-stat"><span className="stat-value">{getTotalLessons(role.id)}</span><span className="stat-label">Lessons</span></div>
                  <div className="role-stat"><span className="stat-value">{getTotalTrainingHours(role.id)}h</span><span className="stat-label">Training</span></div>
                  <div className="role-stat"><span className="stat-value">{role.lessonSequence.length}</span><span className="stat-label">Phases</span></div>
                </div>
                <div className="role-timeline">⏱️ {role.overview.typicalTimeline}</div>
                {role.certification.requirements.prerequisiteCert && (
                  <div className="role-prereq">Requires: {LEARNING_PATHS[role.certification.requirements.prerequisiteCert]?.name} certification</div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  };

  // LEARNING PATH DETAIL
  const LearningPathDetail = () => {
    const role = LEARNING_PATHS[selectedRole];
    if (!role) return null;
    
    const totalLessons = getTotalLessons(selectedRole);
    const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);
    
    return (
      <div className="page lp-detail-page">
        <header><button className="icon-btn" onClick={() => setLearningView('select')}><Icon name="arrow" size={20}/></button><h1>{role.name}</h1></header>
        <main>
          <div className="lp-header" style={{ '--role-color': role.color }}>
            <div className="lp-header-content">
              <div className="lp-icon">{role.icon}</div>
              <div className="lp-info">
                <h2>{role.name} Learning Path</h2>
                <p>{role.overview.keyOutcome}</p>
              </div>
            </div>
            <div className="lp-progress-bar">
              <div className="lp-progress-fill" style={{ width: `${progressPercent}%` }}/>
              <span className="lp-progress-text">{progressPercent}% Complete</span>
            </div>
          </div>
          
          <div className="lp-tabs">
            <button className={lpTab === 'curriculum' ? 'active' : ''} onClick={() => setLpTab('curriculum')}>📚 Curriculum</button>
            <button className={lpTab === 'competencies' ? 'active' : ''} onClick={() => setLpTab('competencies')}>🎯 Competencies</button>
            <button className={lpTab === 'certification' ? 'active' : ''} onClick={() => setLpTab('certification')}>🏆 Certification</button>
          </div>
          
          {lpTab === 'curriculum' && (
            <div className="lp-curriculum">
              {role.lessonSequence.map((phase) => (
                <div key={phase.phase} className="curriculum-phase">
                  <div className={`phase-header ${expandedPhase === phase.phase ? 'expanded' : ''}`} onClick={() => setExpandedPhase(expandedPhase === phase.phase ? null : phase.phase)}>
                    <div className="phase-indicator"><span className="phase-number">{phase.phase}</span></div>
                    <div className="phase-info">
                      <h3>{phase.phaseName}</h3>
                      <p>{phase.phaseDescription}</p>
                      <div className="phase-meta"><span>📅 {phase.duration}</span><span>📖 {phase.lessons.length} lessons</span></div>
                    </div>
                    <div className="phase-toggle">{expandedPhase === phase.phase ? '▼' : '▶'}</div>
                  </div>
                  {expandedPhase === phase.phase && (
                    <div className="phase-lessons">
                      {phase.lessons.map((lesson) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        return (
                          <div key={lesson.id} className={`lesson-item ${isCompleted ? 'completed' : ''}`}>
                            <div className="lesson-status">{isCompleted ? '✓' : '○'}</div>
                            <div className="lesson-info">
                              <div className="lesson-header">
                                <span className="lesson-id">{lesson.id}</span>
                                <h4>{lesson.name}</h4>
                                {lesson.type === 'required' && <span className="lesson-required">Required</span>}
                              </div>
                              <div className="lesson-meta">
                                <span>⏱️ {lesson.duration}</span>
                                <span>🎯 Pass: {lesson.passingScore}%</span>
                              </div>
                            </div>
                            <button className="lesson-start-btn" onClick={() => { if (!isCompleted) { setCompletedLessons([...completedLessons, lesson.id]); } }} disabled={isCompleted}>
                              {isCompleted ? 'Done' : 'Start'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {lpTab === 'competencies' && (
            <div className="lp-competencies">
              <div className="depth-legend">
                <h3>Knowledge Depth Levels</h3>
                <div className="depth-items">
                  {Object.entries(KNOWLEDGE_DEPTHS).map(([level, data]) => (
                    <div key={level} className="depth-item" style={{ '--depth-color': data.color }}>
                      <span className="depth-level">{level}</span>
                      <span className="depth-label">{data.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="competency-categories">
                {Object.entries(role.competencyRequirements).map(([catId, competencies]) => {
                  const category = COMPETENCY_CATEGORIES[catId];
                  if (!category) return null;
                  return (
                    <div key={catId} className="competency-category">
                      <h3><span className="cat-icon">{category.icon}</span> {category.name}</h3>
                      <div className="competency-list">
                        {Object.entries(competencies).map(([compId, depth]) => {
                          const comp = category.competencies.find(c => c.id === compId);
                          if (!comp) return null;
                          const depthData = KNOWLEDGE_DEPTHS[depth];
                          return (
                            <div key={compId} className="competency-item">
                              <div className="comp-info"><h4>{comp.name}</h4><p>{comp.description}</p></div>
                              <div className="comp-depth" style={{ '--depth-color': depthData.color }}>
                                <span className="comp-depth-num">{depth}</span>
                                <span className="comp-depth-label">{depthData.label}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {lpTab === 'certification' && (
            <div className="lp-certification">
              <div className="cert-card-lg">
                <div className="cert-badge-lg">{role.certification.badge}</div>
                <h2>{role.certification.name}</h2>
                <div className="cert-requirements">
                  <h3>Requirements</h3>
                  <ul>
                    <li><span className="req-icon">📚</span> Complete all required lessons</li>
                    <li><span className="req-icon">🎯</span> Minimum {role.certification.requirements.minimumAccuracy}% accuracy</li>
                    <li><span className="req-icon">🔥</span> Maintain {role.certification.requirements.minimumStreak}-day streak</li>
                    <li><span className="req-icon">📅</span> {role.certification.requirements.timeInRole} in role</li>
                    {role.certification.requirements.prerequisiteCert && (
                      <li><span className="req-icon">🔐</span> Complete {LEARNING_PATHS[role.certification.requirements.prerequisiteCert]?.name} certification first</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  // ADMIN DASHBOARD
  const AdminScreen = () => {
    const totalUsers = MOCK_USERS.length;
    const activeToday = MOCK_USERS.filter(u => u.lastActive === '2024-01-15').length;
    const avgAccuracy = Math.round(MOCK_USERS.reduce((a, u) => a + u.accuracy, 0) / totalUsers);
    const totalQuestions = MOCK_USERS.reduce((a, u) => a + u.questions, 0);
    const inactiveUsers = MOCK_USERS.filter(u => u.streak === 0);
    
    return (
      <div className="page admin-page">
        <header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Admin Dashboard</h1></header>
        <div className="admin-tabs">
          {['overview', 'users', 'progress', 'messages'].map(t => (<button key={t} className={adminTab === t ? 'active' : ''} onClick={() => setAdminTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>))}
        </div>
        <main>
          {adminTab === 'overview' && (
            <>
              <div className="admin-stats">
                <div className="admin-stat"><Icon name="users" size={24}/><div><span className="big">{totalUsers}</span><small>Total Users</small></div></div>
                <div className="admin-stat"><Icon name="clock" size={24}/><div><span className="big">{activeToday}</span><small>Active Today</small></div></div>
                <div className="admin-stat"><Icon name="chart" size={24}/><div><span className="big">{avgAccuracy}%</span><small>Avg Accuracy</small></div></div>
                <div className="admin-stat"><Icon name="check" size={24}/><div><span className="big">{totalQuestions}</span><small>Questions Answered</small></div></div>
              </div>
              
              <div className="admin-grid">
                <div className="admin-card">
                  <h3><Icon name="alert" size={18}/> Needs Attention</h3>
                  <p className="card-desc">Users with broken streaks or low activity</p>
                  {inactiveUsers.length === 0 ? <p className="empty">All users are active!</p> : (
                    <div className="mini-list">{inactiveUsers.slice(0, 5).map(u => (
                      <div key={u.id} className="mini-row" onClick={() => { setSelectedUser(u); setAdminTab('users'); }}>
                        <div className="mini-avatar">{u.name.split(' ').map(n => n[0]).join('')}</div>
                        <div className="mini-info"><span>{u.name}</span><small>Streak broken • Last active: {u.lastActive}</small></div>
                        <button className="btn-xs" onClick={(e) => { e.stopPropagation(); setNewMessage({ to: u.id, subject: '', body: '' }); setShowMessageModal(true); }}><Icon name="mail" size={14}/></button>
                      </div>
                    ))}</div>
                  )}
                </div>
                
                <div className="admin-card">
                  <h3><Icon name="trophy" size={18}/> Top Performers</h3>
                  <p className="card-desc">Highest XP this month</p>
                  <div className="mini-list">{MOCK_USERS.sort((a, b) => b.xp - a.xp).slice(0, 5).map((u, i) => (
                    <div key={u.id} className="mini-row" onClick={() => { setSelectedUser(u); setAdminTab('users'); }}>
                      <span className="mini-rank">{i + 1}</span>
                      <div className="mini-avatar">{u.name.split(' ').map(n => n[0]).join('')}</div>
                      <div className="mini-info"><span>{u.name}</span><small>{u.xp.toLocaleString()} XP • {u.accuracy}% accuracy</small></div>
                    </div>
                  ))}</div>
                </div>
              </div>
              
              <div className="admin-card full">
                <h3><Icon name="chart" size={18}/> Topic Performance (All Users)</h3>
                <div className="topic-bars">
                  {[{ name: 'Item Codes', key: 'itemcodes', color: '#dc2626' },{ name: 'Dimensions', key: 'dimensions', color: '#2563eb' },{ name: 'Schedules', key: 'schedules', color: '#059669' },{ name: 'Terminology', key: 'terminology', color: '#7c3aed' },{ name: 'Weights', key: 'weight', color: '#f59e0b' }].map(topic => {
                    const avg = Math.round(MOCK_USERS.reduce((a, u) => a + u.topicProgress[topic.key], 0) / totalUsers);
                    return (<div key={topic.key} className="topic-bar-row"><span className="topic-bar-label">{topic.name}</span><div className="topic-bar-bg"><div className="topic-bar-fill" style={{ width: `${avg}%`, background: topic.color }}/></div><span className="topic-bar-val">{avg}%</span></div>);
                  })}
                </div>
              </div>
            </>
          )}
          
          {adminTab === 'users' && !selectedUser && (
            <div className="admin-card full">
              <div className="card-header"><h3><Icon name="users" size={18}/> All Users</h3><button className="btn-sm" onClick={sendBulkMessage}><Icon name="send" size={14}/> Message All</button></div>
              <div className="users-table">
                <div className="users-header"><span>User</span><span>Company</span><span>XP</span><span>Accuracy</span><span>Streak</span><span>Last Active</span><span>Actions</span></div>
                {MOCK_USERS.map(u => (
                  <div key={u.id} className="users-row">
                    <div className="user-cell"><div className="user-avatar-sm">{u.name.split(' ').map(n => n[0]).join('')}</div><div><span className="user-name">{u.name}</span><small>{u.email}</small></div></div>
                    <span>{u.company}</span>
                    <span className="xp">{u.xp.toLocaleString()}</span>
                    <span className={u.accuracy >= 85 ? 'good' : u.accuracy >= 70 ? 'ok' : 'low'}>{u.accuracy}%</span>
                    <span className={u.streak > 0 ? 'streak-active' : 'streak-broken'}>{u.streak} days</span>
                    <span>{u.lastActive}</span>
                    <div className="user-actions">
                      <button className="btn-xs" onClick={() => setSelectedUser(u)} title="View Details"><Icon name="eye" size={14}/></button>
                      <button className="btn-xs" onClick={() => { setNewMessage({ to: u.id, subject: '', body: '' }); setShowMessageModal(true); }} title="Send Message"><Icon name="mail" size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {adminTab === 'users' && selectedUser && (
            <div className="user-detail">
              <button className="btn-back-text" onClick={() => setSelectedUser(null)}><Icon name="arrow" size={16}/> Back to all users</button>
              <div className="user-detail-header">
                <div className="user-detail-avatar">{selectedUser.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="user-detail-info"><h2>{selectedUser.name}</h2><p>{selectedUser.email}</p><p className="company">{selectedUser.company}</p></div>
                <button className="btn-primary-sm" onClick={() => { setNewMessage({ to: selectedUser.id, subject: '', body: '' }); setShowMessageModal(true); }}><Icon name="mail" size={16}/> Send Message</button>
              </div>
              <div className="user-detail-stats">
                <div><span>{selectedUser.xp.toLocaleString()}</span><small>Total XP</small></div>
                <div><span>{selectedUser.accuracy}%</span><small>Accuracy</small></div>
                <div><span>{selectedUser.streak}</span><small>Current Streak</small></div>
                <div><span>{selectedUser.bestStreak}</span><small>Best Streak</small></div>
                <div><span>{selectedUser.sessions}</span><small>Sessions</small></div>
                <div><span>{selectedUser.questions}</span><small>Questions</small></div>
              </div>
              <div className="user-detail-section">
                <h3>Topic Progress</h3>
                <div className="topic-bars">
                  {[{ name: 'Item Codes', key: 'itemcodes', color: '#dc2626' },{ name: 'Dimensions', key: 'dimensions', color: '#2563eb' },{ name: 'Schedules', key: 'schedules', color: '#059669' },{ name: 'Terminology', key: 'terminology', color: '#7c3aed' },{ name: 'Weights', key: 'weight', color: '#f59e0b' }].map(topic => (
                    <div key={topic.key} className="topic-bar-row"><span className="topic-bar-label">{topic.name}</span><div className="topic-bar-bg"><div className="topic-bar-fill" style={{ width: `${selectedUser.topicProgress[topic.key]}%`, background: topic.color }}/></div><span className="topic-bar-val">{selectedUser.topicProgress[topic.key]}%</span></div>
                  ))}
                </div>
              </div>
              <div className="user-detail-section">
                <h3>Certifications</h3>
                <div className="cert-badges">{selectedUser.certs.length === 0 ? <p className="empty">No certifications yet</p> : selectedUser.certs.map(c => { const cert = CERTIFICATIONS.find(x => x.id === c); return cert ? <span key={c} className="cert-badge" style={{ background: cert.color }}>{cert.name}</span> : null; })}</div>
              </div>
              <div className="user-detail-section">
                <h3>Message History</h3>
                {messages.filter(m => m.to === selectedUser.id).length === 0 ? <p className="empty">No messages sent</p> : (
                  <div className="message-list">{messages.filter(m => m.to === selectedUser.id).map(m => (<div key={m.id} className="message-item"><div className="message-header"><span className="message-subject">{m.subject}</span><span className="message-date">{m.date}</span></div><p className="message-body">{m.body}</p></div>))}</div>
                )}
              </div>
            </div>
          )}
          
          {adminTab === 'progress' && (
            <div className="admin-card full">
              <h3><Icon name="chart" size={18}/> Detailed Progress Report</h3>
              <div className="progress-table">
                <div className="progress-header"><span>User</span><span>Item Codes</span><span>Dimensions</span><span>Schedules</span><span>Terminology</span><span>Weights</span><span>Overall</span></div>
                {MOCK_USERS.map(u => {
                  const overall = Math.round(Object.values(u.topicProgress).reduce((a, b) => a + b, 0) / 5);
                  return (<div key={u.id} className="progress-row">
                    <div className="user-cell-sm"><div className="user-avatar-xs">{u.name.split(' ').map(n => n[0]).join('')}</div><span>{u.name.split(' ')[0]}</span></div>
                    {['itemcodes', 'dimensions', 'schedules', 'terminology', 'weight'].map(k => (<span key={k} className={`prog-cell ${u.topicProgress[k] >= 80 ? 'high' : u.topicProgress[k] >= 50 ? 'med' : 'low'}`}>{u.topicProgress[k]}%</span>))}
                    <span className={`prog-cell overall ${overall >= 80 ? 'high' : overall >= 50 ? 'med' : 'low'}`}>{overall}%</span>
                  </div>);
                })}
              </div>
            </div>
          )}
          
          {adminTab === 'messages' && (
            <>
              <div className="admin-card full">
                <div className="card-header"><h3><Icon name="mail" size={18}/> Compose Message</h3></div>
                <div className="compose-form">
                  <div className="field"><label>To</label><select value={newMessage.to} onChange={e => setNewMessage({ ...newMessage, to: e.target.value })}><option value="">Select recipient...</option><option value="all">All Users</option>{MOCK_USERS.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}</select></div>
                  <div className="field"><label>Subject</label><input value={newMessage.subject} onChange={e => setNewMessage({ ...newMessage, subject: e.target.value })} placeholder="Message subject..."/></div>
                  <div className="field"><label>Message</label><textarea value={newMessage.body} onChange={e => setNewMessage({ ...newMessage, body: e.target.value })} placeholder="Write your message..." rows={4}/></div>
                  <button className="btn-primary" onClick={() => { if (newMessage.to === 'all') sendBulkMessage(); else sendMessage(); }}><Icon name="send" size={16}/> Send Message</button>
                </div>
              </div>
              <div className="admin-card full">
                <h3><Icon name="mail" size={18}/> Sent Messages</h3>
                {messages.length === 0 ? <p className="empty">No messages sent yet</p> : (
                  <div className="message-list">{messages.map(m => { const recipient = MOCK_USERS.find(u => u.id === m.to); return (<div key={m.id} className="message-item"><div className="message-header"><span className="message-to">To: {recipient?.name || 'Unknown'}</span><span className="message-date">{m.date}</span>{!m.read && <span className="unread-badge">Unread</span>}</div><span className="message-subject">{m.subject}</span><p className="message-body">{m.body}</p></div>); })}</div>
                )}
              </div>
            </>
          )}
        </main>
        
        {showMessageModal && (
          <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3>Send Message</h3><button className="icon-btn" onClick={() => setShowMessageModal(false)}><Icon name="x" size={18}/></button></div>
              <div className="modal-body">
                <div className="field"><label>To</label><input value={MOCK_USERS.find(u => u.id === newMessage.to)?.name || ''} disabled/></div>
                <div className="field"><label>Subject</label><input value={newMessage.subject} onChange={e => setNewMessage({ ...newMessage, subject: e.target.value })} placeholder="Message subject..."/></div>
                <div className="field"><label>Message</label><textarea value={newMessage.body} onChange={e => setNewMessage({ ...newMessage, body: e.target.value })} placeholder="Write your message..." rows={4}/></div>
              </div>
              <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowMessageModal(false)}>Cancel</button><button className="btn-primary" onClick={sendMessage}><Icon name="send" size={16}/> Send</button></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Other screens
  const LeaderboardScreen = () => (<div className="page"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Leaderboard</h1></header><main><div className="lb-list">{MOCK_USERS.sort((a, b) => b.xp - a.xp).map((u, i) => (<div key={u.id} className="lb-row"><span className="lb-rank">{i + 1}</span><div className="lb-avatar">{u.name.split(' ').map(n => n[0]).join('')}</div><div className="lb-info"><span className="lb-name">{u.name}</span><span className="lb-company">{u.company}</span></div><div className="lb-right"><span className="lb-score">{u.xp.toLocaleString()} pts</span></div></div>))}</div></main></div>);
  
  const CertsScreen = () => (<div className="page"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Certifications</h1></header><main><div className="certs-list">{CERTIFICATIONS.map(c => (<div key={c.id} className="cert-item"><div className="cert-icon" style={{ background: c.color }}>{c.name[0]}</div><div className="cert-info"><h3>{c.name}</h3><div className="cert-reqs"><span>{c.req.questions}+ questions</span><span>{c.req.accuracy}% accuracy</span><span>{c.req.streak}-day streak</span></div></div><button className="btn-sm" onClick={() => startSession()}>Practice</button></div>))}</div></main></div>);
  
  const ProfileScreen = () => (<div className="page"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Profile</h1></header><main className="profile-main"><div className="profile-top"><div className="profile-avatar">{user?.name?.split(' ').map(n => n[0]).join('')}</div><h2>{user?.name}</h2><p>{user?.company}</p></div><div className="profile-stats"><div><span>{user?.xp || 0}</span><small>Points</small></div><div><span>{level}</span><small>Level</small></div><div><span>{user?.bestStreak || 0}</span><small>Best Streak</small></div><div><span>{user?.sessions || 0}</span><small>Sessions</small></div></div><button className="btn-danger" onClick={() => { setAuth(false); setUser(null); }}>Sign Out</button></main></div>);
  
  const ReferenceScreen = () => (<div className="page ref"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Reference</h1></header><main><section><h2>NPS to Outside Diameter</h2><div className="table-wrap"><table><thead><tr><th>NPS</th><th>OD</th><th>DN</th></tr></thead><tbody>{PIPE_DATA.sizes.map(s => (<tr key={s.nps}><td>{s.nps}</td><td>{s.od}"</td><td>{s.dn}</td></tr>))}</tbody></table></div></section><section><h2>Schedule Wall Thickness</h2><div className="table-wrap"><table><thead><tr><th>NPS</th><th>Sch40 WT</th><th>Sch40 lb/ft</th><th>Sch80 WT</th><th>Sch80 lb/ft</th></tr></thead><tbody>{Object.entries(PIPE_DATA.schedules).map(([n, d]) => (<tr key={n}><td>{n}</td><td>{d.sch40.wt}"</td><td>{d.sch40.lb}</td><td>{d.sch80.wt}"</td><td>{d.sch80.lb}</td></tr>))}</tbody></table></div></section></main></div>);
  
  const ItemCodeRefScreen = () => (<div className="page ref"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Item Codes</h1></header><main><section><h2>Code Structure</h2><div className="code-example"><div className="code-breakdown"><span className="code-part p1">1</span><span className="code-part p2">006</span><span className="code-part p3">154</span><span className="code-part p4">-05</span></div><div className="code-labels"><span>Finish</span><span>Size</span><span>Wall</span><span>Material</span></div></div></section><section><h2>First Digit</h2><div className="table-wrap"><table><thead><tr><th>Code</th><th>Meaning</th></tr></thead><tbody>{ITEM_CODES.firstDigit.map(d => <tr key={d.code}><td className="code-cell">{d.code}</td><td>{d.meaning}</td></tr>)}</tbody></table></div></section><section><h2>Pipe Size Codes</h2><div className="table-wrap"><table><thead><tr><th>Size</th><th>Code</th><th>Size</th><th>Code</th></tr></thead><tbody>{Array.from({ length: 15 }, (_, i) => (<tr key={i}>{ITEM_CODES.pipeSizeCodes.slice(i * 2, i * 2 + 2).map((p, j) => (<React.Fragment key={j}><td>{p.size}</td><td className="code-cell">{p.code}</td></React.Fragment>))}</tr>))}</tbody></table></div></section></main></div>);

  // STYLES
  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#f8fafc;--card:#fff;--border:#e2e8f0;--text:#0f172a;--muted:#64748b;--primary:#2563eb;--success:#059669;--error:#dc2626;--radius:10px}
        body{font-family:'Inter',-apple-system,sans-serif;background:var(--bg);color:var(--text);line-height:1.5}
        .app{min-height:100vh}
        
        .auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#f1f5f9}
        .auth-card{background:var(--card);border-radius:16px;padding:40px;width:100%;max-width:400px;box-shadow:0 4px 20px rgba(0,0,0,0.08)}
        .auth-header{text-align:center;margin-bottom:32px}
        .logo{width:48px;height:48px;background:var(--primary);color:#fff;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;margin-bottom:16px}
        .logo.sm{width:32px;height:32px;font-size:12px;border-radius:8px}
        .auth-header h1{font-size:22px;font-weight:700}
        .auth-header p{color:var(--muted);font-size:14px;margin-top:4px}
        .tabs{display:flex;gap:8px;margin-bottom:24px}
        .tabs button{flex:1;padding:10px;background:transparent;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px;font-weight:500;color:var(--muted);cursor:pointer}
        .tabs button.active{background:var(--primary);border-color:var(--primary);color:#fff}
        .field{margin-bottom:16px}
        .field label{display:block;font-size:14px;font-weight:500;margin-bottom:6px}
        .field input,.field select,.field textarea{width:100%;padding:12px;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px}
        .field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--primary)}
        .btn-primary{width:100%;padding:14px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer}
        .btn-primary:hover{background:#1d4ed8}
        .btn-secondary{padding:10px 20px;background:transparent;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer}
        .btn-danger{padding:12px 24px;background:var(--error);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer}
        .btn-sm{padding:8px 16px;background:var(--primary);color:#fff;border:none;border-radius:6px;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
        .btn-xs{padding:6px 10px;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
        .btn-xs:hover{background:#e2e8f0}
        .btn-primary-sm{padding:10px 18px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
        .btn-back-text{display:flex;align-items:center;gap:6px;background:none;border:none;color:var(--muted);font-family:inherit;font-size:14px;cursor:pointer;margin-bottom:20px}
        .hint{text-align:center;font-size:13px;color:var(--muted);margin-top:16px}
        
        .app-layout{display:flex;flex-direction:column;min-height:100vh}
        .topbar{display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .brand{display:flex;align-items:center;gap:10px;font-weight:600}
        .actions{display:flex;gap:8px}
        .icon-btn{width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--border);border-radius:8px;cursor:pointer;color:var(--muted)}
        .icon-btn:hover{background:var(--bg)}
        .icon-btn.highlight{background:var(--primary);border-color:var(--primary);color:#fff}
        .content{flex:1;max-width:800px;margin:0 auto;width:100%;padding:28px 24px}
        .welcome h1{font-size:26px;margin-bottom:4px}
        .welcome p{color:var(--muted);margin-bottom:24px}
        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
        .stat{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center}
        .stat-val{display:block;font-size:26px;font-weight:700;color:var(--primary)}
        .stat-lbl{font-size:13px;color:var(--muted)}
        .practice-card{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:28px}
        .practice-card h2{font-size:18px;margin-bottom:4px}
        .practice-card p{color:var(--muted);font-size:14px}
        .btn-start{display:flex;align-items:center;gap:8px;padding:14px 28px;background:var(--primary);color:#fff;border:none;border-radius:var(--radius);font-family:inherit;font-size:15px;font-weight:600;cursor:pointer}
        .btn-start:hover{background:#1d4ed8}
        .topics{margin-bottom:28px}
        .topics h2{font-size:16px;margin-bottom:14px}
        .topics-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .topic-btn{display:flex;align-items:center;gap:12px;padding:14px;background:#fff;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;text-align:left;width:100%}
        .topic-btn:hover{border-color:var(--primary);background:#f8fafc}
        .topic-color{width:10px;height:40px;border-radius:4px}
        .topic-info h3{font-size:14px;font-weight:600;margin-bottom:2px}
        .topic-info p{font-size:12px;color:var(--muted)}
        .topic-count{margin-left:auto;font-size:13px;font-weight:600;color:var(--muted);background:var(--bg);padding:4px 10px;border-radius:12px}
        .nav-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .nav-cards button{display:flex;align-items:center;gap:14px;padding:18px;background:#fff;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;text-align:left;font-family:inherit}
        .nav-cards button:hover{border-color:var(--primary);background:#f8fafc}
        .nav-cards svg{color:var(--primary)}
        .nav-cards h3{font-size:14px;font-weight:600;margin-bottom:2px}
        .nav-cards p{font-size:12px;color:var(--muted)}
        
        .session-wrap{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
        .session-bar{display:flex;align-items:center;gap:20px;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .progress{flex:1;display:flex;align-items:center;gap:12px}
        .prog-bar{flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden}
        .prog-fill{height:100%;background:var(--primary);border-radius:4px;transition:width 0.3s}
        .progress span{font-size:13px;color:var(--muted);font-weight:500}
        .score{font-weight:700;color:var(--success)}
        .session-main{flex:1;display:flex;align-items:center;justify-content:center;padding:24px}
        .q-card{background:#fff;border-radius:16px;padding:32px;width:100%;max-width:600px;box-shadow:0 4px 20px rgba(0,0,0,0.06)}
        .q-card.correct{border:2px solid var(--success)}
        .q-card.wrong{border:2px solid var(--error)}
        .q-meta{display:flex;gap:8px;margin-bottom:16px}
        .diff,.cat-tag{padding:4px 12px;border-radius:20px;font-size:12px;font-weight:500}
        .diff.beginner{background:#dcfce7;color:#166534}
        .diff.intermediate{background:#fef3c7;color:#92400e}
        .diff.advanced{background:#fee2e2;color:#991b1b}
        .cat-tag{background:var(--bg);color:var(--muted)}
        .q-card h2{font-size:20px;line-height:1.4;margin-bottom:12px}
        .q-hint{color:var(--muted);font-size:14px;margin-bottom:20px}
        .options{display:flex;flex-direction:column;gap:10px}
        .opt{display:flex;align-items:center;gap:14px;padding:16px;background:var(--bg);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-family:inherit;font-size:14px;text-align:left;width:100%;transition:all 0.15s}
        .opt:hover:not(:disabled){border-color:var(--primary);background:#eff6ff}
        .opt.correct{background:#dcfce7;border-color:var(--success);color:#166534}
        .opt.wrong{background:#fee2e2;border-color:var(--error);color:#991b1b}
        .opt.dim{opacity:0.5}
        .opt-letter{width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:6px;font-weight:600;font-size:13px;flex-shrink:0}
        .opt-text{flex:1}
        .opt svg{color:var(--success)}
        .feedback-area{margin-top:20px;text-align:center}
        .feedback{padding:12px;border-radius:8px;font-weight:500;margin-bottom:16px}
        .feedback.correct{background:#dcfce7;color:#166534}
        .feedback.wrong{background:#fee2e2;color:#991b1b}
        
        .results-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--bg)}
        .results-card{background:#fff;border-radius:16px;padding:32px;width:100%;max-width:400px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.06)}
        .results-top{padding:20px;border-radius:12px;margin-bottom:24px}
        .results-top.pass{background:#dcfce7;color:#166534}
        .results-top.fail{background:#fee2e2;color:#991b1b}
        .results-top h1{font-size:24px;margin-bottom:4px}
        .results-top p{font-size:14px;opacity:0.8}
        .score-ring{position:relative;width:140px;height:140px;margin:0 auto 24px}
        .score-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
        .score-ring .bg{fill:none;stroke:var(--border);stroke-width:10}
        .score-ring .fg{fill:none;stroke:var(--success);stroke-width:10;stroke-linecap:round}
        .score-ring span{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:32px;font-weight:700}
        .results-nums{display:flex;justify-content:center;gap:40px;margin-bottom:24px}
        .results-nums>div{text-align:center}
        .results-nums span{display:block;font-size:28px;font-weight:700}
        .results-nums .correct span{color:var(--success)}
        .results-nums .wrong span{color:var(--error)}
        .results-nums small{font-size:13px;color:var(--muted)}
        .rewards{background:var(--bg);border-radius:8px;padding:18px;margin-bottom:20px;text-align:left}
        .rewards h3{font-size:13px;font-weight:600;margin-bottom:12px;color:var(--muted)}
        .reward-line{display:flex;justify-content:space-between;font-size:14px;padding:6px 0;color:var(--muted)}
        .reward-line.bonus{color:var(--success)}
        .reward-total{display:flex;justify-content:space-between;padding-top:12px;margin-top:8px;border-top:1px solid var(--border);font-weight:600}
        
        .page{min-height:100vh;background:var(--bg)}
        .page header{display:flex;align-items:center;gap:14px;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .page header h1{font-size:17px}
        .page main{max-width:900px;margin:0 auto;padding:28px 24px}
        
        /* LEARNING PATHS STYLES */
        .lp-page main{max-width:1100px}
        .lp-intro{text-align:center;margin-bottom:32px}
        .lp-intro h2{font-size:24px;margin-bottom:8px}
        .lp-intro p{color:var(--muted)}
        .role-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
        .role-card{background:#fff;border:2px solid var(--border);border-radius:16px;padding:24px;cursor:pointer;transition:all 0.2s}
        .role-card:hover{border-color:var(--role-color);transform:translateY(-4px);box-shadow:0 12px 24px rgba(0,0,0,0.1)}
        .role-icon{font-size:48px;margin-bottom:16px}
        .role-card h3{font-size:20px;font-weight:700;margin-bottom:8px}
        .role-desc{color:var(--muted);font-size:14px;line-height:1.5;margin-bottom:16px;min-height:60px}
        .role-stats{display:flex;justify-content:space-between;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:16px}
        .role-stat{text-align:center}
        .stat-value{display:block;font-size:24px;font-weight:700;color:var(--role-color)}
        .stat-label{font-size:12px;color:var(--muted)}
        .role-timeline{font-size:14px;color:var(--muted)}
        .role-prereq{margin-top:12px;padding:8px 12px;background:#fef3c7;border-radius:8px;font-size:12px;color:#92400e}
        
        .lp-detail-page main{max-width:900px}
        .lp-header{background:linear-gradient(135deg,var(--role-color),var(--role-color)cc);color:#fff;padding:24px;border-radius:16px;margin-bottom:24px}
        .lp-header-content{display:flex;align-items:center;gap:20px;margin-bottom:20px}
        .lp-icon{font-size:56px}
        .lp-info h2{font-size:22px;margin-bottom:8px}
        .lp-info p{opacity:0.9;font-size:14px}
        .lp-progress-bar{background:rgba(255,255,255,0.2);border-radius:12px;height:24px;position:relative;overflow:hidden}
        .lp-progress-fill{background:#fff;height:100%;border-radius:12px;transition:width 0.3s}
        .lp-progress-text{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:12px;font-weight:600;color:var(--role-color);mix-blend-mode:difference}
        
        .lp-tabs{display:flex;gap:8px;margin-bottom:24px}
        .lp-tabs button{flex:1;background:#f3f4f6;border:none;padding:14px 20px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}
        .lp-tabs button:hover{background:#e5e7eb}
        .lp-tabs button.active{background:#1f2937;color:#fff}
        
        .curriculum-phase{margin-bottom:16px;border:1px solid var(--border);border-radius:12px;overflow:hidden}
        .phase-header{display:flex;align-items:center;gap:16px;padding:20px;background:#f9fafb;cursor:pointer}
        .phase-header:hover{background:#f3f4f6}
        .phase-indicator{width:40px;height:40px;background:#1f2937;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
        .phase-info{flex:1}
        .phase-info h3{font-size:16px;font-weight:600;margin-bottom:4px}
        .phase-info p{font-size:14px;color:var(--muted);margin-bottom:8px}
        .phase-meta{display:flex;gap:16px;font-size:13px;color:#9ca3af}
        .phase-toggle{color:#9ca3af;font-size:12px}
        .phase-lessons{padding:16px;background:#fff;display:flex;flex-direction:column;gap:12px}
        .lesson-item{display:flex;align-items:center;gap:16px;padding:16px;background:#f9fafb;border-radius:10px}
        .lesson-item:hover{background:#f3f4f6}
        .lesson-item.completed{opacity:0.7}
        .lesson-status{width:24px;height:24px;border:2px solid #d1d5db;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
        .lesson-item.completed .lesson-status{background:var(--success);border-color:var(--success);color:#fff}
        .lesson-info{flex:1}
        .lesson-header{display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap}
        .lesson-id{font-size:12px;font-weight:600;color:#9ca3af;background:#e5e7eb;padding:2px 8px;border-radius:4px}
        .lesson-header h4{font-size:15px;font-weight:600}
        .lesson-required{font-size:11px;background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:4px}
        .lesson-meta{display:flex;gap:12px;font-size:12px;color:#9ca3af}
        .lesson-start-btn{background:#1f2937;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;flex-shrink:0}
        .lesson-start-btn:hover:not(:disabled){background:#374151}
        .lesson-start-btn:disabled{background:#9ca3af;cursor:default}
        
        .depth-legend{background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px}
        .depth-legend h3{font-size:14px;font-weight:600;margin-bottom:16px}
        .depth-items{display:flex;flex-wrap:wrap;gap:12px}
        .depth-item{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#fff;border-radius:8px;border-left:4px solid var(--depth-color)}
        .depth-level{width:24px;height:24px;background:var(--depth-color);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700}
        .depth-label{font-weight:600;font-size:13px}
        .competency-category{margin-bottom:24px}
        .competency-category h3{display:flex;align-items:center;gap:8px;font-size:16px;margin-bottom:12px}
        .cat-icon{font-size:20px}
        .competency-list{display:flex;flex-direction:column;gap:8px}
        .competency-item{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#fff;border:1px solid var(--border);border-radius:10px}
        .comp-info h4{font-size:14px;font-weight:600;margin-bottom:2px}
        .comp-info p{font-size:13px;color:var(--muted)}
        .comp-depth{display:flex;align-items:center;gap:8px;padding:6px 12px;background:#f3f4f6;border-radius:8px}
        .comp-depth-num{width:24px;height:24px;background:var(--depth-color);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700}
        .comp-depth-label{font-size:13px;font-weight:500}
        
        .cert-card-lg{background:linear-gradient(135deg,#1f2937,#374151);color:#fff;border-radius:16px;padding:32px;text-align:center}
        .cert-badge-lg{font-size:64px;margin-bottom:16px}
        .cert-card-lg h2{font-size:24px;margin-bottom:24px}
        .cert-requirements{background:rgba(255,255,255,0.1);border-radius:12px;padding:20px;text-align:left}
        .cert-requirements h3{font-size:16px;margin-bottom:12px}
        .cert-requirements ul{list-style:none}
        .cert-requirements li{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.1);font-size:14px}
        .cert-requirements li:last-child{border-bottom:none}
        .req-icon{font-size:18px}
        
        /* ADMIN STYLES */
        .admin-page main{max-width:1100px}
        .admin-tabs{display:flex;gap:8px;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .admin-tabs button{padding:9px 18px;background:transparent;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:13px;font-weight:500;color:var(--muted);cursor:pointer}
        .admin-tabs button.active{background:var(--primary);border-color:var(--primary);color:#fff}
        
        .admin-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .admin-stat{display:flex;align-items:center;gap:16px;background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:20px}
        .admin-stat svg{color:var(--primary)}
        .admin-stat .big{display:block;font-size:28px;font-weight:700}
        .admin-stat small{color:var(--muted);font-size:13px}
        
        .admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
        .admin-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:20px}
        .admin-card.full{grid-column:1/-1}
        .admin-card h3{display:flex;align-items:center;gap:8px;font-size:15px;margin-bottom:4px}
        .card-desc{color:var(--muted);font-size:13px;margin-bottom:16px}
        .card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
        .card-header h3{margin-bottom:0}
        
        .mini-list{display:flex;flex-direction:column;gap:8px}
        .mini-row{display:flex;align-items:center;gap:12px;padding:10px;background:var(--bg);border-radius:8px;cursor:pointer}
        .mini-row:hover{background:#e2e8f0}
        .mini-rank{width:20px;font-weight:600;color:var(--muted);font-size:13px}
        .mini-avatar{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-size:12px;font-weight:600}
        .mini-info{flex:1}
        .mini-info span{display:block;font-size:14px;font-weight:500}
        .mini-info small{color:var(--muted);font-size:12px}
        
        .topic-bars{display:flex;flex-direction:column;gap:12px}
        .topic-bar-row{display:flex;align-items:center;gap:12px}
        .topic-bar-label{width:100px;font-size:13px;font-weight:500}
        .topic-bar-bg{flex:1;height:10px;background:var(--bg);border-radius:5px;overflow:hidden}
        .topic-bar-fill{height:100%;border-radius:5px}
        .topic-bar-val{width:40px;text-align:right;font-size:13px;font-weight:600}
        
        .users-table{border:1px solid var(--border);border-radius:8px;overflow:hidden}
        .users-header,.users-row{display:grid;grid-template-columns:2fr 1.2fr .8fr .8fr .8fr 1fr .8fr;align-items:center;padding:12px 16px;gap:8px}
        .users-header{background:var(--bg);font-size:12px;font-weight:600;color:var(--muted)}
        .users-row{border-top:1px solid var(--border);font-size:13px}
        .users-row:hover{background:#f8fafc}
        .user-cell{display:flex;align-items:center;gap:10px}
        .user-avatar-sm{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-size:11px;font-weight:600;flex-shrink:0}
        .user-cell div{min-width:0}
        .user-name{display:block;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .user-cell small{color:var(--muted);font-size:11px}
        .xp{font-weight:600}
        .good{color:var(--success);font-weight:500}
        .ok{color:#d97706;font-weight:500}
        .low{color:var(--error);font-weight:500}
        .streak-active{color:var(--success)}
        .streak-broken{color:var(--error)}
        .user-actions{display:flex;gap:6px}
        
        .progress-table{border:1px solid var(--border);border-radius:8px;overflow:hidden}
        .progress-header,.progress-row{display:grid;grid-template-columns:1.5fr repeat(6,1fr);align-items:center;padding:10px 14px;gap:8px}
        .progress-header{background:var(--bg);font-size:11px;font-weight:600;color:var(--muted)}
        .progress-row{border-top:1px solid var(--border);font-size:13px}
        .user-cell-sm{display:flex;align-items:center;gap:8px}
        .user-avatar-xs{width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-size:10px;font-weight:600}
        .prog-cell{font-weight:500;text-align:center}
        .prog-cell.high{color:var(--success)}
        .prog-cell.med{color:#d97706}
        .prog-cell.low{color:var(--error)}
        .prog-cell.overall{font-weight:700}
        
        .user-detail-header{display:flex;align-items:center;gap:20px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--border)}
        .user-detail-avatar{width:72px;height:72px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-size:24px;font-weight:600}
        .user-detail-info{flex:1}
        .user-detail-info h2{font-size:22px;margin-bottom:4px}
        .user-detail-info p{color:var(--muted);font-size:14px}
        .user-detail-info .company{color:var(--text);font-weight:500}
        .user-detail-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}
        .user-detail-stats>div{background:var(--bg);border-radius:8px;padding:16px;text-align:center}
        .user-detail-stats span{display:block;font-size:24px;font-weight:700;color:var(--primary)}
        .user-detail-stats small{font-size:12px;color:var(--muted)}
        .user-detail-section{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:20px}
        .user-detail-section h3{font-size:15px;margin-bottom:16px}
        .cert-badges{display:flex;gap:8px;flex-wrap:wrap}
        .cert-badge{padding:6px 14px;border-radius:20px;color:#fff;font-size:13px;font-weight:500}
        
        .compose-form{max-width:600px}
        .message-list{display:flex;flex-direction:column;gap:12px}
        .message-item{background:var(--bg);border-radius:8px;padding:14px}
        .message-header{display:flex;align-items:center;gap:12px;margin-bottom:8px}
        .message-to{font-weight:600;font-size:13px}
        .message-subject{font-weight:600;font-size:14px}
        .message-date{font-size:12px;color:var(--muted)}
        .unread-badge{background:var(--primary);color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:500}
        .message-body{font-size:14px;color:var(--muted);line-height:1.5}
        
        .modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:100}
        .modal{background:#fff;border-radius:var(--radius);width:100%;max-width:500px;max-height:90vh;overflow:auto}
        .modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid var(--border)}
        .modal-header h3{font-size:17px}
        .modal-body{padding:20px}
        .modal-footer{display:flex;justify-content:flex-end;gap:12px;padding:20px;border-top:1px solid var(--border)}
        .modal-footer .btn-primary{width:auto}
        
        .empty{color:var(--muted);text-align:center;padding:20px;font-size:14px}
        
        .lb-list{display:flex;flex-direction:column;gap:8px}
        .lb-row{display:flex;align-items:center;gap:14px;padding:14px 18px;background:#fff;border:1px solid var(--border);border-radius:8px}
        .lb-rank{width:24px;font-weight:700;color:var(--muted)}
        .lb-avatar{width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-weight:600}
        .lb-info{flex:1}
        .lb-name{display:block;font-weight:600}
        .lb-company{font-size:13px;color:var(--muted)}
        .lb-right{text-align:right}
        .lb-score{font-weight:700;color:var(--primary)}
        
        .certs-list{display:flex;flex-direction:column;gap:14px}
        .cert-item{display:flex;align-items:center;gap:18px;padding:20px;background:#fff;border:1px solid var(--border);border-radius:var(--radius)}
        .cert-icon{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:10px;color:#fff;font-weight:700;font-size:18px}
        .cert-info{flex:1}
        .cert-info h3{font-size:15px;font-weight:600;margin-bottom:6px}
        .cert-reqs{display:flex;gap:12px;font-size:12px;color:var(--muted)}
        
        .profile-main{text-align:center}
        .profile-top{margin-bottom:28px}
        .profile-avatar{width:72px;height:72px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-size:24px;font-weight:600}
        .profile-top h2{font-size:22px;margin-bottom:4px}
        .profile-top p{color:var(--muted)}
        .profile-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
        .profile-stats>div{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center}
        .profile-stats span{display:block;font-size:22px;font-weight:700;color:var(--primary)}
        .profile-stats small{font-size:12px;color:var(--muted)}
        
        .ref section{margin-bottom:32px}
        .ref h2{font-size:16px;font-weight:600;margin-bottom:14px}
        .table-wrap{background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
        table{width:100%;border-collapse:collapse}
        th,td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--border);font-size:13px}
        th{background:var(--bg);font-weight:600;color:var(--muted)}
        .code-cell{font-family:monospace;font-weight:600;color:var(--primary)}
        .code-example{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:24px}
        .code-breakdown{display:flex;justify-content:center;gap:4px;margin-bottom:12px;font-family:monospace;font-size:24px;font-weight:700}
        .code-part{padding:8px 12px;border-radius:6px}
        .code-part.p1{background:#fee2e2;color:#dc2626}
        .code-part.p2{background:#dbeafe;color:#2563eb}
        .code-part.p3{background:#dcfce7;color:#059669}
        .code-part.p4{background:#fef3c7;color:#d97706}
        .code-labels{display:flex;justify-content:center;gap:24px;font-size:12px;color:var(--muted)}
        
        @media(max-width:1024px){.admin-stats{grid-template-columns:repeat(2,1fr)}.admin-grid{grid-template-columns:1fr}.users-header,.users-row{grid-template-columns:2fr 1fr 1fr 1fr}.users-header span:nth-child(2),.users-row span:nth-child(2),.users-header span:nth-child(6),.users-row span:nth-child(6){display:none}}
        @media(max-width:768px){.stats-row{grid-template-columns:1fr 1fr}.topics-grid{grid-template-columns:1fr}.nav-cards{grid-template-columns:1fr 1fr}.profile-stats{grid-template-columns:1fr 1fr}.user-detail-stats{grid-template-columns:repeat(3,1fr)}.progress-header,.progress-row{grid-template-columns:1.5fr repeat(3,1fr)}.progress-header span:nth-child(3),.progress-row span:nth-child(3),.progress-header span:nth-child(4),.progress-row span:nth-child(4),.progress-header span:nth-child(6),.progress-row span:nth-child(6){display:none}.role-cards{grid-template-columns:1fr}.lp-header-content{flex-direction:column;text-align:center}.lp-tabs{flex-direction:column}.competency-item{flex-direction:column;align-items:flex-start;gap:12px}}
      `}</style>
      
      {!auth ? <AuthScreen /> : (<>
        {view === 'home' && <HomeScreen />}
        {view === 'session' && <SessionScreen />}
        {view === 'results' && <ResultsScreen />}
        {view === 'leaderboard' && <LeaderboardScreen />}
        {view === 'certs' && <CertsScreen />}
        {view === 'admin' && <AdminScreen />}
        {view === 'profile' && <ProfileScreen />}
        {view === 'reference' && <ReferenceScreen />}
        {view === 'itemcoderef' && <ItemCodeRefScreen />}
        {view === 'learningPaths' && <LearningPathsScreen />}
      </>)}
    </div>
  );
}
