module.exports = Object.freeze({
  QUERIES: {
    ConsentForm: {
      GetUserDetails:
        'select vp.first_name,vp.last_name,vp.consent_status,vp.email from codelinc.web_party_info wpi join codelinc.veteran_pi vp on wpi.party_id=vp.veteran_id where wpi.party_id=$1',
      AcceptConsentStatus:
        'update codelinc.veteran_pi vp set consent_status=$2 from codelinc.web_party_info wpi where wpi.party_id=vp.veteran_id and wpi.party_id=$1',
      AcceptedConsentDate:
        'update codelinc.web_party_info wpi set consent_received=$2 from codelinc.veteran_pi vp where wpi.party_id=vp.veteran_id and wpi.party_id=$1'
    },
    calendarAPis: {
      getCurrentVeteranEmailId: 'SELECT email FROM codelinc.veteran_pi WHERE veteran_id = $1',
      getCalendarEventsForVeteran:
        "SELECT * FROM codelinc.calendar WHERE position( $1 in participants)>0 OR isappointment = false",
      getCalendarEventsForCaseworker: "SELECT * FROM codelinc.calendar WHERE case_worker_id = $1 OR isappointment = false",

      postEventsForCaseworker:
        'INSERT INTO codelinc.calendar(case_worker_id,participants,isappointment,title,description,eventstart,eventend) VALUES($1, $2, $3, $4, $5, $6, $7)'
    },
    ProgressNotes: {
      GetGoals:
         'SELECT goal_status as "goalState", goal_title as "goalTitle", created_on as "addedDate", goal_description as "goalDescription", goal_type as "goalType" FROM codelinc.veteran_treatment_goals WHERE veteran_id = $1',
      // 'SELECT * FROM codelinc.veteran_treatment_goals WHERE veteran_id = $1',
      AddGoal:
        'INSERT INTO codelinc.veteran_treatment_goals(veteran_id, goal_title, goal_type, goal_description, goal_status, created_on) VALUES($1, $2, $3, $4, $5, $6)',
      // UpdateGoalStatus: "INSERT INTO codelinc.veteran_treatment_goals(veteran_id, goal_id, goal_description) VALUES($1, $2, $3) ON CONFLICT (veteran_id) DO UPDATE SET goal_description = EXCLUDED.goal_description"
      UpdateGoalStatus:
        'UPDATE codelinc.veteran_treatment_goals SET goal_status = $3 WHERE veteran_id = $1 AND goal_title = $2'
    },
    UserProfile: {
      GetUserDetails: 'SELECT * from codelinc.veteran_pi where veteran_id = $1',
      UpdateUserDetails:
        'UPDATE codelinc.veteran_pi SET first_name = $2,middle_initial = $3,last_name = $4, nick_name = $5, date_of_birth =$6, place_of_birth = $7, primary_phone = $8, contact_person = $9, hobbies = $10, address_main = $11, city = $12, state = $13, contact_person_relationship= $14, county = $15, address_line_2 = $16, zip_code = $17, gender = $18, marital_status = $19, ssn = $20, hmis_id = $21, race = $22, primary_language = $23, religious_preference = $24, contact_person_address = $25, contact_person_phone =$26  WHERE veteran_id = $1',
      UserAssessmentDetailsPI:
        ' select first_name as "First Name", last_name as "Last Name", middle_initial  as "Middle Initial", nick_name as "Nickname", place_of_birth as "Place of Birth", ssn as "SSN#", gender as "Sex", marital_status  as "Marital Status", address_main as "Address", race as "Race", primary_language as "Primary Language", contact_person as "Contact Person", contact_person_relationship as "Relationship", contact_person_address as "Contact Person Address", contact_person_phone as "Contact Person Phone", city as "City", state as "State", zip_code as "Zip Code", city as "City" from codelinc.veteran_pi vpi where veteran_id = $1;',
      UserAssessmentDetailsFinance:
      // 'select * from codelinc.veteran_finance where veteran_id = $1; ',
      'select income as "Income", income_type as "Income Type", bank_account_type as "Bank Account Type", bank_name as "Name of the Bank", direct_deposit as "Direct Deposit", other_assets as "Other Assets", current_benefits as "Current Benefits", needed_benefits as "Needed Benefits", cash_benefits as "Cash Benefits", non_cash_benefits as "Non Cash Benefits" from codelinc.veteran_finance where veteran_id = $1; ',
      UserAssessmentDetailsEEH:
        ' select current_occupation as "Current Occupation", current_employer as "Currentr Employer", current_employer_location as "Current Employer Location", previous_occupations as "Previous Occupation", work_skills as "Works/Skills", highest_education_grade as "Highest Education Grade", school_name as "Name of the School", active_military_status as "Active Military Status", military_branch as "Military Branch", discharge_type as "Discharge Type", service_dates as "Service Dates", service_location as "Service Location", other_training_education as "Other Training or Educations" from codelinc.veteran_employment_education where veteran_id = $1; ',
      UserAssessmentDetailsSocial:
        ' SELECT religious_preference as "Religious Preference", hobbies as "Hobbies" FROM codelinc.veteran_pi WHERE veteran_id = $1 ',
      UserAssessmentDetailsFamily:
        ' select childhood as "Childhood", parent_relationship as "Relationship with Parents", sibling_relationship as "Relationship with Siblings",  discipline_type as "Discipline Type", physical_abuse_hist as "Any Physical Abuse History", sexual_abuse_hist as "Any Sexual Abuse History", substance_abuse as "Any Substance Abuse", family_hist_mental_health_and_substance_abuse as "Family History", ever_married "Ever Married",times_married as "Number of Times", current_marital_status as "Current Marital Status", sexual_orientation as "Sexual Orientation", sexually_active as "Sexually Active", sexual_concerns as "Sexual Concerns",  sexual_concern_specifics as "Any Specific",  hiv_tested as "HIV Tested", hiv_test_location as "HIV Test Location", approx_hiv_test_date as "Approximate Test Date", hiv_test_results as "HIV Test Results", other_std_tested as " Tested for Other STD \'s",  std_test_location as "STD Test Location",  approx_std_test_date "Approximate Test Date", std_test_results as "STD Test Results", hiv_test_desired as "HIV Test Desired" from codelinc.veteran_hist where veteran_id = $1; ',
      UserAssessmentDetailsSAH:
        ' select alcohol_history as "Alcohol History", currently_consumes_alcohol as "Currently Consumes Alcohol", current_alcohol_intake_freq as "Alcohol Intake Frequency", drug_use_history as "Drug use History", currently_uses_drugs as "Currently Uses Drugs", current_drug_use_freq as "Drug intake Frequency", drug_alcohol_last_use as "Last use of Drug and Alcohol", current_drug_alcohol_treatment as "Current Drug/Alcohol Treatment", withdrawal_history as "Withdrawal History", tobacco_use_history as "Tobacco Use History", currently_uses_tobacco as "Currently Uses Tobacco", current_tobacco_use_freq as "Current Tobacoo Intake Frequency", caffeine_use_history as "Caffeine use History", currently_uses_caffeine as "Currently Uses Caffeine", current_caffeine_use_freq as "Current Caffeine Intake Frequency", treatment_programs as "Treatment Programs" from codelinc.veteran_substances where veteran_id  = $1 ',
      UserAssessmentDetailsLHI:
        ' SELECT ever_arrested as "Ever Arrested", arrest_reason as "Arrested Reason", ever_convicted as "Ever Convicted", conviction_reason as "Conviction Reason", current_pending_charges as "Current Pending Charges", charges as "Charges", outstanding_warrants as "Outstanding Warrants", warrant_reason as "Warrant Reason", on_probation_or_parole as "Are you on Probation or Parole?", officer_name as "Officer Name", officer_address as "Officer Address", probation_or_parole_terms as "Any Proabation or Parole Terms" FROM codelinc.veteran_legal_history WHERE veteran_id = $1 ',
      UserAssessmentDetailsITG:
        ' select * from codelinc.veteran_pi where veteran_id  = $1 '
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
        "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'veteran_transport_request';",
      getTableData: 'SELECT * FROM codelinc.veteran_treatment_goals',
      getVeteranId: 'select party_id from codelinc.web_party_info where username =$1',
      addUser: 'INSERT INTO codelinc.web_party_info(username,party_type,password,party_id) values ($1,$2,$3,$4)',
      addVeteran: 'INSERT INTO codelinc.veteran_pi(veteran_id,first_name,last_name,address_main,city,state,zip_code,date_of_birth,place_of_birth,ssn,gender,marital_status,race,primary_language,religious_preference,contact_person,contact_person_relationship,contact_person_phone,consent_status,nick_name,email) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)',
      addCaseWorker: 'INSERT INTO codelinc.case_worker_info(case_worker_id,nick_name,email) values ($1,$2,$3)'
    },
    TreatmentPlan: {
      GetTreatmentPlanDetails:
      'SELECT vp.first_name,vp.last_name,vp.record_number,vp.date_of_birth,vp.intake_date,vp.hmis_id,vi.diagnosis,vi.supports,vi.strengths,vi.notes from codelinc.veteran_pi vp FULL OUTER JOIN codelinc.veteran_initial_treatment vi ON vp.veteran_id=vi.veteran_id where vp.veteran_id=$1',
      GetAllDetails:
      'SELECT vp.veteran_id,vp.first_name,vp.last_name,vp.address_main,vp.date_of_birth,vi.intake_date,vp.hmis_id,vp.primary_phone,vi.diagnosis,vi.supports,vi.strengths,vi.notes from codelinc.veteran_pi vp FULL OUTER JOIN codelinc.veteran_initial_treatment vi ON vp.veteran_id=vi.veteran_id ',
      SaveTreatmentPlanDetails:
      'INSERT INTO codelinc.veteran_initial_treatment(veteran_id,diagnosis,supports,strengths,notes) VALUES ($1, $2, $3, $4, $5)',
      UpdateTreatmentPlanDetails:
      'UPDATE codelinc.veteran_initial_treatment SET diagnosis = $2, supports = $3, strengths= $4 ,notes= $5 where veteran_id = $1'
    },
    SaveTreatmentPlan: {
      TreatmentPlanDetailsPH:
      'WITH ins1 as (INSERT into codelinc.veteran_treatment_goals(veteran_id,goal_type,goal_title,created_on,target_date) VALUES ($1, $2, $3, $4, $5) RETURNING goal_id as goalid) INSERT into codelinc.veteran_treatment_plan(goal_id,goal_plan_short_term,goal_plan_long_term) select  goalid, $6, $7 from ins1 '
    },
    TransportationRequest: {
      SaveTransportationDetails:
        'INSERT INTO codelinc.veteran_transport_request(veteran_id, pick_up_contact_phone, appointment_date, appointment_time, reason_for_request, pick_up_address_main, pick_up_address_line_2, pick_up_city, pick_up_state, pick_up_zip_code, requested_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)',
      
      GetTransportationRequests:
        'SELECT v.first_name, v.last_name, t.request_id, t.appointment_date, t.appointment_time, t.reason_for_request, t.transport_coordinator, t.nursing_notified, t.notified_by, t.pick_up_address_main, t.pick_up_city, t.pick_up_state, t.pick_up_zip_code, t.approved_date, t.date_filled FROM codelinc.veteran_pi v FULL OUTER JOIN codelinc.veteran_transport_request t  ON v.veteran_id = t.veteran_id WHERE t.approved_date IS NULL AND t.request_id IS NOT NULL ORDER BY t.request_id DESC',
      ApproveTransportationRequests:
        'UPDATE codelinc.veteran_transport_request SET transport_coordinator = $2, nursing_notified = $3, notified_by = $4, approved_date = $5, date_filled= $6 WHERE request_id = $1'
    },
    HealthTracker: {
      saveHealthTrackerRequest:
        'INSERT INTO codelinc.veteran_health_tracker(veteran_id,tracking_subject,note_date,measurement,tracking_comments,current_tracker) VALUES ($1, $2, $3, $4, $5, $6)',
      updateHealthTrackerRequest:
        'UPDATE codelinc.veteran_health_tracker SET current_tracker=false WHERE veteran_id=$1 and tracking_subject=$2 and note_date=$3 and measurement=$4 and tracking_comments=$5 and current_tracker=$6',
      getHealthTracker:
        'select * from codelinc.veteran_health_tracker where veteran_id=$1'
    },
    InitialAssessment: {
      page1: 'select first_name from codelinc.veteran_pi where veteran_id = $1',
      page2: '',
      page3: '',
      page4SubAbu: 'UPDATE codelinc.veteran_substances SET alcohol_history=$10, currently_consumes_alcohol=$6, current_alcohol_intake_freq=$1, drug_use_history=$12, currently_uses_drugs=$8, current_drug_use_freq=$4, drug_alcohol_last_use=$14, current_drug_alcohol_treatment=$3, withdrawal_history=$16, tobacco_use_history=$13 , currently_uses_tobacco=$9, current_tobacco_use_freq=$5, caffeine_use_history=$11, currently_uses_caffeine=$7, current_caffeine_use_freq=$2, treatment_programs=$15 where veteran_id  = 4;',
      page4legal: 'UPDATE codelinc.veteran_legal_history  SET ever_arrested = $5, arrest_reason = $1, ever_convicted = $6, conviction_reason = $3, current_pending_charges = $4,charges=$2, outstanding_warrants=$10, warrant_reason=$12, on_probation_or_parole=$9, officer_name=$8, officer_address=$7, probation_or_parole_terms=$11 where veteran_id = 4',
      page5: ''
    }
  }
});
