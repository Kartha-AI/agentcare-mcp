import axios, { AxiosInstance } from "axios";
import { ResourceType } from "../../types.js";
import {calculateTimeframeDate} from "./Helper.js"

export class FhirClient { 
  private client: AxiosInstance;
  private accessToken!: string;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        //Authorization: `Bearer ${apiKey}`,
        Accept: "application/fhir+json",
        Authorization: `Bearer ${this.accessToken}`
      },
    });
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    this.client.defaults.headers.Authorization = `Bearer ${this.accessToken}`;
  }

  async search(resourceType: string, params = {}) {
    const searchParams = new URLSearchParams(params);
    const response = await this.client.get(`/${resourceType}?${searchParams}`)
    
    return response.data;
  }

  async get(resourceType: string, id: string) {
    const response = await this.client.get(`/${resourceType}/${id}`)
  
    return response.data
  }

  async executeQuery(queryParams: any) {
    const params = this.buildSearchParams(queryParams);
    const response = await this.client.get(`/${queryParams.resourceType}?${params}`);
    return this.formatResults(response.data, queryParams.resourceType);
  }

  async getActiveConditions() {
    const response = await this.client.get('/Condition?clinical-status=active');
    return this.formatResponse("fhir://Condition/active", response.data);
  }

  async findPatient(args: any) {
    const params = new URLSearchParams();
    if (args.lastName) params.append('family', args.lastName);
    if (args.firstName) params.append('given', args.firstName);
    if (args.birthDate) params.append('birthdate', args.birthDate);

    const response = await this.client.get(`/Patient?${params}`);
    
    // Check if we have results
    if (!response.data?.entry?.[0]?.resource) {
        return this.formatResponse("fhir://Patient/search", { message: "No patients found" });
    }

    const resource = response.data.entry[0].resource;
    const name = resource.name?.[0] ?? {};
    const address = resource.address?.[0] ?? {};

    const patient = {
        name: name.given?.[0] ?? 'Unknown',
        familyName: name.family ?? 'Unknown',
        dob: resource.birthDate ?? 'Unknown',
        gender: resource.gender ?? 'Unknown',
        address: address.line?.[0] ?? 'Unknown',
        city: address.city ?? 'Unknown',
        state: address.state ?? 'Unknown',
        zip: address.postalCode ?? 'Unknown',
        id: resource.id ?? 'Unknown'
    };

    return this.formatResponse("fhir://Patient/search", patient);
  }


  handleError(error: any) {
    const errorMessage = axios.isAxiosError(error)
      ? `FHIR API error: ${error.response?.data?.issue?.[0]?.details?.text ?? error.message}`
      : error.message;
    return { content: [{ type: "text", text: errorMessage }], isError: true };
  }

  private buildSearchParams(queryParams: any) {
    const params = new URLSearchParams();
    if (queryParams.codes?.length) params.append('code', queryParams.codes.join(','));
    if (queryParams.dateRange) {
      if (queryParams.dateRange.start) params.append('date', `ge${queryParams.dateRange.start}`);
      if (queryParams.dateRange.end) params.append('date', `le${queryParams.dateRange.end}`);
    }
    return params;
  }

  private formatResults(data: any, resourceType: ResourceType) {
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  private formatResponse(uri: string, data: any) {
    
    return {
        content: [{
            type: "text",
            text: JSON.stringify(data, null, 2)
        }]
    }
  }

  async getPatientObservations(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    if (args.code) params.append('code', args.code);
    if (args.status) params.append('status', args.status);
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);

    const response = await this.client.get(`/Observation?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/observations`, response.data);
  }

  async getPatientConditions(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    if (args.status) params.append('clinical-status', args.status);
    if (args.onsetDate) params.append('onset-date', args.onsetDate);

    const response = await this.client.get(`/Condition?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/conditions`, response.data);
  }

  async getPatientMedications(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    if (args.status) params.append('status', args.status);

    const response = await this.client.get(`/MedicationRequest?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/medications`, response.data);
  }

  async getPatientEncounters(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    if (args.status) params.append('status', args.status);
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);

    const response = await this.client.get(`/Encounter?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/encounters`, response.data);
  }

  async getPatientAllergies(args: any) {
    const params = new URLSearchParams();
    params.append('patient', args.patientId);
    if (args.status) params.append('clinical-status', args.status);
    if (args.type) params.append('type', args.type);
    if (args.category) params.append('category', args.category);

    const response = await this.client.get(`/AllergyIntolerance?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/allergies`, response.data);
  }

  async getPatientProcedures(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    if (args.status) params.append('status', args.status);
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);

    const response = await this.client.get(`/Procedure?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/procedures`, response.data);
  }

  async getPatientCareTeam(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    if (args.status) params.append('status', args.status);

    const response = await this.client.get(`/CareTeam?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/careteam`, response.data);
  }

  async getPatientCarePlans(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    if (args.status) params.append('status', args.status);
    if (args.category) params.append('category', args.category);
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);

    const response = await this.client.get(`/CarePlan?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/careplans`, response.data);
  }

  async getPatientVitalSigns(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);

    const response = await this.client.get(`/Observation?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/vital-signs`, response.data);
  }

  async getMedicationHistory(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);

    const response = await this.client.get(`/MedicationStatement?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/medication-history`, response.data);
  }

  async getPatientLabResults(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);

    const response = await this.client.get(`/Observation?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/lab-results`, response.data);
  }
  async getPatientAppointments(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);

    const response = await this.client.get(`/Appointment?${params}`);
    return this.formatResponse(`fhir://Patient/${args.patientId}/appointments`, response.data);
  }
  
  // Dialysis-specific methods
  async getDialysisSessions(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    params.append('category', 'dialysis');
    
    // Add optional filters
    if (args.status) params.append('status', args.status);
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);
    if (args.location) params.append('location', args.location);
    
    // Retrieve dialysis sessions from the Procedure resource
    // In FHIR, dialysis procedures are typically represented as Procedure resources
    const response = await this.client.get(`/Procedure?${params}`);
    
    // Import the dialysis formatter
    const { formatDialysisSessions } = await import("./Helper.js");
    
    // Format the response
    const formattedResponse = formatDialysisSessions(response.data);
    
    return this.formatResponse(`fhir://Patient/${args.patientId}/dialysis-sessions`, {
      sessions: response.data,
      formatted: formattedResponse
    });
  }
  
  async getDialysisMetrics(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    params.append('category', 'laboratory');
    
    // Define appropriate date filters
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);
    
    // Define LOINC codes for dialysis metrics based on metricType
    const metricType = args.metricType || 'all';
    const format = args.format || 'latest';
    
    // Retrieve observations containing dialysis metrics
    const response = await this.client.get(`/Observation?${params}`);
    
    // Import the metric formatter
    const { formatDialysisMetrics } = await import("./Helper.js");
    
    // Format the response
    const formattedResponse = formatDialysisMetrics(response.data, metricType, format);
    
    return this.formatResponse(`fhir://Patient/${args.patientId}/dialysis-metrics`, {
      metrics: response.data,
      formatted: formattedResponse
    });
  }
  
  async getVascularAccess(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    params.append('category', 'vascular-access');
    
    // Add filters for dates if provided
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);
    
    // Add filter for specific access type if provided
    if (args.accessType && args.accessType !== 'all') {
      if (args.accessType === 'fistula') {
        params.append('code', '34530-6'); // LOINC code for AV fistula
      } 
      else if (args.accessType === 'graft') {
        params.append('code', '34532-2'); // LOINC code for AV graft
      }
      else if (args.accessType === 'catheter') {
        params.append('code', '36818'); // CPT code for catheter placement
      }
    }
    
    // Retrieve vascular access information from Procedure resources
    const response = await this.client.get(`/Procedure?${params}`);
    
    // Import the vascular access formatter
    const { formatVascularAccess } = await import("./Helper.js");
    
    // Format the response
    const includeHistory = args.includeHistory === true;
    const formattedResponse = formatVascularAccess(response.data, includeHistory);
    
    return this.formatResponse(`fhir://Patient/${args.patientId}/vascular-access`, {
      access: response.data,
      formatted: formattedResponse
    });
  }
  
  // Dialysis Treatment Planning Tools
  async scheduleDialysisSession(args: any) {
    // This would typically involve creating or updating an Appointment resource
    // For now, we'll implement a placeholder that returns a dummy confirmation
    
    const appointmentResource = {
      resourceType: "Appointment",
      status: "booked",
      serviceType: [{
        coding: [{
          system: "http://terminology.hl7.org/CodeSystem/service-type",
          code: "DIALYSIS",
          display: "Dialysis"
        }]
      }],
      specialty: [{
        coding: [{
          system: "http://snomed.info/sct",
          code: "394802001",
          display: "Nephrology"
        }]
      }],
      appointmentType: {
        coding: [{
          system: "http://terminology.hl7.org/CodeSystem/v2-0276",
          code: "ROUTINE",
          display: "Routine"
        }]
      },
      start: `${args.sessionDate}T${args.startTime}:00`,
      end: this.calculateEndTime(args.sessionDate, args.startTime, args.duration),
      participant: [
        {
          actor: {
            reference: `Patient/${args.patientId}`
          },
          status: "accepted"
        },
        {
          actor: {
            display: args.location || "Dialysis Center"
          },
          status: "accepted"
        }
      ],
      comment: args.notes || ""
    };
    
    // In a real implementation, we would post this to the FHIR server
    // For now, we'll just return it directly
    
    return this.formatResponse(`fhir://Patient/${args.patientId}/dialysis-appointment`, {
      appointment: appointmentResource,
      message: "Dialysis session scheduled successfully",
      details: `${args.modality} session scheduled for ${args.sessionDate} at ${args.startTime} for ${args.duration} minutes at ${args.location || "Dialysis Center"}`
    });
  }
  
  async getDialysisPrescription(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    params.append('intent', 'order');
    
    // Add filter for type of dialysis
    if (args.modality && args.modality !== 'all') {
      const modalityCode = this.getModalityCode(args.modality);
      params.append('code', modalityCode);
    } else {
      params.append('category', 'dialysis-prescription');
    }
    
    // Only get active prescriptions if requested
    if (args.active === true) {
      params.append('status', 'active');
    }
    
    // Retrieve prescription from ServiceRequest or CarePlan resources
    const response = await this.client.get(`/ServiceRequest?${params}`);
    
    // For a real implementation, we would format the prescription data
    // For now, we'll just return a sample
    
    const samplePrescription = {
      hemodialysis: {
        frequency: "3 times per week",
        duration: "4 hours",
        dialyzer: "High-flux polysulfone",
        bloodFlow: "350-400 mL/min",
        dialysateFlow: "500 mL/min",
        dialysate: "Bicarbonate",
        anticoagulation: "Heparin 1000 units/hour",
        dryWeight: "72.5 kg",
        ufGoal: "2-3 L per session"
      }
    };
    
    return this.formatResponse(`fhir://Patient/${args.patientId}/dialysis-prescription`, {
      prescription: response.data,
      formatted: samplePrescription
    });
  }
  
  async compareDialysisModalities(args: any) {
    // This would typically involve complex analysis of patient data across modalities
    // For now, we'll implement a placeholder that returns a simulated comparison
    
    const comparisonData = {
      hemodialysis: {
        clearance: "Higher single-session clearance",
        schedule: "Typically 3 sessions per week, 4 hours each",
        lifestyle: "More restrictions on daily activities",
        dietaryRestrictions: "More stringent",
        hospitalizations: "May have higher rate of access-related hospitalizations"
      },
      peritonealDialysis: {
        clearance: "Lower single-session but more continuous clearance",
        schedule: "Daily treatment, often overnight",
        lifestyle: "More flexibility for daily activities",
        dietaryRestrictions: "Less stringent",
        hospitalizations: "May have higher rate of infection-related hospitalizations"
      },
      patientFactors: {
        residualKidneyFunction: "Better preserved with PD initially",
        cardiovascularStability: "Better with PD for unstable patients",
        abdomenAnatomy: "PD contraindicated with certain abdominal conditions",
        homeSituation: "PD requires adequate home environment and support",
        travelNeeds: "PD offers more travel flexibility"
      }
    };
    
    return this.formatResponse(`fhir://Patient/${args.patientId}/modality-comparison`, {
      comparison: comparisonData,
      recommendation: "Based on this patient's profile, peritoneal dialysis may be preferred due to residual kidney function and lifestyle preferences."
    });
  }
  
  // Complication Monitoring Tools
  async trackIntradialyticEvents(args: any) {
    const params = new URLSearchParams();
    params.append('patient', `${args.patientId}`);
    params.append('category', 'dialysis-event');
    
    // Add filters for dates if provided
    if (args.dateFrom) params.append('date', `ge${args.dateFrom}`);
    if (args.dateTo) params.append('date', `le${args.dateTo}`);
    
    // Add filter for event types if provided
    if (args.eventTypes && args.eventTypes.length > 0 && !args.eventTypes.includes('all')) {
      // This is simplified; in a real implementation we would map to actual codes
      const eventCodes = args.eventTypes.map((type: string) => this.getEventCode(type)).join(',');
      params.append('code', eventCodes);
    }
    
    // Retrieve events from Observation resources
    const response = await this.client.get(`/Observation?${params}`);
    
    // Sample data for placeholder purposes
    const eventsData = {
      summary: {
        totalSessions: 12,
        sessionsWithEvents: 5,
        eventRate: "41.7%",
        mostCommonEvent: "Hypotension"
      },
      events: [
        {
          date: "2023-05-10",
          type: "Hypotension",
          details: "BP dropped to 90/60 during 3rd hour of treatment",
          interventions: "Reduced UF rate, administered saline"
        },
        {
          date: "2023-05-03",
          type: "Cramping",
          details: "Severe calf cramping during last hour",
          interventions: "Administered saline, reduced UF goal"
        },
        {
          date: "2023-04-26",
          type: "Access Issues",
          details: "Poor flow rates from catheter",
          interventions: "Repositioned patient, reversed lines"
        }
      ]
    };
    
    // Format based on requested format
    const format = args.format || 'latest';
    let formattedResponse;
    
    if (format === 'trend') {
      formattedResponse = {
        trends: {
          hypotension: {
            rate: "Decreasing trend over last 3 months",
            correlation: "Correlates with dry weight adjustments"
          },
          cramping: {
            rate: "Stable frequency",
            correlation: "Associated with higher UF goals"
          }
        }
      };
    } else if (format === 'summary') {
      formattedResponse = eventsData.summary;
    } else {
      formattedResponse = eventsData.events;
    }
    
    return this.formatResponse(`fhir://Patient/${args.patientId}/intradialytic-events`, {
      events: response.data,
      formatted: formattedResponse
    });
  }
  
  async monitorAccessComplications(args: any) {
    // Similar implementation as trackIntradialyticEvents but focused on access complications
    return this.formatResponse(`fhir://Patient/${args.patientId}/access-complications`, {
      message: "Access complication monitoring feature is implemented as a placeholder"
    });
  }
  
  async assessBleedingRisk(args: any) {
    // Would involve complex risk calculation based on patient factors
    // For now, return a simulated risk assessment
    
    const riskFactors = {
      age: "73 years - Increased risk",
      priorBleeding: "History of GI bleed - Significantly increased risk",
      medications: [
        "Warfarin - Significantly increased risk",
        "Aspirin - Moderately increased risk"
      ],
      comorbidities: [
        "Liver disease - Moderately increased risk",
        "Uncontrolled hypertension - Slightly increased risk"
      ],
      labValues: [
        "Thrombocytopenia (Platelets 90k) - Moderately increased risk",
        "Elevated INR (2.7) - Significantly increased risk"
      ]
    };
    
    const scoreResults = {
      "has-bled": {
        score: 4,
        interpretation: "High risk of major bleeding",
        annualRisk: "8.7% annual risk of major bleeding"
      }
    };
    
    return this.formatResponse(`fhir://Patient/${args.patientId}/bleeding-risk`, {
      riskFactors: riskFactors,
      scoreResults: scoreResults,
      recommendations: [
        "Consider reducing warfarin target INR to 2.0-2.5",
        "Evaluate necessity of concurrent aspirin therapy",
        "Weekly CBC monitoring recommended",
        "Consider PPI for GI prophylaxis"
      ]
    });
  }
  
  // Nutritional and Mineral Management Tools
  async trackDialysisDiet(args: any) {
    // Simplified placeholder implementation
    return this.formatResponse(`fhir://Patient/${args.patientId}/dialysis-diet`, {
      message: "Dietary tracking feature is implemented as a placeholder"
    });
  }
  
  async manageMineralBoneDisorder(args: any) {
    // This would involve retrieving and analyzing lab values and medications
    // For now, we'll implement a placeholder with sample data
    
    const mbdParameters = {
      calcium: {
        latest: "9.2 mg/dL (2023-05-15)",
        target: "8.4-9.5 mg/dL",
        trend: "Stable",
        status: "Within target"
      },
      phosphorus: {
        latest: "5.8 mg/dL (2023-05-15)",
        target: "3.5-5.5 mg/dL",
        trend: "Increasing",
        status: "Above target"
      },
      pth: {
        latest: "420 pg/mL (2023-04-01)",
        target: "150-300 pg/mL",
        trend: "Increasing",
        status: "Above target"
      },
      "vitamin-d": {
        latest: "28 ng/mL (2023-03-15)",
        target: ">30 ng/mL",
        trend: "Stable",
        status: "Below target"
      }
    };
    
    const recommendations = {
      phosphorus: [
        "Increase sevelamer to 800mg TID with meals",
        "Review dietary phosphorus sources",
        "Recheck in 2 weeks"
      ],
      pth: [
        "Start cinacalcet 30mg daily",
        "Continue vitamin D analog at current dose",
        "Recheck PTH in 4 weeks"
      ],
      "vitamin-d": [
        "Start ergocalciferol 50,000 IU weekly for 8 weeks",
        "Recheck 25-OH vitamin D in 3 months"
      ]
    };
    
    return this.formatResponse(`fhir://Patient/${args.patientId}/mbd-management`, {
      parameters: mbdParameters,
      recommendations: args.includeRecommendations ? recommendations : undefined
    });
  }
  
  async calculateProteinNitrogenAppearance(args: any) {
    // This would involve complex calculations based on urea kinetics
    // For now, we'll implement a placeholder
    
    const pnaData: any = {
      latest: {
        value: "1.1 g/kg/day",
        date: "2023-05-15",
        interpretation: "Adequate protein intake",
        normalizedPNA: "1.1 g/kg/day",
        nitrogen: {
          intake: "12.5 g/day",
          output: "11.8 g/day",
          balance: "+0.7 g/day"
        }
      }
    };
    
    if (args.includeTrend) {
      pnaData.trend = {
        trend: "Stable over past 3 months",
        values: [
          { date: "2023-05-15", value: "1.1 g/kg/day" },
          { date: "2023-04-15", value: "1.0 g/kg/day" },
          { date: "2023-03-15", value: "1.1 g/kg/day" },
          { date: "2023-02-15", value: "1.2 g/kg/day" }
        ]
      };
    }
    
    return this.formatResponse(`fhir://Patient/${args.patientId}/pna-calculation`, pnaData);
  }
  
  // Quality Measures and Outcomes Tools
  async reportDialysisQualityMetrics(args: any) {
    // Simplified placeholder implementation
    return this.formatResponse(`fhir://Patient/${args.patientId}/quality-metrics`, {
      message: "Quality metrics feature is implemented as a placeholder"
    });
  }
  
  async predictHospitalizationRisk(args: any) {
    // Simplified placeholder implementation
    return this.formatResponse(`fhir://Patient/${args.patientId}/hospitalization-risk`, {
      message: "Hospitalization risk feature is implemented as a placeholder"
    });
  }
  
  async analyzeDialysisPopulationTrends(args: any) {
    // Simplified placeholder implementation
    return this.formatResponse(`fhir://Patient/${args.patientId}/population-trends`, {
      message: "Population trends feature is implemented as a placeholder"
    });
  }
  
  // Helper methods for dialysis-specific tools
  private calculateEndTime(date: string, startTime: string, durationMinutes: number): string {
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
    return endDateTime.toISOString();
  }
  
  private getModalityCode(modality: string): string {
    // Map modality to appropriate SNOMED or custom code
    switch (modality) {
      case 'hemodialysis':
        return '302497006'; // SNOMED CT code for hemodialysis
      case 'peritoneal-dialysis':
        return '264590008'; // SNOMED CT code for peritoneal dialysis
      case 'hemodiafiltration':
        return '410473004'; // SNOMED CT code for hemodiafiltration
      default:
        return '302497006'; // Default to hemodialysis
    }
  }
  
  private getEventCode(eventType: string): string {
    // Map event type to appropriate code
    switch (eventType) {
      case 'hypotension':
        return '45007003'; // SNOMED CT code for hypotension
      case 'cramping':
        return '57676002'; // SNOMED CT code for muscle cramp
      case 'nausea':
        return '422587007'; // SNOMED CT code for nausea
      case 'vomiting':
        return '422400008'; // SNOMED CT code for vomiting
      case 'access-issues':
        return 'dialysis-access-issue'; // Custom code
      case 'bleeding':
        return '131148009'; // SNOMED CT code for bleeding
      default:
        return ''; // No code for unknown type
    }
  }

  async getVitalSigns(patientId: string, timeframe?: string) {
    const parms: Record<string, string> = {
      patient: patientId,
      category: 'vital-signs',
      _sort: '-date',
      _count: '50'
    };
  
    if (timeframe) {
      const date = calculateTimeframeDate(timeframe);
      if (date) {
        parms["date"] = `ge${date}`;
      }
    }  
    return await this.client.get(`/Observation?${parms}`);
  }

  async getPatientSummaryData(patientId: string) {
    const [
      patient,
      conditions,
      medications,
      allergies,
      immunizations,
      procedures,
      carePlans,
      recentLabs,
      encounters,
      appointments
    ] = await Promise.all([
      this.get("Patient", patientId),
      this.search("Condition", { patient: patientId }),
      this.search("MedicationRequest", { patient: patientId}),
      this.search("AllergyIntolerance", { patient: patientId }),
      this.search("Immunization", { patient: patientId }),
      this.search("Procedure", { patient: patientId }),
      this.search("CarePlan", { patient: patientId}),
      this.getPatientLabData(patientId),
      this.search("Encounter", { patient: patientId }),
      this.search("Appointment", { patient: patientId })
    ]);

    return {
      patient,
      conditions,
      medications,
      allergies,
      immunizations,
      procedures,
      carePlans,
      recentLabs,
      encounters,
      appointments
    };
  }
  
  // Additional helper functions for other prompts
  async getPatientConditionData(patientId: string, timeframe?: string) {
    const searchParams: Record<string, string> = { 
      patient: patientId,
      _sort: "date"
    };
    
    if (timeframe) {
      const date = calculateTimeframeDate(timeframe);
      if (date) {
        searchParams["date"] = `ge${date}`;
      }
    }
  
    return await this.search("Condition", searchParams);
  }
  
  async getPatientLabData(patientId: string, labType?: string) {
    const searchParams: Record<string, string> = {
      patient: patientId,
      category: "laboratory",
      _sort: "-date"
    };
  
    if (labType) {
      searchParams["code"] = labType;
    }
  
    return await this.search("Observation", searchParams);
  }
  
  async  getPatientCareGapsData(patientId: string) {
    const [
      patient,
      immunizations,
      procedures,
      carePlans
    ] = await Promise.all([
      this.get("Patient", patientId),
      this.search("Immunization", { patient: patientId }),
      this.search("Procedure", { patient: patientId }),
      this.search("CarePlan", { patient: patientId, status: "active" })
    ]);
  
    return {
      patient,
      immunizations,
      procedures,
      carePlans
    };
  }
    
  getRelevantMetrics(observations: any[], condition: any): string[] {
    // Map conditions to relevant LOINC codes
    const metricMap:any = {
      'Diabetes': ['4548-4', '17856-6'], // HbA1c, Glucose
      'Hypertension': ['8480-6', '8462-4'], // Systolic BP, Diastolic BP
      'Hyperlipidemia': ['2093-3', '2571-8'], // Cholesterol, Triglycerides
    };
  
    const conditionName = condition.code?.coding?.[0]?.display || '';
    const relevantCodes = metricMap[conditionName] || [];
  
    return observations
      .filter((obs: any) => {
        const obsCode = obs.resource.code?.coding?.[0]?.code;
        return relevantCodes.includes(obsCode);
      })
      .map((obs: any) => {
        const value = obs.resource.valueQuantity?.value || 'No value';
        const unit = obs.resource.valueQuantity?.unit || '';
        const date = obs.resource.effectiveDateTime?.split('T')[0] || 'unknown date';
        const name = obs.resource.code?.coding?.[0]?.display || 'Unknown metric';
        return `${name}: ${value} ${unit} (${date})`;
      });
  }

  
  
  

}

