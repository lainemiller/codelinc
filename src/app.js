const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const { getCurrentInvoke } = require("@vendia/serverless-express");
const ejs = require("ejs").__express;
const app = express();
const router = express.Router();

var constants = require('./constants');
const sequentialQueries  = require ('../src/AssessmentHandler/assessment.js');
const secrets = require('./secret');

//Calendar events
const { google } = require("googleapis");

// Provide the required configuration
//const CREDENTIALS = { "type": "service_account","project_id": "calendardemoapi-356911","private_key_id": "560348301f78f6f0ccdffdbc19f9f18eb684e6e6","private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDYFKcDArPJ3SMx\nXsLC7XM4ugvm7m7PkfRjyi8dT1b/DC/g7LsCTV3ZLYa+z/bRGM4jK9pXcY7kSvRp\ndFM37OY3RKgdTLQkOlOPFUjZViCOrToivD/egxdFiQe667pBByRRsZ5pprSE21Ta\nBcgEJIKD+I8SDGLiqj0O2WnTcCIODKjoEnekQ3P21NnFlsTpTy5CJ8WB8sF2x/ln\n9gPeX+BPj70299MWiXlv91Ubp47Q8CWQ9iSNFUW3OmEeBDecKRZZU2N5a73DTH/g\n5RCAOYm/IFdTQSVvd12MORCpfU6/BreFtfXPNBmGUs5ErQnOoyjgj2h7p4H7JxyM\ntSIUMOW/AgMBAAECggEAQuVl7UMtaR360sKNFm8P4GyM2cJQcRe1Kx3Bp1fUTaK2\nwfJYVTahiuaS1EkrFwIQc4gUkUTZYako8OrwBpzjixHI4EVKcfrSurXyt0J4UuOj\nX3Sba2Z3UnJBf+eR4qb04gvUyM2xDn6ezt7CVTH+bCAMHyDRjm34+DtsDWcmS+Wi\nd7jUYfDAeWAQV0Bbt5jmFBIRTIU7WA2tOg5bI9TY2bu+NWKIyEnfZwrGS27uSvwx\nhcL4luXmL3MxN8TA2HCj1T5BR9ZkfQfVdEm2dg44ldqEmOFMijCnGyL1wtXi+iDD\nMwL7KJISlMPmaNgT4Z4J7XUXlfD5GrybnQnghyaU/QKBgQD8h/UPXjZ2jf7NKCTX\nOZbVOmDQWaRQkISDVyCfqmiRZNMwJ1Lz5PCHUpKmdXQe+07LHYKsx7BshRIppuMq\nEBf49NSuQvSSlDRs+utkZyMq7dcD9Vs5CARhffQrsinp4RPzD0KwKkPA2VZ+hgTo\nqPkep6/a8VV6dQ2+kGbSzQJ7QwKBgQDbDIPIhZPVLW1CZH56EVhygVZbCqLkB4Dy\nyRPbheWl4ZABkxUVDztqydHoD9l9ui5vLPH/JPh6Ebgqgf/UeFVfDgbss+e3v6jj\nyjVrLAYUX8eBl39qKVgUpLFHYlaLXmI82qe1KYaHaZizltSIkBlX64DaTDEY9Vf9\nLu1IBDNd1QKBgQCHewlmbU0a3aNNvbPGJAdf7inynaUh8+aj8CJ4hpwDJOyIcRB3\n+ONyNkKnO2xJEtp67iIlQBzOm7Xa0sYc0vWJgxB3TUSZPxnBPfz7qLmdVmx8my2N\ns1dmVoSgzLzf1Pk29YD5sjMXS4Kz7oLDr6O3Zo9aDw+k2xe8nQwNHB+wsQKBgQCL\nAzMy84qxFCYtp0cYwp9F88zQ9DwRyK1N5swiWaQ3FKHmTehoOAV2LOR4iG53Osuz\nJGvjhxvlpA8jcuLffQp4y5cbasTYONq+zRn/jK3DClG7bWCgB+LtHuOesMrJoblo\ncz9RWiwVDa+p8UOp8wESadOZNhdGhpUziS9ur7PFjQKBgEbPhWoPJKbBi4f5rP9I\nl5Ly7g5xRXAPe1VBd9h3xgAeb6RgHd5gps9jjhML3hlI5fa3wJytJ1zX6sA/bSvo\n6FN03dy0xIo1Aa9KQK5JsLjnSI6/uwytMTiv8Lnq8NgihDZKRQt3APAn/uEKaqd3\nouWACBG2nArTJg+P56PZc/23\n-----END PRIVATE KEY-----\n", "client_email": "testing-calendar-api@calendardemoapi-356911.iam.gserviceaccount.com", "client_id": "106233731448948100309", "auth_uri": "https://accounts.google.com/o/oauth2/auth","token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/testing-calendar-api%40calendardemoapi-356911.iam.gserviceaccount.com"};
const calendarId = "uevmkimq6ddb2b830mob5ecees@group.calendar.google.com";

// Google calendar API settings
const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
  "testing-calendar-api@calendardemoapi-356911.iam.gserviceaccount.com",
  null,
  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDYFKcDArPJ3SMx\nXsLC7XM4ugvm7m7PkfRjyi8dT1b/DC/g7LsCTV3ZLYa+z/bRGM4jK9pXcY7kSvRp\ndFM37OY3RKgdTLQkOlOPFUjZViCOrToivD/egxdFiQe667pBByRRsZ5pprSE21Ta\nBcgEJIKD+I8SDGLiqj0O2WnTcCIODKjoEnekQ3P21NnFlsTpTy5CJ8WB8sF2x/ln\n9gPeX+BPj70299MWiXlv91Ubp47Q8CWQ9iSNFUW3OmEeBDecKRZZU2N5a73DTH/g\n5RCAOYm/IFdTQSVvd12MORCpfU6/BreFtfXPNBmGUs5ErQnOoyjgj2h7p4H7JxyM\ntSIUMOW/AgMBAAECggEAQuVl7UMtaR360sKNFm8P4GyM2cJQcRe1Kx3Bp1fUTaK2\nwfJYVTahiuaS1EkrFwIQc4gUkUTZYako8OrwBpzjixHI4EVKcfrSurXyt0J4UuOj\nX3Sba2Z3UnJBf+eR4qb04gvUyM2xDn6ezt7CVTH+bCAMHyDRjm34+DtsDWcmS+Wi\nd7jUYfDAeWAQV0Bbt5jmFBIRTIU7WA2tOg5bI9TY2bu+NWKIyEnfZwrGS27uSvwx\nhcL4luXmL3MxN8TA2HCj1T5BR9ZkfQfVdEm2dg44ldqEmOFMijCnGyL1wtXi+iDD\nMwL7KJISlMPmaNgT4Z4J7XUXlfD5GrybnQnghyaU/QKBgQD8h/UPXjZ2jf7NKCTX\nOZbVOmDQWaRQkISDVyCfqmiRZNMwJ1Lz5PCHUpKmdXQe+07LHYKsx7BshRIppuMq\nEBf49NSuQvSSlDRs+utkZyMq7dcD9Vs5CARhffQrsinp4RPzD0KwKkPA2VZ+hgTo\nqPkep6/a8VV6dQ2+kGbSzQJ7QwKBgQDbDIPIhZPVLW1CZH56EVhygVZbCqLkB4Dy\nyRPbheWl4ZABkxUVDztqydHoD9l9ui5vLPH/JPh6Ebgqgf/UeFVfDgbss+e3v6jj\nyjVrLAYUX8eBl39qKVgUpLFHYlaLXmI82qe1KYaHaZizltSIkBlX64DaTDEY9Vf9\nLu1IBDNd1QKBgQCHewlmbU0a3aNNvbPGJAdf7inynaUh8+aj8CJ4hpwDJOyIcRB3\n+ONyNkKnO2xJEtp67iIlQBzOm7Xa0sYc0vWJgxB3TUSZPxnBPfz7qLmdVmx8my2N\ns1dmVoSgzLzf1Pk29YD5sjMXS4Kz7oLDr6O3Zo9aDw+k2xe8nQwNHB+wsQKBgQCL\nAzMy84qxFCYtp0cYwp9F88zQ9DwRyK1N5swiWaQ3FKHmTehoOAV2LOR4iG53Osuz\nJGvjhxvlpA8jcuLffQp4y5cbasTYONq+zRn/jK3DClG7bWCgB+LtHuOesMrJoblo\ncz9RWiwVDa+p8UOp8wESadOZNhdGhpUziS9ur7PFjQKBgEbPhWoPJKbBi4f5rP9I\nl5Ly7g5xRXAPe1VBd9h3xgAeb6RgHd5gps9jjhML3hlI5fa3wJytJ1zX6sA/bSvo\n6FN03dy0xIo1Aa9KQK5JsLjnSI6/uwytMTiv8Lnq8NgihDZKRQt3APAn/uEKaqd3\nouWACBG2nArTJg+P56PZc/23\n-----END PRIVATE KEY-----\n",
  SCOPES
);

const { Pool } = require("pg");
const { QUERIES } = require("./constants");
const pool = new Pool({
  host: secrets.HOST,
  user: secrets.USER,
  password: secrets.PASSWORD,
  database: secrets.DATABASE,
  port: secrets.PORT,
});

pool.on("error", (err, client) => {
  console.error("unexpected error in postress conection pool", err);
});

app.set("view engine", "ejs");
app.engine(".ejs", ejs);

router.use(compression());

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.json({ answer: "success" });
});

router.get("/users", (req, res) => {
  res.json(users);
});

router.get("/queryString", (req, res) => {
  const query = req.query;
  res.json({
    qs: query,
    congratulate: true,
  });
});

router.get("/users/:userId", (req, res) => {
  const user = getUser(req.params.userId);

  if (!user) return res.status(404).json({});

  return res.json(user);
});

router.post("/users", (req, res) => {
  const user = {
    id: ++userIdCounter,
    name: req.body.name,
  };
  users.push(user);
  res.status(201).json(user);
});

router.put("/users/:userId", (req, res) => {
  const user = getUser(req.params.userId);

  if (!user) return res.status(404).json({});

  user.name = req.body.name;
  res.json(user);
});

router.delete("/users/:userId", (req, res) => {
  const userIndex = getUserIndex(req.params.userId);

  if (userIndex === -1) return res.status(404).json({});

  users.splice(userIndex, 1);
  res.json(users);
});

router.get("/cookie", (req, res) => {
  res.cookie("Foo", "bar");
  res.cookie("Fizz", "buzz");
  res.json({});
});
router.get('/transportationForm/getTransportationRequests/', (req, res) => {

  pool
  .query(QUERIES.TransportationRequest.GetTransportationRequests)
  .then(resp => {
    console.log('success on endpoint GetTransportationRequests')
      res.json(resp.rows)
  })
  .catch(err => {
    console.error('Error exectuting query', err.stack)
    res.status(501).json({err})
  })
})
router.get("/getCalendarEvents", (req, res) => {
  // Get all the events between two dates
  let returnObj = null;

  const getEvents = async (dateTimeStart, dateTimeEnd) => {
    try {
      let response = await calendar.events.list({
        auth: auth,
        calendarId: calendarId,
        // timeMin: dateTimeStart,
        // timeMax: dateTimeEnd,
        timeZone: "Asia/Kolkata",
      });
      let items = response["data"]["items"];
      return items;
    } catch (error) {
      console.log(`Error at getEvents --> ${error}`);
      return 0;
    }
  };
  let start = "2022-07-20T00:00:00.000Z";
  let end = "2022-07-28T00:00:00.000Z";
  getEvents(start, end)
    .then((res) => {
      returnObj = res;
      console.log("all events", returnObj);
    })
    .catch((err) => {
      console.log(err);
    });
  res.json(returnObj);
});
// Endpoint 4
router.get("/consentForm/getUserDetails/:veteranId", (req, res) => {
  const vet = req.params.veteranId;
  console.log(vet);
  let returnObj = null;

  pool
    .query(QUERIES.ConsentForm.GetUserDetails, [vet])
    .then((res) => (returnObj = res.rows))
    .catch((err) => console.error("Error executing query", err.stack));

  res.json(returnObj);
});

router.get("/allTables", (req, res) => {
  let returnObj = null;
  pool
    .query(QUERIES.UiLayout.getTableNames)
    .then((res) => {
      returnObj = res.rows;
      console.log(res.rows);
    })
    .catch((err) => console.error("Error executing query", err.stack));

  res.json(returnObj);
});

//pravin apis to get data from local mock files
router.get("/userdetailsVeteran", (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.GetUserDetailsForVet);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});
router.get("/assessmentDetails", (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.GetUserAssessmentForVet);

  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});



//fetch assessment data from database
router.get('/assessmentDetailsTest/:veteranID', (req, res) => {
  const vet = req.params.veteranID;
  pool
  .query(QUERIES.UserProfile.UserAssessmentDetails, [vet])
  .then((response) => { response.rows;
  res.json(handler(response.rows));
  })
  .catch(err => {console.error('Error executing query', err.stack)
  res.status(500).json({err});})
})
router.get("/calendarEvents", (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getCalendarEvents);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});
router.get("/progressNotes", (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getProgressNotes);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});
router.get("/resedentSearch", (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getResedentData);
  console.log(users);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});
router.get("/consentData", (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getConsentData);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});
router.get("/transportationRequestData", (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.GetTransportationData);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});

//column names
router.get("/allTablesCol", (req, res) => {
  let returnObj = null;
  pool
    .query(QUERIES.UiLayout.getTableColumns)
    .then((res) => {
      returnObj = res.rows;
      console.log(res.rows);
    })
    .catch((err) => console.error("Error executing query", err.stack));

  res.json(returnObj);
});


router.get('/allTables',(req,res)=>{
  let returnObj = null;
  pool
  .query(QUERIES.UiLayout.getTableNames)
  .then(res =>{ returnObj = res.rows;
  console.log(res.rows);})
  .catch(err => console.error('Error executing query', err.stack))

  res.json(returnObj);
})

//trying to get table data

router.get('/tableData',(req,res)=>{
  let returnObj = null;
  pool
  .query(QUERIES.UiLayout.getTableData)
  .then(res =>{ returnObj = res.rows;
  console.log(res.rows);})
  .catch(err => console.error('Error executing query', err.stack))

  res.json(returnObj);
})

//

//query check

router.get('/queryCheck',(req,res)=>{
  let returnObj = null;
  pool
  .query(QUERIES.checkQuery.query)
  .then(res =>{ returnObj = res.rows;
  console.table(res.rows);})
  .catch(err => console.error('Error executing query', err.stack))

  res.json(returnObj);
})

//


//pravin apis to get data from local mock files
router.get('/userdetailsVeteran', (req, res) => {
    const users = require(QUERIES.myApisJsonUrls.GetUserDetailsForVet)
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);

})

router.get('/assessmentDetails/:veteranID', (req, res) => {
  const vet = req.params.veteranID;

  pool
  .query(QUERIES.UserProfile.UserAssessmentDetailsFinance, [vet])
  .then((response) => { response.rows; 
  res.json({assessment_details:[{header:"personal information",data:response.rows}]});
  })
  .catch(err => {console.error('Error executing query', err.stack)
  res.status(500).json({err});})
})

// assessment API testing
router.get('/assessmentDetailsTest/:veteranID', (req, res) => {
  const vet = req.params.veteranID;

  //  pool.query(QUERIES.UserProfile.UserAssessmentDetails, [vet])
  // .then((PIResponse, FinanceResponse) => { //response.rows; 
  //   console.log('pi response', PIResponse);
  // //console.log('fi response',FinanceResponse.rows);
  // res.json(handler(PIResponse.rows));
  // })
  // .catch(err => {console.error('Error executing query', err.stack)
  // res.status(500).json({err});})

  res.status(200).json(sequentialQueries(vet));
})

//getting data from mock json
router.get('/assessmentDetailsMock', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.GetUserAssessmentForVet)
  res.json(users);
})

router.get('/calendarEvents', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getCalendarEvents)
  res.json(users);
})
router.get('/progressNotes', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getProgressNotes)
  res.json(users);
})

router.get('/resedentSearch', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getResedentData)
  res.json(users);
})

router.get('/consentData', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getConsentData)
  res.json(users);

})

router.get('/transportationRequestData', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.GetTransportationData)
  res.json(users);
})

//column names
router.get('/allTablesCol',(req,res)=>{
  let returnObj = null;
  pool
  .query(QUERIES.UiLayout.getTableColumns)
  .then(res =>{ returnObj = res.rows;
  console.log(res.rows);})
  .catch(err => console.error('Error executing query', err.stack))

  res.json(returnObj);
})



// Endpoint 5
router.put("/consentForm/acceptContent/:veteranId", (req, res) => {
  const vet = req.params.veteranId;
  const returnStatus = null;

  pool
    .query(QUERIES.ConsentForm.AcceptContent, vet)
    .then((res) => (returnStatus = res.status))
    .catch((err) => console.error("Error executing query", err.stack));

  res.status(returnStatus);
});

// Endpoint 6
router.get("/uiLayout/getUserDetails/:veteranId", (req, res) => {
  const vet = req.params.veteranId;
  const returnObj = null;

  pool
    .query(QUERIES.ConsentForm.GetUserDetails, vet)
    .then((res) => (returnObj = res.rows))
    .catch((err) => console.error("Error executing query", err.stack));

  res.json(returnObj);
});

// Endpoint 7
router.get('/getGoals/:veteranId', (req, res) => {
  const vet = req.params.veteranId;

  pool
  .query(QUERIES.ProgressNotes.GetGoals, [vet])
  .then((response) => { response.rows; 
  res.json(response.rows)})
  .catch(err => {console.error('Error executing query', err.stack)
  res.status(500).json({err});})
  
})


//progress notes get api for testing
//router.get('/getGoalsTest/:veteranId', (req, res) => {
  //const vet = parseInt(req.params.veteranId);
  //pool.query(QUERIES.ProgressNotes.GetGoals, [vet], (error, results) => {
	//  if (error){
		//  throw error
	//  }
	 // res.status(200).json(results.rows)
  //})

//})


// Endpoint 8
router.post('/progressNotes/addGoal/', (req, res) => {
  const goalId = null
  const requestObj = [
    4,	
    req.body.goalDescription,
	null
	//req.body.goalState
  ]
  pool
  .query(QUERIES.ProgressNotes.AddGoal, requestObj)
  .then(res => goalId = res.rows[0])
  .catch(err => console.error('Error executing query', err.stack))
  res.json(goalId);
})

// Endpoint 9
router.post('/progressNotes/updateGoalStatus/', (req, res) => {
  //const goalId = req.params.veteranId;
  const requestObj = [
    4,
    req.body.goal_id, 
    req.body.goal_status
  ]
  pool
  .query(QUERIES.ProgressNotes.UpdateGoalStatus, requestObj)
  .then(res => goalId = res.rows[0])
  .catch(err => console.error('Error executing query', err.stack))
  res.json(goalId);
})

// Endpoint 10
router.get("/userProfile/getUserDetails/:veteranID", (req, res) => {
  pool
    .query(QUERIES.UserProfile.GetUserDetails, [req.params.veteranID])
    .then((resp) => {
      console.log("success on endpoint 10: ", resp);
      res.json({ vetID: req.params.veteranID, result: resp.rows });
    })
    .catch((err) => {
      console.error("Error executing query", err.stack);
      res.status(501).json({ err });
    });
});

// Endpoint 11
router.put("/userProfile/updateUserDetails/", (req, res) => {
  let returnStatus = null;
  console.log("incoming req: ", req.body);
  let nick_name = req.body.nick_name;
  // const requestObj = {
  //   veteran_id: req.params.veteran_id,
  //   photo: req.params.photo,
  //   nick_name: req.params.nick_name,
  //   address_main: req.params.address_main,
  //   address_line_2: req.params.address_line_2,
  //   city: req.params.city,
  //   state: req.params.state,
  //   country: req.params.country,
  //   zip_code: req.params.zip_code,
  //   primary_phone: req.params.primary_phone,
  //   martial_status: req.params.martial_status,
  //   contact_person: req.params.contact_person,
  //   contact_person_relationship: req.params.contact_person_relationship,
  //   contact_person_address: req.params.contact_person_address,
  //   contact_person_phone: req.params.contact_person_phone
  // }

  pool
    .query(QUERIES.UserProfile.UpdateUserDetails, [nick_name])
    .then((res) => {
      returnStatus = res.status;
      console.log(returnStatus);
    })
    .catch((err) => console.error("Error executing query", err.stack));

  res.status(returnStatus);
});

// Endpoint 12
router.get("/uiLayout/getUserDetails/:caseWorkerId", (req, res) => {
  const caseWorker = req.params.caseWorkerId;
  const returnObj = null;

  pool
    .query(QUERIES.UiLayout.GetUserDetails, caseWorker)
    .then((res) => (returnObj = res.rows))
    .catch((err) => console.error("Error executing query", err.stack));

  res.json(returnObj);
});

// Endpoint 13
router.get("getUnreadMessageCount", (req, res) => {
  const returnObj = null;

  pool
    .query(QUERIES.UiLayout.GetUnreadMessageCount)
    .then((res) => (returnObj = res.rows))
    .catch((err) => console.error("Error executing query", err.stack));

  res.json(returnObj);
});

// Endpoint 14
// Case Manager GetTreatmentPlanDetails
router.get("getTreatmentPlanDetails", (req, res) => {
  const params = {
    veteran_id: req.body.veteran_id,
  };
  const returnObj = null;

  pool
    .query(QUERIES.TreatmentPlan.GetTreatmentPlanDetails, params)
    .then((res) => (returnObj = res.rows))
    .catch((err) => console.error("Error executing query", err.stack));

  res.json(returnObj);
});

// Endpoint 15
router.post("/updateTreatmentPlan", (req, res) => {
  const requestObj = {
    veteran_id: req.body.veteran_id,
    positives_in_year,
    challenges_in_year,
    immediate_concerns,
    short_term_goals,
    physical_health_goals,
    mental_health_goals,
    career_health_goals,
    family_goals,
    other_goals,
    strengths,
    reasons_admired,
    talents,
    people_important_to_me,
    people_seeing_me_as_important,
    activities_important_to_me,
    places_important_to_me,
    people_not_needed,
    things_not_needed,
    desired_life_changes,
    things_not_working,
    things_needed_for_community_activity,
    things_needed_for_health_and_safety,
    support_needed,
  };

  pool
    .query(QUERIES.TreatmentPlan.UpdateTreatmentPlanDetails, vet)
    .then((res) => (returnStatus = res.status))
    .catch((err) => console.error("Error executing query", err.stack));

  res.status(returnStatus);
});

//Endpoint 16
router.post('/transportationForm/saveTransportationRequest/', (req, res) => {

  //const vet = req.params.veteranId;
   const requestObj = [
 
     req.body.veteran_id,
     req.body.appointment_date,
     req.body.appointment_time,
     req.body.reason_for_request,
     req.body.pick_up_address_main, 
     req.body.pick_up_city,
     req.body.pick_up_state,
     req.body.pick_up_zip_code,
     req.body.date_filled
   ]
 
   pool
   .query(QUERIES.TransportationRequest.SaveTransportationDetails, requestObj)
   .then(resp => {
     console.log('success on endpoint SaveTransportationDetails')
     res.json({vetID:req.body.veteran_id, result: 'Successfully saved transportation request'})
   })
   .catch(err => {
     console.error('Error executing query', err.stack)
     res.status(501).json({err})
   })
 })

// Endpoint 17
router.get('/transportationForm/getTransportationRequests/', (req, res) => {
  //const veteran = req.params.veteranId

  pool
  .query(QUERIES.TransportationRequest.GetTransportationRequests)
   //.query(QUERIES.TransportationRequest.GetTransportationRequests, [veteran])
  .then(resp => {
    console.log('success on endpoint GetTransportationRequests')
    //res.json({veteranId: veteran, result: resp.rows})
     // res.json({result:resp.rows})
      res.json(resp.rows)
  })
  .catch(err => {
    console.error('Error exectuting query', err.stack)
    res.status(501).json({err})
  })
})

// Endpoint 18
router.post('/transportationForm/approveTransportationRequests', (req, res) => {

  const requestObj = [
    req.body.veteran_id,
    req.body.transport_coordinator,
    req.body.nursing_notified,
    req.body.notified_by,
    req.body.approved_date
  ]

  pool
  .query(QUERIES.TransportationRequest.ApproveTransportationRequests, requestObj)
  .then(resp => {
    console.log('success on endpoint ApproveTransportationDetails')
    res.json('Successfully approved transportation request')
  })
  .catch(err => console.error('Error executing query', err.stack))
}) 

router.post('/healthTracker/saveHealthTrackerRequest/:veteranId', (req, res) => {
  const trackerReq = Object.values(req.body);
  for (var i = 0; i < trackerReq.length; i++) {
    const requestParams = trackerReq[i];
    const requestObj = [
      req.params.veteranId,
      requestParams.trackingSubject,
      requestParams.date,
      requestParams.measurement,
      requestParams.comments
    ]
    if (requestParams.isUpdate) {
      pool.query(QUERIES.HealthTracker.updateHealthTrackerRequest, requestObj)
        .then(() => {
          console.log('sucess on endpoint UpdateHealthTracker')
        })
        .catch(err => console.error('Error executing query', err.stack))
    } else {
      pool.query(QUERIES.HealthTracker.saveHealthTrackerRequest, requestObj)
        .then(() => {
          console.log('sucess on endpoint SaveHealthTracker')
        })
        .catch(err => console.error('Error executing query', err.stack))
    }
  }
  res.json("Successfully saved Health Tracker request")
})

router.get('/healthTracker/getHealthTracker/:veteranId', (req, res) => {
  const requestObj = [req.params.veteranId];
  pool.query(QUERIES.HealthTracker.getHealthTracker, requestObj)
    .then(resp => {
      console.log("Sucess on get HealthTracker")
      res.json({ result: resp.rows })
    }).catch(err => console.error('Error executing query', err.stack))
}

)
const veteran1 = {
  first_name: "John",
  last_name: "Smith",
  email: "some@example.com",
  consent_received: true,
};

const getUser = (userId) => users.find((u) => u.id === parseInt(userId));
const getUserIndex = (userId) =>
  users.findIndex((u) => u.id === parseInt(userId));

// Ephemeral in-memory data store
const users = [
  {
    id: 1,
    name: "Joe",
  },
  {
    id: 2,
    name: "Jane",
  },
];
let userIdCounter = users.length;

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use("/", router);

// Export your express server so you can import it in the lambda function.
module.exports = app;
