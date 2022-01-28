module.exports = Object.freeze({
    QUERIES: {
        ConsentForm: {
            GetUserDetails: "",
            AcceptContent: ""
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
            SaveTransportationDetails: "INSERT INTO codelinc.veteran_transport_request(veteran_id, appointment_date, appointment_time, reason_for_request, pick_up_address_main, pick_up_city, pick_up_state, pick_up_zip_code, date_filled) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            GetTransportationRequests: "SELECT v.first_name, v.last_name, t.request_id, t.appointment_date, t.appointment_time, t.reason_for_request, t.transport_coordinator, t.nursing_notified, t.notified_by, t.pick_up_address_main, t.pick_up_city, t.pick_up_state, t.pick_up_zip_code, t.approved_date, t.date_filled FROM codelinc.veteran_pi v FULL OUTER JOIN codelinc.veteran_transport_request t ON v.veteran_id = t.veteran_id WHERE t.veteran_id = $1",
            ApproveTransportationRequests: "UPDATE codelinc.veteran_transport_request SET transport_coordinator = $2, nursing_notified = $3, notified_by = $4, approved_date = $5 WHERE request_id = $1"
        }
    }

});