# AgentCare MCP Dialysis Tools

This document provides an overview of the specialized dialysis-related MCP tools implemented in AgentCare MCP.

## Overview

The AgentCare MCP includes specialized tools for managing end-stage renal disease (ESRD) patients on dialysis. These tools are categorized into:

1. Basic Dialysis Information
2. Treatment Planning
3. Complication Monitoring
4. Nutritional and Mineral Management
5. Quality Measures and Outcomes

## Connection Setup

### Claude Desktop

1. Use the configuration file at `config/claude_desktop_simplified.json`
2. In Claude Desktop, go to Settings → MCPs → Add MCP from file
3. Select the `claude_desktop_simplified.json` file
4. After adding, click "Connect" to connect to the MCP

### Goose

1. Use the configuration file at `config/goose_launcher.json`
2. In Goose, go to Extension → Core Extensions → MCP Launcher
3. Configure the extension using the `goose_launcher.json` file
4. Connect to the MCP using the "agentcare" name

## Basic Dialysis Tools

### Get Dialysis Sessions

```json
{
  "name": "get_dialysis_sessions",
  "arguments": {
    "patientId": "123456",
    "dateFrom": "2023-01-01",
    "dateTo": "2023-06-01",
    "status": "completed",
    "location": "Davita Dialysis Center"
  }
}
```

### Track Dialysis Metrics

```json
{
  "name": "track_dialysis_metrics",
  "arguments": {
    "patientId": "123456",
    "metricType": "kt-v",
    "dateFrom": "2023-01-01",
    "dateTo": "2023-06-01",
    "format": "trend"
  }
}
```

### Manage Vascular Access

```json
{
  "name": "manage_vascular_access",
  "arguments": {
    "patientId": "123456",
    "accessType": "fistula",
    "includeHistory": true
  }
}
```

## Treatment Planning Tools

### Schedule Dialysis Session

```json
{
  "name": "schedule_dialysis_session",
  "arguments": {
    "patientId": "123456",
    "sessionDate": "2023-07-15",
    "startTime": "14:00",
    "duration": 240,
    "modality": "hemodialysis",
    "location": "Davita Dialysis Center",
    "notes": "Patient prefers cooler dialysate"
  }
}
```

### Get Dialysis Prescription

```json
{
  "name": "get_dialysis_prescription",
  "arguments": {
    "patientId": "123456",
    "modality": "hemodialysis",
    "active": true
  }
}
```

### Compare Dialysis Modalities

```json
{
  "name": "compare_dialysis_modalities",
  "arguments": {
    "patientId": "123456",
    "metrics": ["clearance", "quality-of-life", "cardiovascular-impact"],
    "timeframe": "6m"
  }
}
```

## Complication Monitoring Tools

### Track Intradialytic Events

```json
{
  "name": "track_intradialytic_events",
  "arguments": {
    "patientId": "123456",
    "eventTypes": ["hypotension", "cramping"],
    "dateFrom": "2023-01-01",
    "dateTo": "2023-06-01",
    "format": "trend"
  }
}
```

### Monitor Access Complications

```json
{
  "name": "monitor_access_complications",
  "arguments": {
    "patientId": "123456",
    "accessType": "fistula",
    "complicationTypes": ["infection", "stenosis", "thrombosis"]
  }
}
```

### Assess Bleeding Risk

```json
{
  "name": "assess_bleeding_risk",
  "arguments": {
    "patientId": "123456",
    "includeMedications": true,
    "includeHistory": true,
    "scoreType": "has-bled"
  }
}
```

## Nutritional and Mineral Management Tools

### Track Dialysis Diet

```json
{
  "name": "track_dialysis_diet",
  "arguments": {
    "patientId": "123456",
    "nutrients": ["phosphorus", "potassium", "sodium"],
    "format": "trend"
  }
}
```

### Manage Mineral Bone Disorder

```json
{
  "name": "manage_mineral_bone_disorder",
  "arguments": {
    "patientId": "123456",
    "parameters": ["calcium", "phosphorus", "pth", "vitamin-d"],
    "includeRecommendations": true
  }
}
```

### Calculate Protein Nitrogen Appearance

```json
{
  "name": "calculate_protein_nitrogen_appearance",
  "arguments": {
    "patientId": "123456",
    "includeTrend": true
  }
}
```

## Quality Measures and Outcomes Tools

### Report Dialysis Quality Metrics

```json
{
  "name": "report_dialysis_quality_metrics",
  "arguments": {
    "patientId": "123456",
    "metrics": ["adequacy", "anemia", "mineral-bone"],
    "format": "patient"
  }
}
```

### Predict Hospitalization Risk

```json
{
  "name": "predict_hospitalization_risk",
  "arguments": {
    "patientId": "123456",
    "timeframe": "30-day",
    "includeContributingFactors": true
  }
}
```

### Analyze Dialysis Population Trends

```json
{
  "name": "analyze_dialysis_population_trends",
  "arguments": {
    "patientId": "123456",
    "metrics": ["mortality", "hospitalization", "adequacy"],
    "benchmarkType": "facility"
  }
}
```

## Troubleshooting

If you encounter issues connecting to the MCP server:

1. Ensure the build is up-to-date by running `npm run build`
2. Try running the server directly with `node build/index.js`
3. Check that all required environment variables are set in the configuration
4. If permissions issues occur, try the launcher script: `node serve-mcp.js`

## Implementation Notes

- The FHIR interface uses standard FHIR resources like Procedure, Observation, and ServiceRequest
- Dialysis sessions use Procedure resources with dialysis-specific codes
- Vascular access is tracked as Procedure with specialized access type coding
- Dialysis metrics use Observation resources with appropriate LOINC codes
- All tools include detailed formatting functions to make the data human-readable