module.exports = Object.freeze({
  QUERIES: {
    ConsentForm: {
      GetUserDetails:
        'select vp.first_name,vp.last_name,vp.consent_status from codelinc.web_party_info wpi join codelinc.veteran_pi vp on wpi.party_id=vp.veteran_id where wpi.web_party_id=$1',
      AcceptConsentStatus:
        'update codelinc.veteran_pi vp set consent_status=$2 from codelinc.web_party_info wpi where wpi.party_id=vp.veteran_id and wpi.party_id=$1',
      AcceptedConsentDate:
        'update codelinc.web_party_info wpi set consent_received=$2 from codelinc.veteran_pi vp where wpi.party_id=vp.veteran_id and wpi.party_id=$1'
    },
    calendarAPis: {
      getCalendarEventsForVeteran:
        'SELECT * FROM codelinc.tableName WHERE veteran_id = $1',
      getCalendarEventsForCaseworker: 'SELECT * FROM codelinc.tableName',
      postEventsForCaseworker:
        'INSERT INTO codelinc.tableName(columns_name) VALUES()'
    },
    ProgressNotes: {
      GetGoals:
        'SELECT * FROM codelinc.veteran_treatment_goals WHERE veteran_id = $1',
      AddGoal:
        'INSERT INTO codelinc.veteran_treatment_goals(veteran_id, goal_description, goal_type) VALUES($1, $2, $3)',
      // UpdateGoalStatus: `INSERT INTO codelinc.veteran_treatment_goals(veteran_id, goal_id, goal_description) VALUES($1, $2, $3) ON CONFLICT (veteran_id) DO UPDATE SET goal_description = EXCLUDED.goal_description`
      UpdateGoalStatus:
        'UPDATE codelinc.veteran_treatment_goals SET goal_status = $3 WHERE veteran_id = $1 AND goal_id = $2'
    },
    UserProfile: {
      GetUserDetails: 'SELECT * from codelinc.veteran_pi where veteran_id = $1',
      UpdateUserDetails:
        'UPDATE codelinc.veteran_pi SET nick_name = $1 WHERE veteran_id = 5',
      // UserAssessmentDetails: `SELECT * FROM codelinc.veteran_pi WHERE veteran_id = $1`,
      // UserAssessmentDetailsTable: `SELECT table_name as \`Personal Information\` FROM information_schema.tables where table_name like \'%pi\' `,
      UserAssessmentDetails:
        'select first_name as `First Name`, last_name as `Last Name`, middle_initial  as `Middle Initial`, nick_name as `Nickname`, place_of_birth as `Place of Birth`, ssn as `SSN#`, gender as `Sex`, marital_status  as `Marital Status`, address_main as `Address`, race as `Race`, primary_language as `Primary Language`, contact_person as `Contact Person`, contact_person_relationship as `Relationship`, contact_person_address as `Contact Person Address`, contact_person_phone as `Contact Person Phone`, city as `City`, state as `State`, zip_code as `Zip Code`, city as `City` from codelinc.veteran_pi vpi where veteran_id = $1;',
      UserAssessmentDetailsFinance:
        'select * from codelinc.veteran_finance where veteran_id = $1;',
      UserAssessmentDetailsPI:
        'select * from codelinc.veteran_pi where veteran_id  = $1 '
      // UserAssessmentDetailsFinanceTable: `SELECT table_name as \`Finance\` FROM information_schema.tables where table_name like \'%finance\' `
    },
    myApisJsonUrls: {
      GetUserDetailsForVet: './assets/userData.json',
      GetUserAssessmentForVet: './assets/assessmentData.json',
      getCalendarEvents: './assets/calendarEvent.json',
      getProgressNotes: './assets/progressNotes.json',
      getResedentData: './assets/resedentData.json',
      getConsentData: './assets/consentData.json',
      GetTransportationData: './assets/transportationData.json'
    },
    UiLayout: {
      getTableNames: 'SELECT table_name FROM information_schema.tables',
      GetUserDetailsForCaseWorker:
        'SELECT c.photo, c.nick_name, w.last_login_date_time from codelinc.case_worker_info c JOIN codelinc.web_party_info w on c.case_worker_id = w.party_id where case_worker_id = $1',
      getTableColumns:
        'SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = \'veteran_transport_request\';',
      getTableData: 'SELECT * FROM codelinc.veteran_treatment_goals'
    },
    TreatmentPlan: {
      GetTreatmentPlanDetails: '',
      UpdateTreatmentPlanDetails: ''
    },
    TransportationRequest: {
      SaveTransportationDetails:
        'INSERT INTO codelinc.veteran_transport_request(veteran_id, appointment_date, appointment_time, reason_for_request, pick_up_address_main, va_address, pick_up_city, pick_up_state, pick_up_zip_code, requested_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      
      GetTransportationRequests:
         "SELECT v.first_name, v.last_name, t.request_id, t.appointment_date, t.appointment_time, t.reason_for_request, t.transport_coordinator, t.nursing_notified, t.notified_by, t.pick_up_address_main, t.pick_up_city, t.pick_up_state, t.pick_up_zip_code, t.approved_date, t.date_filled FROM codelinc.veteran_pi v FULL OUTER JOIN codelinc.veteran_transport_request t  ON v.veteran_id = t.veteran_id WHERE t.approved_date IS NULL AND t.request_id IS NOT NULL ORDER BY t.request_id DESC", 
         
      ApproveTransportationRequests:
        'UPDATE codelinc.veteran_transport_request SET transport_coordinator = $2, nursing_notified = $3, notified_by = $4, approved_date = $5, date_filled= $6 WHERE request_id = $1'
    },
    HealthTracker: {
      saveHealthTrackerRequest:
        'INSERT INTO codelinc.veteran_health_tracker(veteran_id,tracking_subject,note_date,measurement,tracking_comments) VALUES ($1, $2, $3, $4, $5)',
      updateHealthTrackerRequest:
        'UPDATE codelinc.veteran_health_tracker SET note_date=$3, measurement=$4,tracking_comments=$5 WHERE veteran_id=$1 and tracking_subject=$2',
      getHealthTracker:
        'select * from codelinc.veteran_health_tracker where veteran_id=$1'
    }
  }
});
