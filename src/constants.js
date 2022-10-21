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
      getCalendarEventsForVeteran: 'SELECT * FROM codelinc.calendar WHERE position( $1 in participants)>0 OR isappointment = false',
      getCalendarEventsForCaseworker: 'SELECT * FROM codelinc.calendar WHERE case_worker_id = $1 OR isappointment = false',

      postEventsForCaseworker:
        'INSERT INTO codelinc.calendar(case_worker_id,participants,isappointment,title,description,eventstart,eventend) VALUES($1, $2, $3, $4, $5, $6, $7)'
    },
    ProgressNotes: {
      GetGoals:
         'SELECT goal_id as "goalId", goal_status as "goalState", goal_title as "goalTitle", created_on as "addedDate", goal_description as "goalDescription", goal_type as "goalType" FROM codelinc.veteran_treatment_goals WHERE veteran_id = $1',
      // 'SELECT * FROM codelinc.veteran_treatment_goals WHERE veteran_id = $1',
      AddGoal:
        'INSERT INTO codelinc.veteran_treatment_goals(veteran_id, goal_title, goal_type, goal_description, goal_status, created_on) VALUES($1, $2, $3, $4, $5, $6)',
      // UpdateGoalStatus: "INSERT INTO codelinc.veteran_treatment_goals(veteran_id, goal_id, goal_description) VALUES($1, $2, $3) ON CONFLICT (veteran_id) DO UPDATE SET goal_description = EXCLUDED.goal_description"
      UpdateGoalStatus:
        'UPDATE codelinc.veteran_treatment_goals SET goal_status = $3 WHERE veteran_id = $1 AND goal_id = $2'
    },
    UserProfile: {
      GetUserDetailsWithCaseworker: 'SELECT vp.veteran_id,vp.first_name,vp.address_line_2,vp.photo,vp.address_main,vp.city,vp.contact_person,vp.contact_person_address,vp.contact_person_phone,vp.contact_person_relationship,vp.county,vp.date_of_birth,vp.email,vp.gender,vp.hmis_id,vp.hobbies,vp.intake_date,vp.last_name,vp.marital_status,vp.middle_initial,vp.nick_name,vp.place_of_birth,vp.primary_language,vp.primary_phone,vp.race,vp.record_number,vp.religious_preference,vp.ssn,vp.state,vp.zip_code,cwi.nick_name as case_worker_nick_name from codelinc.veteran_pi vp join codelinc.case_worker_info cwi on cwi.case_worker_id=vp.case_worker_id where vp.veteran_id =$1',
      GetUserDetailsWithoutCaseworker:'SELECT * from codelinc.veteran_pi where veteran_id=$1',
      CheckCaseWorkerId:'SELECT case_worker_id FROM codelinc.veteran_pi where veteran_id =$1',
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
      addCaseWorker: 'INSERT INTO codelinc.case_worker_info(case_worker_id,nick_name,email) values ($1,$2,$3)',
      updateVeteranPhotoName: 'UPDATE codelinc.veteran_pi SET photo=$2 WHERE veteran_id=$1',
      updateCaseWorkerPhotoName: 'UPDATE codelinc.case_worker_info SET photo=$2 WHERE case_worker_id=$1'
    },
    TreatmentPlan: {
      GetTreatmentPlanDetails:
      'SELECT vp.first_name,vp.last_name,vp.record_number,vp.address_main,vp.date_of_birth,vp.intake_date,vp.hmis_id,vi.diagnosis,vi.supports,vi.strengths,vi.notes from codelinc.veteran_pi vp FULL OUTER JOIN codelinc.veteran_initial_treatment vi ON vp.veteran_id=vi.veteran_id where vp.veteran_id=$1',
      GetAllDetails:
      'SELECT veteran_id,first_name,last_name,address_main,date_of_birth, city from codelinc.veteran_pi ',
      GetTreatmentIssues:
      'SELECT vp.first_name,vp.last_name,vp.record_number,vp.address_main,vp.date_of_birth,vp.intake_date,vp.hmis_id,vi.diagnosis,vi.supports,vi.strengths,vi.notes,vtg.goal_id,vtg.goal_type,vtg.goal_title as goal,vtp.goal_plan_short_term as plan,vtp.goal_plan_long_term as strategy,vtg.target_date as targetDate from codelinc.veteran_pi vp FULL OUTER JOIN codelinc.veteran_initial_treatment vi ON vp.veteran_id=vi.veteran_id INNER JOIN codelinc.veteran_treatment_goals vtg ON vi.veteran_id=vtg.veteran_id INNER JOIN codelinc.veteran_treatment_plan vtp on vtg.goal_id = vtp.goal_id where vp.veteran_id = $1 order by goal_id asc',
      SaveTreatmentPlanDetails:
      'INSERT INTO codelinc.veteran_initial_treatment(veteran_id,diagnosis,supports,strengths,notes) VALUES ($1, $2, $3, $4, $5) on conflict(veteran_id) do update SET diagnosis = $2, supports = $3, strengths= $4 ,notes= $5',
      UpdateTreatmentPlanDetails:
      'UPDATE codelinc.veteran_initial_treatment SET diagnosis = $2, supports = $3, strengths= $4 ,notes= $5 where veteran_id = $1'
    },
    TreatmentIssues: {
      SaveTreatmentIssues:
      'WITH ins1 as (INSERT into codelinc.veteran_treatment_goals(veteran_id,goal_type,goal_title,created_on,target_date) VALUES ($1, $2, $3, $4, $5) RETURNING goal_id as goalid) INSERT into codelinc.veteran_treatment_plan(goal_id,goal_plan_short_term,goal_plan_long_term) select  goalid, $6, $7 from ins1 ',
      UpdateTreatmentGoals:
      'UPDATE codelinc.veteran_treatment_goals SET goal_title = $3,target_date = $4 WHERE goal_id = $2 AND veteran_id = $1',
      UpdateTreatmentPlans:
      'UPDATE codelinc.veteran_treatment_plan tp SET goal_plan_short_term = $2, goal_plan_long_term = $3 WHERE tp.goal_id = $1'
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
      getCwNickname: 'select nick_name from codelinc.case_worker_info',
      page2EAEPost: 'insert into codelinc.veteran_employment_education(veteran_id,current_occupation,current_employer ,current_employer_location ,previous_occupations ,work_skills ,highest_education_grade ,school_name ,active_military_status, military_branch ,discharge_type ,service_dates,service_location ,other_training_education) values($14,$13,$2,$3,$6,$9, $4,$7,$5,$1,$12,$10,$11,$8) on conflict(veteran_id) do update set current_occupation=$13,current_employer =$2,current_employer_location =$3,previous_occupations =$6,work_skills=$9, highest_education_grade =$4,school_name =$7,active_military_status =$5,military_branch = $1,discharge_type =$12,service_dates=$10,service_location =$11,other_training_education =$8',
      page2SocialPost: 'update codelinc.veteran_pi set hobbies = $2, religious_preference = $3 where veteran_id = $1',
      page2MHPost: 'insert into codelinc.veteran_mental_health (veteran_id ,diagnosis ,current_psych_treatment ,psychiatrist_name ,psychiatrist_address ,psychiatrist_city_state ,psych_past_treatments ,psych_consult_needed ,psych_evaluation_physician_name ,psych_evaluation_physician_address,psych_evaluation_physician_city ,psych_evaluation_physician_state ,psych_evaluation_physician_zipcode ,psych_evaluation_physician_license ) values ($13,$2,$1,$12,$11,$14,$4,$3,$8,$5,$6,$9,$10,$7) on conflict(veteran_id) do update set diagnosis =$2,current_psych_treatment =$1,psychiatrist_name =$12,psychiatrist_address =$11,psychiatrist_city_state =$14,psych_past_treatments =$4,psych_consult_needed =$3,psych_evaluation_physician_name =$8,psych_evaluation_physician_address=$5,psych_evaluation_physician_city =$6,psych_evaluation_physician_state =$9,psych_evaluation_physician_zipcode=$10,psych_evaluation_physician_license =$7',
      // page4SubAbu: 'UPDATE codelinc.veteran_substances SET alcohol_history=$10, currently_consumes_alcohol=$6, current_alcohol_intake_freq=$1, drug_use_history=$12, currently_uses_drugs=$8, current_drug_use_freq=$4, drug_alcohol_last_use=$14, current_drug_alcohol_treatment=$3, withdrawal_history=$16, tobacco_use_history=$13 , currently_uses_tobacco=$9, current_tobacco_use_freq=$5, caffeine_use_history=$11, currently_uses_caffeine=$7, current_caffeine_use_freq=$2, treatment_programs=$15 where veteran_id  = 4;',
      // page4legal: 'UPDATE codelinc.veteran_legal_history  SET ever_arrested = $5, arrest_reason = $1, ever_convicted = $6, conviction_reason = $3, current_pending_charges = $4,charges={$2}, outstanding_warrants=$10, warrant_reason=$12, on_probation_or_parole=$9, officer_name=$8, officer_address=$7, probation_or_parole_terms=$11 where veteran_id = 4',
      page4legal: 'insert into codelinc.veteran_legal_history(veteran_id ,ever_arrested ,arrest_reason ,ever_convicted ,conviction_reason ,current_pending_charges ,charges ,outstanding_warrants,warrant_reason ,on_probation_or_parole ,officer_name ,officer_address ,probation_or_parole_terms) values($12,$5,$1,$6,$3,$4 ,$2,$10,$13,$9,$8,$7,$11) on conflict(veteran_id) do update set ever_arrested =$5,arrest_reason =$1,ever_convicted =$6,conviction_reason =$3,current_pending_charges=$4 ,charges =$2,outstanding_warrants=$10,warrant_reason =$13,on_probation_or_parole =$9,officer_name =$8,officer_address =$7,probation_or_parole_terms =$11',
      page4SubAbu: 'insert into codelinc.veteran_substances(veteran_id ,alcohol_history ,currently_consumes_alcohol ,current_alcohol_intake_freq ,drug_use_history ,currently_uses_drugs ,current_drug_use_freq ,drug_alcohol_last_use ,current_drug_alcohol_treatment ,withdrawal_history ,tobacco_use_history ,currently_uses_tobacco ,current_tobacco_use_freq ,caffeine_use_history ,currently_uses_caffeine ,current_caffeine_use_freq ,treatment_programs) values($16,$10,$6,$1 ,$12,$8,$4,$14,$3 ,$17,$13,$9,$5,$11,$7,$2,$15) on conflict(veteran_id) do update set alcohol_history =$10,currently_consumes_alcohol =$6,current_alcohol_intake_freq =$1 ,drug_use_history =$12,currently_uses_drugs =$8,current_drug_use_freq =$4,drug_alcohol_last_use =$14,current_drug_alcohol_treatment=$3 ,withdrawal_history =$17,tobacco_use_history =$13,currently_uses_tobacco =$9,current_tobacco_use_freq =$5,caffeine_use_history =$11,currently_uses_caffeine =$7,current_caffeine_use_freq =$2,treatment_programs =$15',
      // getPage1: 'select first_name, last_name, middle_initial, nick_name, date_of_birth, place_of_birth, ssn, gender, marital_status, race, primary_phone, primary_language, address_main, address_line_2, city, county, zip_code, contact_person, contact_person_relationship, contact_person_address, contact_person_phone, income, income_type from codelinc.veteran_pi vpi natural join codelinc.veteran_finance vfi where vpi.veteran_id = $1'
      // getPage1: 'select first_name, last_name, middle_initial, nick_name, date_of_birth, place_of_birth, ssn, gender, marital_status, race, primary_phone, primary_language, address_main, address_line_2, city, county, zip_code, contact_person, contact_person_relationship, contact_person_address, contact_person_phone, income, income_type, bank_account_type, bank_name, direct_deposit, other_assets, cash_benefits, non_cash_benefits, current_benefits, needed_benefits ,medicaid_coverage, va_coverage, childhood, parent_relationship, sibling_relationship, discipline_type, physical_abuse_hist,sexual_abuse_hist, substance_abuse, family_hist_mental_health_and_substance_abuse, ever_married, times_married, current_marital_status, sexual_orientation, sexually_active, sexual_concerns,  sexual_concern_specifics, hiv_tested, hiv_test_location, approx_hiv_test_date, hiv_test_results, other_std_tested, std_test_location, approx_std_test_date, std_test_results, hiv_test_desired from codelinc.veteran_pi vpi natural join codelinc.veteran_finance vfi natural join codelinc.veteran_health_insurance vhi natural join codelinc.veteran_hist vhist where vpi.veteran_id = $1 and vhi.veteran_id = $1',
      // getPage4: 'select alcohol_history, currently_consumes_alcohol, current_alcohol_intake_freq, drug_use_history, currently_uses_drugs, current_drug_use_freq, drug_alcohol_last_use, current_drug_alcohol_treatment, tobacco_use_history, currently_uses_tobacco, data.current_tobacco_use_freq,currently_uses_caffeine,caffeine_use_history,currently_uses_caffeine,current_caffeine_use_freq, withdrawal_history, drug_alcohol_last_use from codelinc.veteran_substances where veteran_id = $1',
      getpage5: 'select * from codelinc.veteran_life_network where veteran_id=$1',
      postIAPage5: 'insert into codelinc.veteran_life_network(veteran_id,positives_in_year,challenges_in_year, immediate_concerns,reasons_admired ,talents ,people_important_to_me,activities_important_to_me,places_important_to_me,people_not_needed ,things_not_needed,desired_life_changes, things_not_working,things_needed_for_community_activity,things_needed_for_health_and_safety,support_needed, strengths, people_seeing_me_as_important) values($1,$2,$4, $3,$5,$6,$7,$8,$9,$10,$11,$13, $12,$14,$15,$16,$17,$18) on conflict(veteran_id) do update set veteran_id =$1,positives_in_year=$2,challenges_in_year =$4, immediate_concerns =$3,reasons_admired =$5,talents =$6,people_important_to_me =$7,activities_important_to_me =$8,places_important_to_me =$9,people_not_needed =$10,things_not_needed =$11,desired_life_changes=$13, things_not_working =$12,things_needed_for_community_activity =$14,things_needed_for_health_and_safety =$15,support_needed =$16, strengths=$17, people_seeing_me_as_important=$18',
      getPage4: 'select * from codelinc.veteran_substances vsub full outer join codelinc.veteran_legal_history vlh on vsub.veteran_id=vlh.veteran_id where vsub.veteran_id = $1 or vlh.veteran_id=$1',
      getPage1: 'select * from codelinc.veteran_pi vpi full outer join codelinc.veteran_finance vfi on vpi.veteran_id=vfi.veteran_id full outer join codelinc.veteran_health_insurance vhi on vpi.veteran_id=vhi.veteran_id full outer join codelinc.veteran_hist vhist on vpi.veteran_id=vhist.veteran_id where vpi.veteran_id = $1',
      getPage1FD: 'select * from codelinc.veteran_family where veteran_id=$1',
      // getPage2: 'select current_occupation ,current_employer ,current_employer_location ,previous_occupations ,work_skills ,highest_education_grade ,school_name ,active_military_status ,military_branch ,discharge_type ,service_dates ,service_location ,other_training_education  , religious_preference, hobbies, diagnosis ,current_psych_treatment ,psychiatrist_name ,psychiatrist_address ,psychiatrist_city_state ,psych_past_treatments ,psych_consult_needed ,psych_evaluation_physician_name ,psych_evaluation_physician_address ,psych_evaluation_physician_city ,psych_evaluation_physician_state, psych_evaluation_physician_zipcode ,psych_evaluation_physician_license from codelinc.veteran_employment_education vee natural join codelinc.veteran_pi vpi natural join codelinc.veteran_mental_health vmh where vee.veteran_id=$1',
      getPage2: 'select * from codelinc.veteran_employment_education vee full outer join codelinc.veteran_mental_health vmh on vmh.veteran_id=vee.veteran_id where vee.veteran_id = $1 or vmh.veteran_id=$1',
      getPage3: 'select * from codelinc.veteran_medical_status vms full outer join codelinc.veteran_mental_status vments on vms.veteran_id=vments.veteran_id where vms.veteran_id=$1 or vments.veteran_id=$1',
      postIAPage1PI: 'insert into codelinc.veteran_pi(veteran_id ,first_name,middle_initial,last_name, nick_name, address_main, address_line_2, city, state, county, zip_code, primary_phone, date_of_birth,place_of_birth, ssn, gender, marital_status,race, primary_language, contact_person, contact_person_relationship, contact_person_address, contact_person_phone, hobbies, religious_preference, consent_status) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) on conflict(veteran_id) do update set first_name = $2,middle_initial = $3,last_name = $4, nick_name = $5, address_main = $6, address_line_2 = $7, city = $8, state = $9, county = $10, zip_code = $11, primary_phone = $12, date_of_birth = $13,place_of_birth = $14, ssn = $15, gender = $16, marital_status = $17,race = $18, primary_language = $19, contact_person = $20, contact_person_relationship = $21, contact_person_address = $22, contact_person_phone = $23, hobbies = $24, religious_preference = $25, consent_status = $26',
      postIAPage1IR: 'insert into codelinc.veteran_finance (veteran_id,income, income_type,bank_account_type, bank_name, direct_deposit,other_assets, current_benefits, needed_benefits, cash_benefits,non_cash_benefits) values ($1, $6, $9, $2, $3, $5, $8, $10, $11, $4, $7) on conflict(veteran_id) do update set income =$6, income_type =$9,bank_account_type =$2,bank_name =$3,direct_deposit =$5,other_assets =$8,current_benefits=$10 ,needed_benefits=$11 ,cash_benefits =$4,non_cash_benefits =$7',
      postIAPage1FH: 'insert into codelinc.veteran_hist (veteran_id,childhood,parent_relationship ,sibling_relationship,discipline_type,physical_abuse_hist, sexual_abuse_hist, substance_abuse,family_hist_mental_health_and_substance_abuse, ever_married ,times_married,current_marital_status,sexual_orientation, sexually_active ,sexual_concerns ,sexual_concern_specifics, hiv_tested ,hiv_test_location ,approx_hiv_test_date ,hiv_test_results ,other_std_tested ,std_test_location ,approx_std_test_date, std_test_results ,hiv_test_desired ) values($1,$2,$13, $14,$4,$12, $15,$25,$5,$10,$11,$3,$16,$18,$17,$19,$23,$9,$8,$7,$24,$22,$21,$20,$6) on conflict(veteran_id) do update set childhood= $2,parent_relationship = $13,sibling_relationship= $14,discipline_type= $4,physical_abuse_hist = $12,sexual_abuse_hist = $15,substance_abuse = $25,family_hist_mental_health_and_substance_abuse = $5,ever_married = $10,times_married= $11,current_marital_status= $3,sexual_orientation = $16,sexually_active= $18,sexual_concerns = $17,sexual_concern_specifics = $19,hiv_tested = $23,hiv_test_location = $9,approx_hiv_test_date = $8,hiv_test_results = $7,other_std_tested = $24,std_test_location = $22,approx_std_test_date = $21,std_test_results = $20,hiv_test_desired = $6',
      postIAPage1HI: 'insert into codelinc.veteran_health_insurance (veteran_id, medicaid_coverage, va_coverage, medicare_coverage, other_med_coverage) values ($1, $2, $3, $4, $5) on conflict(veteran_id) do update set medicaid_coverage = $2, va_coverage = $3, medicare_coverage = $4, other_med_coverage = $5 ',
      page3menStaAssess: 'insert into codelinc.veteran_mental_status(veteran_id,general_appearance,affect,orientation_date, orientation_time, orientation_place, orientation_person, ideation, intact_recent_memory,intact_remote_memory,mood_as_expressed,mood_as_observed,thought_forum, recent_memory_issues, remote_memory_issues) values($1,$3,$2, $4,$7,$6,$5,$8,$9,$10,$11,$12,$13, $14, $15) on conflict(veteran_id) do update set general_appearance=$3,affect=$2,orientation_date=$4, orientation_time=$7, orientation_place=$6, orientation_person =$5, ideation=$8, intact_recent_memory=$9, intact_remote_memory=$10, mood_as_expressed=$11, mood_as_observed=$12, thought_forum=$13, recent_memory_issues =$14, remote_memory_issues=$15',
      // page3ideation: 'insert into codelinc.veteran_mental_status(veteran_id,ideation)',
      page3medInfo: 'insert into codelinc.veteran_medical_status(veteran_id ,primary_care_provider,primary_physician ,primary_physician_phone ,primary_physician_part_of_gp ,physician_gp ,clinic ,clinic_location ,hospital ,hospital_location ,under_specialist_care ,specialist_type ,specialist_name ,diagnosis ,current_treatment ,current_medications) values($1,$8,$2,$3,$9,$10,$4,$11,$5,$12,$13,$14,$15,$6,$16,$7 ) on conflict(veteran_id) do update set primary_care_provider =$8,primary_physician =$2,primary_physician_phone =$3,primary_physician_part_of_gp =$9,physician_gp=$10,clinic =$4,clinic_location =$11,hospital =$5,hospital_location =$12,under_specialist_care =$13,specialist_type =$14,specialist_name =$15,diagnosis =$6,current_treatment =$16,current_medications=$7 ',
      deleteMember: 'DELETE FROM codelinc.veteran_family WHERE veteran_id =$1 and veteran_family_id = $2;',
      addMember: 'insert into codelinc.veteran_family(veteran_id, name, age, relationship, living, location) values ($1, $2, $3, $4, $5, $6)',
      updateFamilyMemberDetails: 'update codelinc.veteran_family set name=$3, age=$4, living=$5, relationship=$6, location=$7 where veteran_id=$1 and veteran_family_id=$2'
    }
  }
});
