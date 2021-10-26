module.exports = Object.freeze({
    REGION: "us-east-1",
    HOST: "db-postgresql.abcdefghi.ap-southeast-1.rds.amazonaws.com",
    USER: "db_instance",
    PASSWORD: "my_password",
    DATABASE: "database_name",
    PORT: "3333",

    QUERIES: {
        ConsentForm: {
            GetUserDetails: "",
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