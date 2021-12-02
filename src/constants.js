module.exports = Object.freeze({
    QUERIES: {
        ConsentForm: {
            GetUserDetails: "SELECT first_name, last_name, consent_status FROM codelinc.veteran_pi WHERE veteran_id = $1",
            AcceptConsent: "UPDATE codelinc.veteran_pi SET consent_status = true WHERE veteran_id = $1"
        },
        ProgressNotes: {
            GetGoals: "",
            AddGoal: "",
            UpdateGoalStatus: "INSERT INTO codelinc.veteran_treatment_goals(veteran_id, goal_id, goal_description) VALUES($1, $2, $3) ON CONFLICT (veteran_id) DO UPDATE SET goal_description = EXCLUDED.goal_description"
        },
        UserProfile: {
            GetUserDetails: "SELECT photo, nick_name, address_main, address_line_2, city, state, county, zip_code, primary_phone, marital_status, contact_person, contact_person_relationship, contact_person_address, contact_person_phone from codelinc.veteran_pi where veteran_id = $1",
            UpdateUserDetails: "UPDATE codelinc.veteran_pi SET photo = $1, nick_name =  $2, address_main = $3, address_line_2 =  $4, city =  $5, state = $6, county = $7, zip_code = $8, primary_phone =  $9, marital_status = $10, contact_person = $11, contact_person_relationship = $12, contact_person_address = $13, contact_person_phone = $14 WHERE veteran_id = 5"
        },
        UiLayout: {
            GetUserDetailsForVet: "",
            GetUserDetailsForCaseWorker: "SELECT c.photo, c.nick_name, w.last_login_date_time from codelinc.case_worker_info c JOIN codelinc.web_party_info w on c.case_worker_id = w.party_id where case_worker_id = $1",
            GetUnreadMessageCount: ""
        },
        TreatmentPlan: {
            GetTreatmentPlanDetails: "",
            UpdateTreatmentPlanDetails: ""
        },
        TransportationRequest: {
            GetTransportationRequests: "",
            ApproveTransportationRequests: ""
        }
    }

});