require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const Client = require('./models/Client');
const Lead = require('./models/Lead');
const User = require('./models/User');
const Activity = require('./models/Activity');

const app = express();
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ============================================
// LOGGING HELPER
// ============================================
function log(entryPoint, leadData = {}, step, result, details = {}) {
  const timestamp = new Date().toISOString();
  const leadId = leadData._id || leadData.leadId || 'PENDING';
  const state = leadData.rawState || leadData.state || 'UNKNOWN';
  
  console.log(`[${entryPoint}] ${timestamp} | LeadID: ${leadId} | State: "${state}" | Step: ${step} | Result: ${result}`, details);
}

function logError(entryPoint, leadData, step, error) {
  const timestamp = new Date().toISOString();
  const leadId = leadData?._id || leadData?.leadId || 'PENDING';
  const state = leadData?.rawState || leadData?.state || 'UNKNOWN';
  
  console.error(`[${entryPoint}] ${timestamp} | LeadID: ${leadId} | State: "${state}" | Step: ${step} | ERROR:`, {
    message: error.message,
    stack: error.stack
  });
}

// ============================================
// STATE NORMALIZATION HELPER
// ============================================
function normalizeState(state) {
  if (state === null || state === undefined) {
    console.warn(`[normalizeState] ${new Date().toISOString()} | State: null/undefined detected`);
    return null;
  }
  
  if (typeof state !== 'string') {
    console.warn(`[normalizeState] ${new Date().toISOString()} | State type: ${typeof state}, converting to string`);
    state = String(state);
  }
  
  const trimmed = state.trim().toUpperCase();
  
  if (trimmed === '') {
    console.warn(`[normalizeState] ${new Date().toISOString()} | State: empty string detected`);
    return null;
  }
  
  const stateAbbreviations = {
    'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR', 'CALIFORNIA': 'CA',
    'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE', 'FLORIDA': 'FL', 'GEORGIA': 'GA',
    'HAWAII': 'HI', 'IDAHO': 'ID', 'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA',
    'KANSAS': 'KS', 'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME', 'MARYLAND': 'MD',
    'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS', 'MISSOURI': 'MO',
    'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV', 'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ',
    'NEW MEXICO': 'NM', 'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'OHIO': 'OH',
    'OKLAHOMA': 'OK', 'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
    'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT', 'VERMONT': 'VT',
    'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV', 'WISCONSIN': 'WI', 'WYOMING': 'WY',
    'DISTRICT OF COLUMBIA': 'DC', 'WASHINGTON DC': 'DC', 'WASHINGTON D.C.': 'DC'
  };

  if (trimmed.length === 2) {
    log('normalizeState', { rawState: state }, 'ABBREVIATION_CHECK', 'SUCCESS', { input: state, output: trimmed });
    return trimmed;
  }
  
  const result = stateAbbreviations[trimmed] || trimmed;
  log('normalizeState', { rawState: state }, 'FULL_NAME_CONVERSION', result === trimmed ? 'NO_MAPPING' : 'SUCCESS', { input: state, output: result });
  return result;
}

// ============================================
// LEAD DISTRIBUTION ENGINE (Shared Logic)
// ============================================
async function processLead(name, email, phone, rawState, source = 'form') {
  const results = {
    assignedTo: null,
    status: 'unassigned',
    reason: 'unknown',
    clientName: null
  };

  const leadData = { rawState, name, email, source };
  
  log('processLead', leadData, 'FUNCTION_START', 'INITIALIZED', {
    name, email, phone, rawState, source
  });

  // Step 1: Validate required fields
  if (!name && !email) {
    log('processLead', leadData, 'VALIDATION', 'REJECTED', { reason: 'missing_name_and_email' });
    results.reason = 'missing_fields';
    return results;
  }

  // Step 2: Normalize state
  const normalizedState = normalizeState(rawState);
  log('processLead', { ...leadData, normalizedState }, 'STATE_NORMALIZATION', normalizedState ? 'SUCCESS' : 'FAILED', {
    rawState, normalizedState
  });

  if (!normalizedState) {
    log('processLead', leadData, 'STATE_CHECK', 'WARNING', {
      reason: 'normalizedState_is_null',
      rawState,
      typeOfRawState: typeof rawState
    });
    results.reason = 'no_state';
    return results;
  }

  // Step 3: Fetch all clients from database
  log('processLead', { ...leadData, normalizedState }, 'FETCH_ALL_CLIENTS', 'QUERYING', {});
  
  let allClients = [];
  try {
    allClients = await Client.find({});
    log('processLead', { ...leadData, normalizedState }, 'FETCH_ALL_CLIENTS', 'SUCCESS', {
      count: allClients.length
    });
    
    console.log('\n📋 ALL CLIENTS IN DATABASE:');
    console.log(`  Total clients: ${allClients.length}`);
    allClients.forEach(c => {
      console.log(`  - ${c.name} | State: "${c.state}" | Status: ${c.status} | Cap: ${c.leadCap} | Received: ${c.leadsReceived}`);
    });
  } catch (error) {
    logError('processLead', { ...leadData, normalizedState }, 'FETCH_ALL_CLIENTS', error);
    results.reason = 'db_error_fetching_clients';
    return results;
  }

  // Step 4: Find clients matching state
  const queryPattern = new RegExp('^' + normalizedState + '$', 'i');
  log('processLead', { ...leadData, normalizedState }, 'QUERY_MATCHING_CLIENTS', 'EXECUTING', {
    query: { state: queryPattern, status: { $ne: 'inactive' } }
  });
  
  let availableClients = [];
  try {
    availableClients = await Client.find({
      state: { $regex: queryPattern },
      status: { $ne: 'inactive' }
    });
    
    log('processLead', { ...leadData, normalizedState }, 'QUERY_MATCHING_CLIENTS', availableClients.length > 0 ? 'SUCCESS' : 'ZERO_RESULTS', {
      normalizedState,
      matchCount: availableClients.length,
      query: { state: normalizedState, status: 'not inactive' }
    });
    
    if (availableClients.length === 0) {
      log('processLead', { ...leadData, normalizedState }, 'QUERY_MATCHING_CLIENTS', 'WARNING_NO_MATCHES', {
        normalizedState,
        allClientStates: allClients.map(c => ({ name: c.name, state: c.state, status: c.status }))
      });
      
      console.log(`\n⚠️ WARNING: No clients match state "${normalizedState}"`);
      console.log('Available states in database:');
      const stateGroups = {};
      allClients.forEach(c => {
        if (!stateGroups[c.state]) stateGroups[c.state] = [];
        stateGroups[c.state].push(c.name);
      });
      Object.entries(stateGroups).forEach(([state, clients]) => {
        console.log(`  ${state}: ${clients.join(', ')}`);
      });
    } else {
      console.log(`\n🔍 Clients matching state "${normalizedState}": ${availableClients.length}`);
      availableClients.forEach(c => {
        console.log(`  - ${c.name}: ${c.leadsReceived}/${c.leadCap} (${c.status})`);
      });
    }
  } catch (error) {
    logError('processLead', { ...leadData, normalizedState }, 'QUERY_MATCHING_CLIENTS', error);
    results.reason = 'db_error_querying_clients';
    return results;
  }

  // Step 5: Filter for capacity and sort
  log('processLead', { ...leadData, normalizedState }, 'FILTER_CAPACITY', 'PROCESSING', {
    availableClients: availableClients.length
  });
  
  const eligibleClients = availableClients
    .filter(c => {
      const leadCap = c.leadCap;
      const leadsReceived = c.leadsReceived;
      
      // Type safety check
      if (typeof leadCap !== 'number' || typeof leadsReceived !== 'number') {
        log('processLead', { ...leadData, normalizedState }, 'FILTER_CAPACITY', 'WARNING_SKIPPED', {
          client: c.name,
          reason: 'invalid_number_type',
          leadCap,
          leadsReceived,
          types: { leadCap: typeof leadCap, leadsReceived: typeof leadsReceived }
        });
        return false;
      }
      
      const hasCapacity = leadsReceived < leadCap;
      if (!hasCapacity) {
        console.log(`  ⛔ ${c.name} has NO capacity (${leadsReceived}/${leadCap})`);
      }
      return hasCapacity;
    })
    .sort((a, b) => a.leadsReceived - b.leadsReceived);

  log('processLead', { ...leadData, normalizedState }, 'FILTER_CAPACITY', 'COMPLETE', {
    availableClients: availableClients.length,
    eligibleClients: eligibleClients.length
  });

  if (eligibleClients.length > 0) {
    console.log(`\n✅ Eligible clients with capacity: ${eligibleClients.length}`);
    eligibleClients.forEach(c => {
      console.log(`  - ${c.name}: ${c.leadsReceived}/${c.leadCap}`);
    });
  }

  // Step 6: Assign to first eligible client
  let assignedClient = null;
  let assignmentReason = 'no_eligible_client';

  if (eligibleClients.length > 0) {
    assignedClient = eligibleClients[0];
    assignmentReason = 'assigned';
    log('processLead', { ...leadData, normalizedState }, 'SELECT_CLIENT', 'SUCCESS', {
      selectedClient: assignedClient.name,
      eligibleCount: eligibleClients.length
    });
  } else if (availableClients.length === 0) {
    log('processLead', { ...leadData, normalizedState }, 'SELECT_CLIENT', 'NO_MATCH', {
      reason: 'no_clients_for_state',
      searchedState: normalizedState
    });
    assignmentReason = 'no_client_for_state';
  } else {
    log('processLead', { ...leadData, normalizedState }, 'SELECT_CLIENT', 'ALL_FULL', {
      reason: 'all_matching_clients_at_capacity',
      matchingClients: availableClients.length
    });
    assignmentReason = 'all_clients_full';
  }

  // Step 7: Atomic assignment
  if (assignedClient) {
    log('processLead', { ...leadData, normalizedState }, 'ATOMIC_ASSIGNMENT', 'EXECUTING', {
      clientId: assignedClient._id,
      clientName: assignedClient.name,
      currentLeads: assignedClient.leadsReceived,
      leadCap: assignedClient.leadCap
    });
    
    let updatedClient = null;
    try {
      updatedClient = await Client.findOneAndUpdate(
        { 
          _id: assignedClient._id,
          leadsReceived: { $lt: assignedClient.leadCap }
        },
        { $inc: { leadsReceived: 1 } },
        { new: true }
      );
      
      log('processLead', { ...leadData, normalizedState }, 'ATOMIC_ASSIGNMENT', updatedClient ? 'SUCCESS' : 'FAILED_NO_UPDATE', {
        clientId: assignedClient._id,
        wasUpdated: !!updatedClient,
        newLeadsReceived: updatedClient?.leadsReceived
      });
    } catch (error) {
      logError('processLead', { ...leadData, normalizedState }, 'ATOMIC_ASSIGNMENT', error);
      results.reason = 'db_error_atomic_update';
      return results;
    }

    if (updatedClient) {
      results.assignedTo = assignedClient._id;
      results.status = 'assigned';
      results.clientName = assignedClient.name;
      results.reason = 'assigned';
      
      log('processLead', { ...leadData, normalizedState }, 'ASSIGNMENT_SUCCESS', 'COMPLETE', {
        clientId: assignedClient._id,
        clientName: assignedClient.name,
        newLeadsReceived: updatedClient.leadsReceived,
        leadCap: updatedClient.leadCap
      });
      
      // Update status to full if at capacity
      if (updatedClient.leadsReceived >= updatedClient.leadCap) {
        try {
          await Client.findByIdAndUpdate(assignedClient._id, { status: 'full' });
          log('processLead', { ...leadData, normalizedState }, 'UPDATE_CLIENT_STATUS', 'FULL', { clientName: assignedClient.name });
        } catch (error) {
          logError('processLead', { ...leadData, normalizedState }, 'UPDATE_CLIENT_STATUS', error);
        }
      }

      // Create activity log
      try {
        await Activity.create({
          type: 'lead_assigned',
          message: `Lead ${name} assigned to ${assignedClient.name}`,
          clientId: assignedClient._id
        });
      } catch (error) {
        logError('processLead', { ...leadData, normalizedState }, 'CREATE_ACTIVITY', error);
      }
    } else {
      log('processLead', { ...leadData, normalizedState }, 'RACE_CONDITION', 'DETECTED', {
        clientName: assignedClient.name,
        reason: 'capacity_changed_during_assignment'
      });
      assignmentReason = 'race_condition';
      
      // Try fallback clients
      const remainingClients = eligibleClients.slice(1);
      log('processLead', { ...leadData, normalizedState }, 'FALLBACK_LOOP', 'STARTING', {
        remainingClients: remainingClients.length
      });
      
      let assigned = false;
      for (const altClient of remainingClients) {
        try {
          const altUpdated = await Client.findOneAndUpdate(
            { _id: altClient._id, leadsReceived: { $lt: altClient.leadCap } },
            { $inc: { leadsReceived: 1 } },
            { new: true }
          );
          
          if (altUpdated) {
            results.assignedTo = altClient._id;
            results.status = 'assigned';
            results.clientName = altClient.name;
            results.reason = 'assigned_fallback';
            assigned = true;
            
            log('processLead', { ...leadData, normalizedState }, 'FALLBACK_ASSIGNMENT', 'SUCCESS', {
              fallbackClient: altClient.name,
              newLeadsReceived: altUpdated.leadsReceived
            });
            
            if (altUpdated.leadsReceived >= altUpdated.leadCap) {
              await Client.findByIdAndUpdate(altClient._id, { status: 'full' });
            }
            
            await Activity.create({
              type: 'lead_assigned',
              message: `Lead ${name} assigned to ${altClient.name}`,
              clientId: altClient._id
            });
            break;
          }
        } catch (error) {
          logError('processLead', { ...leadData, normalizedState }, 'FALLBACK_ASSIGNMENT', error);
        }
      }
      
      if (!assigned) {
        log('processLead', { ...leadData, normalizedState }, 'FALLBACK_LOOP', 'ALL_FAILED', {
          reason: 'no_available_clients_after_race_condition'
        });
      }
    }
  }

  // Final log
  log('processLead', { ...leadData, normalizedState }, 'FUNCTION_COMPLETE', results.status.toUpperCase(), {
    assignedTo: results.clientName,
    reason: results.reason
  });

  return results;
}

// ============================================
// MONGODB CONNECTION
// ============================================
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("MongoDB Connected");
  const adminExists = await User.findOne({ username: 'admin' });
  if (!adminExists) {
    await User.create({ username: 'admin', password: 'admin123' });
    console.log("Default admin created: admin / admin123");
  }
})
.catch(err => {
  console.error(`[MONGODB] ${new Date().toISOString()} | CONNECTION_FAILED`, {
    error: err.message,
    stack: err.stack
  });
});

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ============================================
// ENDPOINTS
// ============================================

// 🔍 DEBUG: Check clients in database (no auth)
app.get('/api/debug/clients', async (req, res) => {
  console.log(`\n[DEBUG_ENDPOINT] ${new Date().toISOString()} | REQUEST_RECEIVED`);
  try {
    const clients = await Client.find({}).sort({ state: 1, name: 1 });
    
    console.log(`[DEBUG_ENDPOINT] ${new Date().toISOString()} | QUERY_SUCCESS | Count: ${clients.length}`);
    
    const clientSummary = clients.map(c => {
      const available = (c.leadCap || 0) - (c.leadsReceived || 0);
      return {
        name: c.name,
        state: c.state,
        stateLength: c.state?.length,
        status: c.status,
        cap: c.leadCap,
        received: c.leadsReceived,
        available: available,
        isFull: available <= 0
      };
    });
    
    console.log('\n=== DEBUG: Clients in database ===');
    clientSummary.forEach(c => {
      console.log(`  ${String(c.state).padEnd(5)} | ${c.name.padEnd(20)} | ${c.status.padEnd(8)} | ${c.received}/${c.cap} (${c.available} available)`);
    });
    
    res.json({ count: clients.length, clients: clientSummary });
  } catch (err) {
    console.error(`[DEBUG_ENDPOINT] ${new Date().toISOString()} | ERROR`, err);
    res.status(500).json({ error: err.message });
  }
});

// 📊 STATS
app.get('/api/stats', auth, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const totalClients = await Client.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const leadsToday = await Lead.countDocuments({ createdAt: { $gte: today } });
    const unassignedLeads = await Lead.countDocuments({ assignedTo: null });
    
    res.json({
      totalLeads,
      totalClients,
      leadsToday,
      unassignedLeads
    });
  } catch (err) {
    console.error(`[STATS_ENDPOINT] ${new Date().toISOString()} | ERROR`, err);
    res.status(500).json(err);
  }
});

// 📋 ACTIVITY FEED
app.get('/api/activities', auth, async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('clientId', 'name')
      .populate('leadId', 'name email');
    res.json(activities);
  } catch (err) {
    console.error(`[ACTIVITIES_ENDPOINT] ${new Date().toISOString()} | ERROR`, err);
    res.status(500).json(err);
  }
});

// 🔥 RECEIVE LEAD (uses shared distribution engine)
app.post('/api/leads', async (req, res) => {
  console.log(`\n[LEADS_ENDPOINT] ${new Date().toISOString()} | POST_RECEIVED`);
  console.log('[LEADS_ENDPOINT] Full Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { name, email, phone, state, source = 'form', notes, metadata } = req.body;

    // Process the lead using shared engine
    const processResult = await processLead(name, email, phone, state, source);

    // Create the lead
    const lead = await Lead.create({
      name: name || 'Unknown',
      email: email || 'no-email@system.local',
      phone: phone || null,
      state: normalizeState(state) || 'UNKNOWN',
      source,
      assignedTo: processResult.assignedTo,
      status: processResult.status,
      notes,
      metadata
    });

    // Create activity log
    await Activity.create({
      type: processResult.status === 'assigned' ? 'lead_assigned' : 'lead_received',
      message: processResult.status === 'assigned' 
        ? `Lead ${name} assigned to ${processResult.clientName}` 
        : `New lead received from ${source}: ${name} (${processResult.reason})`,
      leadId: lead._id,
      clientId: processResult.assignedTo
    });

    res.json({
      success: true,
      lead,
      assignedTo: processResult.clientName,
      status: processResult.status,
      reason: processResult.reason
    });

  } catch (err) {
    console.error(`[LEADS_ENDPOINT] ${new Date().toISOString()} | ERROR`, {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================
// WEBHOOK ENDPOINT FOR GHL
// ============================================
app.post('/api/webhooks/lead', async (req, res) => {
  console.log('\n========================================');
  console.log(`[WEBHOOK_ENDPOINT] ${new Date().toISOString()} | POST_RECEIVED`);
  console.log('[WEBHOOK_ENDPOINT] ========== RAW PAYLOAD ==========');
  console.log(JSON.stringify(req.body, null, 2));
  console.log('[WEBHOOK_ENDPOINT] ========== END PAYLOAD ==========');
  console.log('========================================\n');

  try {
    // Handle both flat and nested GHL payloads
    const body = req.body;
    const data = body.data || body.payload || body.lead || body.contact || body;

    // Log extracted data sources
    console.log(`[WEBHOOK_ENDPOINT] ${new Date().toISOString()} | DATA_EXTRACTION | Checking payload structure`);
    console.log(`  body keys: ${Object.keys(body).join(', ')}`);
    console.log(`  data keys: ${Object.keys(data).join(', ')}`);

    // GHL sends state in various fields - check all possibilities
    const rawState = 
      data.state || 
      data.state_province || 
      data.location_state ||
      data.location?.state ||
      data.address?.state ||
      data.customFields?.state ||
      data.custom_fields?.state ||
      body.state ||
      body.state_province ||
      req.body.state;

    console.log(`[WEBHOOK_ENDPOINT] ${new Date().toISOString()} | STATE_EXTRACTION | rawState: "${rawState}" | source: ${rawState ? 'found' : 'NOT FOUND'}`);

    // Extract other fields
    const contact_name = data.contact_name || data.name || body.contact_name;
    const firstName = data.firstName || data.first_name || body.firstName;
    const lastName = data.lastName || data.last_name || body.lastName;
    const email = data.email || body.email;
    const phone = data.phone || data.phoneNumber || data.phone_number || body.phone;
    const source = data.source || body.source || 'webhook';

    // Build name
    const leadName = contact_name || 
                     `${firstName || ''} ${lastName || ''}`.trim() || 
                     email || 
                     'Unknown';
    
    console.log(`[WEBHOOK_ENDPOINT] ${new Date().toISOString()} | DATA_EXTRACTED |`, {
      name: leadName,
      email,
      phone,
      rawState,
      source
    });

    // Validate state
    if (!rawState || rawState === '') {
      console.warn(`[WEBHOOK_ENDPOINT] ${new Date().toISOString()} | WARNING | State is null, undefined, or empty`);
      console.warn(`[WEBHOOK_ENDPOINT] Available fields: ${Object.keys(data).join(', ')}`);
    }

    // Process the lead
    const processResult = await processLead(leadName, email, phone, rawState, source);

    // Create the lead
    const lead = await Lead.create({
      name: leadName || 'Unknown',
      email: email || 'no-email@webhook.local',
      phone: phone || null,
      state: normalizeState(rawState) || 'UNKNOWN',
      source: source || 'webhook',
      assignedTo: processResult.assignedTo,
      status: processResult.status
    });

    // Create activity log
    await Activity.create({
      type: processResult.status === 'assigned' ? 'lead_assigned' : 'lead_received',
      message: processResult.status === 'assigned' 
        ? `Webhook lead ${leadName} assigned to ${processResult.clientName}` 
        : `Webhook lead received: ${leadName} (${processResult.reason})`,
      leadId: lead._id,
      clientId: processResult.assignedTo
    });

    console.log(`[WEBHOOK_ENDPOINT] ${new Date().toISOString()} | COMPLETE | LeadID: ${lead._id} | Status: ${processResult.status} | AssignedTo: ${processResult.clientName || 'NONE'}`);
    
    res.json({
      success: true,
      lead,
      assignedTo: processResult.clientName,
      status: processResult.status,
      reason: processResult.reason
    });

  } catch (err) {
    console.error(`[WEBHOOK_ENDPOINT] ${new Date().toISOString()} | ERROR`, {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🗑️ DELETE LEAD
app.delete('/api/leads/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (lead.assignedTo) {
      await Client.findByIdAndUpdate(lead.assignedTo, {
        $inc: { leadsReceived: -1 }
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    await Activity.create({
      type: 'lead_deleted',
      message: `Lead deleted: ${lead.name}`,
      leadId: null,
      clientId: lead.assignedTo
    });

    res.json({ success: true });
  } catch (err) {
    console.error(`[DELETE_LEAD] ${new Date().toISOString()} | ERROR`, {
      id: req.params.id,
      error: err.message,
      stack: err.stack
    });
    res.status(500).json(err);
  }
});

// 📊 GET LEADS
app.get('/api/leads', auth, async (req, res) => {
  try {
    const { status, state, assignedTo, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (state) query.state = state;
    if (assignedTo) query.assignedTo = assignedTo;

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('assignedTo', 'name email state');

    const total = await Lead.countDocuments(query);

    res.json({
      leads,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(`[GET_LEADS] ${new Date().toISOString()} | ERROR`, err);
    res.status(500).json(err);
  }
});

// 📊 GET CLIENTS
app.get('/api/clients', auth, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    console.error(`[GET_CLIENTS] ${new Date().toISOString()} | ERROR`, err);
    res.status(500).json(err);
  }
});

// ➕ ADD CLIENT
app.post('/api/clients', auth, async (req, res) => {
  try {
    const { name, email, state, leadCap, status = 'active', notes } = req.body;

    const normalizedState = normalizeState(state);

    if (!name || !normalizedState) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and state are required' 
      });
    }

    const cap = parseInt(leadCap) || 0;
    if (cap <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Lead cap must be a positive number' 
      });
    }

    const client = await Client.create({
      name,
      email: email || '',
      state: normalizedState,
      leadCap: cap,
      leadsReceived: 0,
      status: status || 'active',
      notes: notes || ''
    });
    
    await Activity.create({
      type: 'client_created',
      message: `New client added: ${client.name} (${client.state})`,
      clientId: client._id
    });

    res.json(client);
  } catch (err) {
    console.error(`[ADD_CLIENT] ${new Date().toISOString()} | ERROR`, {
      error: err.message,
      stack: err.stack
    });
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✏️ UPDATE CLIENT
app.put('/api/clients/:id', auth, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (updateData.state) {
      updateData.state = normalizeState(updateData.state);
    }
    
    if (updateData.leadCap) {
      updateData.leadCap = parseInt(updateData.leadCap);
    }
    
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    await Activity.create({
      type: 'client_updated',
      message: `Client updated: ${client.name}`,
      clientId: client._id
    });

    res.json(client);
  } catch (err) {
    console.error(`[UPDATE_CLIENT] ${new Date().toISOString()} | ERROR`, {
      id: req.params.id,
      error: err.message,
      stack: err.stack
    });
    res.status(500).json(err);
  }
});

// 🗑️ DELETE CLIENT
app.delete('/api/clients/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    
    await Client.findByIdAndDelete(req.params.id);

    await Activity.create({
      type: 'client_deleted',
      message: `Client deleted: ${client.name}`,
      clientId: null
    });

    res.json({ success: true });
  } catch (err) {
    console.error(`[DELETE_CLIENT] ${new Date().toISOString()} | ERROR`, {
      id: req.params.id,
      error: err.message,
      stack: err.stack
    });
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔄 RESET CLIENT LEAD COUNT
app.post('/api/clients/:id/reset', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    client.leadsReceived = 0;
    client.status = 'active';
    await client.save();

    await Activity.create({
      type: 'lead_cap_reset',
      message: `Lead count reset for ${client.name}`,
      clientId: client._id
    });

    res.json(client);
  } catch (err) {
    console.error(`[RESET_CLIENT] ${new Date().toISOString()} | ERROR`, {
      id: req.params.id,
      error: err.message,
      stack: err.stack
    });
    res.status(500).json(err);
  }
});

// 👤 AUTH - LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error(`[LOGIN] ${new Date().toISOString()} | ERROR`, {
      error: err.message,
      stack: err.stack
    });
    res.status(500).json(err);
  }
});

// 🧪 TEST ENDPOINT
app.post('/api/test/lead', async (req, res) => {
  try {
    const { name, email, phone, state, source = 'test' } = req.body;
    
    console.log(`\n[TEST_ENDPOINT] ${new Date().toISOString()} | POST_RECEIVED`);
    console.log('[TEST_ENDPOINT] Input:', JSON.stringify(req.body, null, 2));
    
    const normalizedState = normalizeState(state);
    
    const matchingClients = await Client.find({
      state: { $regex: new RegExp('^' + (normalizedState || '') + '$', 'i') }
    });
    
    const eligibleClients = matchingClients.filter(c => 
      typeof c.leadCap === 'number' && 
      typeof c.leadsReceived === 'number' && 
      c.leadsReceived < c.leadCap
    );
    
    res.json({
      input: { name, email, state },
      normalizedState,
      matchingClients: matchingClients.map(c => ({
        name: c.name,
        state: c.state,
        capacity: `${c.leadsReceived}/${c.leadCap}`,
        status: c.status
      })),
      eligibleClients: eligibleClients.map(c => ({
        name: c.name,
        state: c.state,
        capacity: `${c.leadsReceived}/${c.leadCap}`
      })),
      wouldAssign: eligibleClients.length > 0,
      assignedTo: eligibleClients.length > 0 ? eligibleClients[0].name : null
    });
  } catch (err) {
    console.error(`[TEST_ENDPOINT] ${new Date().toISOString()} | ERROR`, {
      error: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: err.message });
  }
});

// 👤 AUTH - REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    res.json({ success: true });
  } catch (err) {
    console.error(`[REGISTER] ${new Date().toISOString()} | ERROR`, {
      error: err.message,
      stack: err.stack
    });
    res.status(500).json(err);
  }
});

// 🔧 ADMIN: Normalize all client states
app.post('/api/admin/normalize-states', auth, async (req, res) => {
  try {
    const clients = await Client.find({});
    const results = [];
    
    for (const client of clients) {
      const oldState = client.state;
      const newState = normalizeState(oldState);
      
      if (oldState !== newState) {
        client.state = newState;
        await client.save();
        results.push({ name: client.name, old: oldState, new: newState, updated: true });
      } else {
        results.push({ name: client.name, old: oldState, new: newState, updated: false });
      }
    }
    
    const updatedCount = results.filter(r => r.updated).length;
    console.log(`\n[ADMIN] ${new Date().toISOString()} | State normalization complete: ${updatedCount}/${clients.length} clients updated`);
    
    res.json({ 
      success: true, 
      total: clients.length,
      updated: updatedCount,
      results 
    });
  } catch (err) {
    console.error(`[ADMIN_NORMALIZE] ${new Date().toISOString()} | ERROR`, {
      error: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
