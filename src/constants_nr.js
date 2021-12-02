module.exports = Object.freeze({
    REGION: "us-east-1",
    HOST: "codelinc-dev-instance-1.cc3ixdgzorsu.us-east-1.rds.amazonaws.com",
    USER: "nadina",
    PASSWORD: "jwoe83Hgw",
    DATABASE: "codelinc",
    PORT: "5432",

    QUERIES: {
        ConsentForm: {
            GetUserDetails: "select * from codelinc.veteran_pi where veteran_id = $1",
            AcceptContent: ""
        },
        ProgressNotes: {
            GetGoals: "",
            AddGoal: "",
            UpdateGoalStatus: ""
        },
        UserProfile: {
            GetUserDetails: "",
            UpdateUserDetails: ""
        },
        UiLayout: {
            GetUserDetailsForVet: "",
            GetUserDetailsForCaseWorker: "",
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