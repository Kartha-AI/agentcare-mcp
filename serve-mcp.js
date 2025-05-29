#!/usr/bin/env node

import { exec } from 'child_process';
import path from 'path';
import http from 'http';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = promisify(exec);
const serverPath = path.join(__dirname, 'build/index.js');

// Environment variables needed for the MCP server
const env = {
  "OAUTH_CLIENT_ID": "4d752bc3-86b7-4a2c-a98a-fc9e24adb22e",
  "OAUTH_CLIENT_SECRET": "/Uqd/z0jJyCSNoCkAH8RXqHCtmcv690cwnRKmIELetll53RNrsZSlOP5mlEqojLPDtBBj1lUpvpesnoSJT4iRQ==",
  "OAUTH_TOKEN_HOST": "https://fhir.epic.com",
  "OAUTH_TOKEN_PATH": "/interconnect-fhir-oauth/oauth2/token",
  "OAUTH_AUTHORIZE_PATH": "/interconnect-fhir-oauth/oauth2/authorize",
  "OAUTH_AUTHORIZATION_METHOD": "body",
  "OAUTH_AUDIENCE": "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
  "OAUTH_CALLBACK_URL": "http://localhost:3456/oauth/callback",
  "OAUTH_SCOPES": "user/Patient.read user/Observation.read user/MedicationRequest.read user/Condition.read user/AllergyIntolerance.read user/Procedure.read user/CarePlan.read user/CareTeam.read user/Encounter.read user/Immunization.read",
  "OAUTH_CALLBACK_PORT": "3456",
  "FHIR_BASE_URL": "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
  "PUBMED_API_KEY": "your_pubmed_api_key",
  "TRIALS_API_KEY": "your_trials_api_key",
  "FDA_API_KEY": "your_fda_api_key"
};

// Start the MCP server
console.log('Starting AgentCare MCP server...');

// Create a new process with the appropriate environment variables
const child = exec('node ' + serverPath, { 
  env: { ...process.env, ...env },
  cwd: __dirname
});

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
  console.log(`MCP server process exited with code ${code}`);
});

// Create a simple HTTP server to let us know the launcher is running
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('AgentCare MCP launcher is running. The MCP server should be running in a separate process.\n');
});

server.listen(3458, () => {
  console.log('Launcher server running at http://localhost:3458/');
});

// Handle termination
process.on('SIGINT', () => {
  child.kill('SIGINT');
  server.close();
  process.exit(0);
});