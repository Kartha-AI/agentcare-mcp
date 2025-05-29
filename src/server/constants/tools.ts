export const TOOL_DEFINITIONS = [
  {
    name: "find_patient",
    description: "Search for a patient by demographics",
    inputSchema: {
      type: "object",
      properties: {
        lastName: { type: "string" },
        firstName: { type: "string" },
        birthDate: { type: "string", description: "YYYY-MM-DD format" },
        gender: { 
          type: "string",
          enum: ["male", "female", "other", "unknown"]
        }
      },
      required: ["lastName"]
    }
  },
  {
    name: "get_dialysis_sessions",
    description: "Retrieve details of recent dialysis treatments including duration, ultrafiltration volume, and complications",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" },
        status: {
          type: "string",
          enum: ["in-progress", "completed", "stopped", "not-done"]
        },
        location: { type: "string", description: "Location of dialysis (e.g., in-center, home)" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "track_dialysis_metrics",
    description: "Monitor key metrics like Kt/V, URR (urea reduction ratio), and fluid removal targets",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        metricType: { 
          type: "string",
          enum: ["kt-v", "urr", "fluid-removal", "all"],
          description: "Type of dialysis metric to retrieve"
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" },
        format: {
          type: "string",
          enum: ["latest", "trend", "summary"],
          description: "How to format the results"
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "manage_vascular_access",
    description: "Track access type (fistula/graft/catheter), creation date, assessment results, and complications",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        accessType: { 
          type: "string",
          enum: ["fistula", "graft", "catheter", "all"],
          description: "Type of vascular access"
        },
        includeHistory: { 
          type: "boolean",
          description: "Include historical access sites and complications"
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_observations",
    description: "Get observations (vitals, labs) for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        code: { type: "string", description: "LOINC or SNOMED code" },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" },
        status: { 
          type: "string",
          enum: ["registered", "preliminary", "final", "amended", "corrected", "cancelled"]
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_conditions",
    description: "Get medical conditions/diagnoses for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: { 
          type: "string",
          enum: ["active", "inactive", "resolved"]
        },
        onsetDate: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_medications",
    description: "Get medication orders for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: {
          type: "string",
          enum: ["active", "completed", "stopped", "on-hold"]
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_encounters",
    description: "Get healthcare encounters/visits for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: {
          type: "string",
          enum: ["planned", "arrived", "in-progress", "finished", "cancelled"]
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_allergies",
    description: "Get allergies and intolerances for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: { 
          type: "string",
          enum: ["active", "inactive", "resolved"]
        },
        type: {
          type: "string",
          enum: ["allergy", "intolerance"]
        },
        category: {
          type: "string",
          enum: ["food", "medication", "environment", "biologic"]
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_procedures",
    description: "Get procedures performed on a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: {
          type: "string",
          enum: ["preparation", "in-progress", "completed", "entered-in-error"]
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_careplans",
    description: "Get care plans for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: {
          type: "string",
          enum: ["draft", "active", "suspended", "completed", "cancelled"]
        },
        category: { type: "string" },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_vital_signs",
    description: "Get patient's vital signs history",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        timeframe: { 
          type: "string",
          description: "e.g., 3m, 6m, 1y, all"
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_lab_results",
    description: "Get patient's lab results",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        category: { 
          type: "string",
          description: "e.g., CBC, METABOLIC, LIPIDS, ALL"
        },
        timeframe: { type: "string" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_medications_history",
    description: "Get patient's medication history including changes",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        includeDiscontinued: { type: "boolean" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_appointments",
    description: "Get patient's Appointments",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: 'search-pubmed',
    description: 'Search PubMed for medical literature',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        maxResults: { type: 'number' }
      },
      required: ['query']
    }
  },
  {
    name: 'search-trials',
    description: 'Search ClinicalTrials.gov for relevant studies',
    inputSchema: {
      type: 'object',
      properties: {
        condition: { type: 'string' },
        location: { type: 'string' }
      },
      required: ['condition']
    }
  },
  {
    name: 'get-drug-info',
    description: 'Get Drug details by a generic name',
    inputSchema: {
      type: 'object',
      properties: {
        genericName: { type: 'string' },
      },
      required: ['genericName']
    }
  },
  
  // Dialysis Treatment Planning Tools
  {
    name: "schedule_dialysis_session",
    description: "Create or update scheduled dialysis appointments",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        sessionDate: { type: "string", description: "YYYY-MM-DD" },
        startTime: { type: "string", description: "HH:MM format (24-hour)" },
        duration: { type: "number", description: "Duration in minutes" },
        modality: { 
          type: "string", 
          enum: ["hemodialysis", "peritoneal-dialysis", "hemodiafiltration"],
          description: "Type of dialysis treatment" 
        },
        location: { type: "string", description: "Treatment location (e.g., center name, home)" },
        notes: { type: "string", description: "Additional instructions or notes" }
      },
      required: ["patientId", "sessionDate", "startTime", "duration", "modality"]
    }
  },
  {
    name: "get_dialysis_prescription",
    description: "Retrieve dialysis prescription details (time, dialysate, flow rates)",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        modality: { 
          type: "string", 
          enum: ["hemodialysis", "peritoneal-dialysis", "hemodiafiltration", "all"],
          description: "Type of dialysis prescription to retrieve" 
        },
        active: { 
          type: "boolean", 
          description: "If true, only return active prescriptions" 
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "compare_dialysis_modalities",
    description: "Compare outcomes between hemodialysis and peritoneal dialysis options",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        metrics: { 
          type: "array", 
          description: "Specific metrics to compare (e.g., clearance, quality of life, etc.)",
          items: { type: "string" }
        },
        timeframe: { 
          type: "string", 
          description: "Timeframe for comparison (e.g., 3m, 6m, 1y)" 
        }
      },
      required: ["patientId"]
    }
  },
  
  // Complication Monitoring Tools
  {
    name: "track_intradialytic_events",
    description: "Monitor hypotension, cramping, and other complications during dialysis sessions",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        eventTypes: { 
          type: "array", 
          description: "Specific types of events to track",
          items: { 
            type: "string",
            enum: ["hypotension", "cramping", "nausea", "vomiting", "access-issues", "bleeding", "all"]
          }
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" },
        format: {
          type: "string",
          enum: ["latest", "trend", "summary"],
          description: "How to format the results"
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "monitor_access_complications",
    description: "Specialized tracking for access-specific issues (infections, stenosis)",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        accessType: { 
          type: "string",
          enum: ["fistula", "graft", "catheter", "all"],
          description: "Type of vascular access"
        },
        complicationTypes: { 
          type: "array", 
          description: "Specific types of complications to track",
          items: { 
            type: "string",
            enum: ["infection", "stenosis", "thrombosis", "aneurysm", "infiltration", "all"]
          }
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "assess_bleeding_risk",
    description: "Calculate bleeding risk scores for dialysis patients on anticoagulants",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        includeMedications: { 
          type: "boolean", 
          description: "Include anticoagulant medications in assessment" 
        },
        includeHistory: { 
          type: "boolean", 
          description: "Include history of bleeding events in assessment" 
        },
        scoreType: {
          type: "string",
          enum: ["has-bled", "hemorr2hages", "atria", "orbit", "custom"],
          description: "Type of bleeding risk score to calculate"
        }
      },
      required: ["patientId"]
    }
  },
  
  // Nutritional and Mineral Management Tools
  {
    name: "track_dialysis_diet",
    description: "Monitor dietary compliance for phosphorus, potassium, and sodium",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        nutrients: { 
          type: "array", 
          description: "Specific nutrients to track",
          items: { 
            type: "string",
            enum: ["phosphorus", "potassium", "sodium", "protein", "fluid", "all"]
          }
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" },
        format: {
          type: "string",
          enum: ["latest", "trend", "summary"],
          description: "How to format the results"
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "manage_mineral_bone_disorder",
    description: "Track calcium, phosphorus, PTH, vitamin D status with treatment recommendations",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        parameters: { 
          type: "array", 
          description: "Specific MBD parameters to track",
          items: { 
            type: "string",
            enum: ["calcium", "phosphorus", "pth", "vitamin-d", "all"]
          }
        },
        includeRecommendations: { 
          type: "boolean", 
          description: "Include treatment recommendations based on values" 
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "calculate_protein_nitrogen_appearance",
    description: "Calculate protein catabolic rate and nitrogen balance",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" },
        includeTrend: { 
          type: "boolean", 
          description: "Include trend analysis over time" 
        }
      },
      required: ["patientId"]
    }
  },
  
  // Quality Measures and Outcomes Tools
  {
    name: "report_dialysis_quality_metrics",
    description: "Generate reports on CMS quality measures for dialysis units",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        metrics: { 
          type: "array", 
          description: "Specific quality metrics to report",
          items: { 
            type: "string",
            enum: ["adequacy", "anemia", "mineral-bone", "infection", "hospitalization", "all"]
          }
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" },
        format: {
          type: "string",
          enum: ["patient", "facility", "comparison"],
          description: "How to format the results"
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "predict_hospitalization_risk",
    description: "Calculate risk score for hospitalization based on current metrics",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        timeframe: { 
          type: "string", 
          enum: ["30-day", "90-day", "6-month", "1-year"],
          description: "Prediction timeframe" 
        },
        includeContributingFactors: { 
          type: "boolean", 
          description: "Include factors contributing to risk score" 
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "analyze_dialysis_population_trends",
    description: "Compare patient outcomes to facility benchmarks",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        metrics: { 
          type: "array", 
          description: "Specific metrics to analyze",
          items: { 
            type: "string",
            enum: ["mortality", "hospitalization", "adequacy", "access", "all"]
          }
        },
        benchmarkType: {
          type: "string",
          enum: ["facility", "regional", "national", "all"],
          description: "Type of benchmarks to compare against"
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  }
]; 