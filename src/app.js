// const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
// const { getCurrentInvoke } = require('@vendia/serverless-express')
const ejs = require('ejs').__express;
const app = express();
const router = express.Router();

// const constants = require('./constants')
const sequentialQueries = require('./assessment-handler/assessment.js');
const secrets = require('./secret');

const { Pool } = require('pg');
const { QUERIES } = require('./constants');
const pool = new Pool({
  host: secrets.HOST,
  user: secrets.USER,
  password: secrets.PASSWORD,
  database: secrets.DATABASE,
  port: secrets.PORT
});

pool.on('error', (err, client) => {
  console.error('unexpected error in postress conection pool', err);
});

app.set('view engine', 'ejs');
app.engine('.ejs', ejs);

router.use(compression());

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
  res.json({ answer: 'success' });
});

router.get('/users', (req, res) => {
  res.json(users);
});

router.get('/queryString', (req, res) => {
  const query = req.query;
  res.json({
    qs: query,
    congratulate: true
  });
});

router.get('/users/:userId', (req, res) => {
  const user = getUser(req.params.userId);

  if (!user) return res.status(404).json({});

  return res.json(user);
});

router.post('/users', (req, res) => {
  const user = {
    id: ++userIdCounter,
    name: req.body.name
  };
  users.push(user);
  res.status(201).json(user);
});

router.put('/users/:userId', (req, res) => {
  const user = getUser(req.params.userId);

  if (!user) return res.status(404).json({});

  user.name = req.body.name;
  res.json(user);
});

router.delete('/users/:userId', (req, res) => {
  const userIndex = getUserIndex(req.params.userId);

  if (userIndex === -1) return res.status(404).json({});

  users.splice(userIndex, 1);
  res.json(users);
});

router.get('/cookie', (req, res) => {
  res.cookie('Foo', 'bar');
  res.cookie('Fizz', 'buzz');
  res.json({});
});
router.get('/transportationForm/getTransportationRequests/', (req, res) => {
  pool
    .query(QUERIES.TransportationRequest.GetTransportationRequests)
    .then((resp) => {
      console.log('success on endpoint GetTransportationRequests');
      res.json(resp.rows);
    })
    .catch((err) => {
      console.error('Error exectuting query', err.stack);
      res.status(501).json({ err });
    });
});

// Endpoint 4
router.get('/consentForm/getUserDetails/:loginId', (req, res) => {
  const loginId = req.params.loginId;
  let returnObj = null;

  pool
    .query(QUERIES.ConsentForm.GetUserDetails, [loginId])
    .then((resp) => {
      returnObj = resp.rows;
      res
        .status(200)
        .json({ status: true, loginID: loginId, result: returnObj });
    })
    .catch((err) => console.error('Error executing query', err.stack));
});
router.get('/calendarEvents', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getCalendarEvents);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});
router.get('/progressNotes', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getProgressNotes);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});
router.get('/resedentSearch', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getResedentData);
  console.log(users);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});
router.get('/consentData', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getConsentData);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});
router.get('/transportationRequestData', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.GetTransportationData);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});

// column names
router.get('/allTablesCol', (req, res) => {
  let returnObj = null;
  pool
    .query(QUERIES.UiLayout.getTableColumns)
    .then((res) => {
      returnObj = res.rows;
      console.log(res.rows);
    })
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

router.get('/allTables', (req, res) => {
  let returnObj = null;
  pool
    .query(QUERIES.UiLayout.getTableNames)
    .then((res) => {
      returnObj = res.rows;
      console.log(res.rows);
    })
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

// trying to get table data

router.get('/tableData', (req, res) => {
  let returnObj = null;
  pool
    .query(QUERIES.UiLayout.getTableData)
    .then((res) => {
      returnObj = res.rows;
      console.log(res.rows);
    })
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

//

// query check

router.get('/queryCheck', (req, res) => {
  let returnObj = null;
  pool
    .query(QUERIES.checkQuery.query)
    .then((res) => {
      returnObj = res.rows;
      console.table(res.rows);
    })
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

//

// pravin apis to get data from local mock files
router.get('/userdetailsVeteran', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.GetUserDetailsForVet);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});

router.get('/assessmentDetails/:veteranID', (req, res) => {
  const vet = req.params.veteranID;

  pool
    .query(QUERIES.UserProfile.UserAssessmentDetailsFinance, [vet])
    .then((response) => {
      res.json({
        assessment_details: [
          { header: 'personal information', data: response.rows }
        ]
      });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(500).json({ err });
    });
});

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
});

// getting data from mock json
router.get('/assessmentDetailsMock', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.GetUserAssessmentForVet);
  res.json(users);
});

// column names
router.get('/allTablesCol', (req, res) => {
  let returnObj = null;
  pool
    .query(QUERIES.UiLayout.getTableColumns)
    .then((res) => {
      returnObj = res.rows;
      console.log(res.rows);
    })
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

router.get('/allTables', (req, res) => {
  let returnObj = null;
  pool
    .query(QUERIES.UiLayout.getTableNames)
    .then((res) => {
      returnObj = res.rows;
      console.log(res.rows);
    })
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

// trying to get table data

router.get('/tableData', (req, res) => {
  let returnObj = null;
  pool
    .query(QUERIES.UiLayout.getTableData)
    .then((res) => {
      returnObj = res.rows;
      console.log(res.rows);
    })
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

//

// query check

router.get('/queryCheck', (req, res) => {
  let returnObj = null;
  pool
    .query(QUERIES.checkQuery.query)
    .then((res) => {
      returnObj = res.rows;
      console.table(res.rows);
    })
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

//

// pravin apis to get data from local mock files
router.get('/userdetailsVeteran', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.GetUserDetailsForVet);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});

router.get('/assessmentDetails/:veteranID', (req, res) => {
  const vet = req.params.veteranID;

  pool
    .query(QUERIES.UserProfile.UserAssessmentDetailsFinance, [vet])
    .then((response) => {
      res.json({
        assessment_details: [
          { header: 'personal information', data: response.rows }
        ]
      });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(500).json({ err });
    });
});

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
});

// column names
router.get('/allTablesCol', (req, res) => {
  let returnObj = null;
  pool
    .query(QUERIES.UiLayout.getTableColumns)
    .then((res) => {
      returnObj = res.rows;
      console.log(res.rows);
    })
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

// Endpoint 5
router.put('/consentForm/acceptConsent/:loginId', (req, res) => {
  const currentDate = new Date();
  const consentStatus = true;
  const requestObjConsentStatus = [req.params.loginId, consentStatus];

  const requestObjConsentDate = [req.params.loginId, currentDate];

  pool
    .query(QUERIES.ConsentForm.AcceptConsentStatus, requestObjConsentStatus)
    .then(console.log('Sucess on Consent status update'))
    .catch((err) => console.error('Error executing query', err.stack));
  pool
    .query(QUERIES.ConsentForm.AcceptedConsentDate, requestObjConsentDate)
    .then(console.log('Sucess on Consent Date update'))
    .catch((err) => console.error('Error executing query', err.stack));

  res
    .status(200)
    .json({ status: true, result: 'Successfully Accepted Consent Form' });
});

// Endpoint 6
router.get('/uiLayout/getUserDetails/:veteranId', (req, res) => {
  const vet = req.params.veteranId;
  let returnObj = null;

  pool
    .query(QUERIES.ConsentForm.GetUserDetails, vet)
    .then((res) => (returnObj = res.rows))
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

// Endpoint 7
router.get('/getGoals/:veteranId', (req, res) => {
  const vet = req.params.veteranId;

  pool
    .query(QUERIES.ProgressNotes.GetGoals, [vet])
    .then((response) => {
      res.json(response.rows);
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(500).json({ err });
    });
});

// progress notes get api for testing
// router.get('/getGoalsTest/:veteranId', (req, res) => {
// const vet = parseInt(req.params.veteranId);
// pool.query(QUERIES.ProgressNotes.GetGoals, [vet], (error, results) => {
//  if (error){
//  throw error
//  }
// res.status(200).json(results.rows)
// })

// })

// Endpoint 8
router.post('/progressNotes/addGoal/', (req, res) => {
  const requestObj = [
    4,
    req.body.goalDescription,
    null
    // req.body.goalState
  ];
  pool
    .query(QUERIES.ProgressNotes.AddGoal, requestObj)
    .then((res) => res.rows[0])
    .catch((err) => console.error('Error executing query', err.stack));
  res.json(res.rows[0]);
});

// Endpoint 9
router.post('/progressNotes/updateGoalStatus/', (req, res) => {
  // const goalId = req.params.veteranId;
  const requestObj = [4, req.body.goal_id, req.body.goal_status];
  pool
    .query(QUERIES.ProgressNotes.UpdateGoalStatus, requestObj)
    .then((res) => res.rows[0])
    .catch((err) => console.error('Error executing query', err.stack));
  res.json(res.rows[0]);
});

// Endpoint 10
router.get('/userProfile/getUserDetails/:veteranID', (req, res) => {
  pool
    .query(QUERIES.UserProfile.GetUserDetails, [req.params.veteranID])
    .then((resp) => {
      res
        .status(200)
        .json({ responseStatus: 'SUCCESS', data: resp.rows, error: false });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res
        .status(501)
        .json({ responseStatus: 'FAILURE', data: null, error: err });
    });
});

// Endpoint 11
router.put('/userProfile/updateUserDetails/', (req, res) => {
  let returnStatus = null;
  console.log('incoming req: ', req.body);
  const nickName = req.body.nick_name;
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
    .query(QUERIES.UserProfile.UpdateUserDetails, [nickName])
    .then((res) => {
      returnStatus = res.status;
      console.log(returnStatus);
    })
    .catch((err) => console.error('Error executing query', err.stack));

  res.status(returnStatus);
});

// Endpoint 12
router.get('/uiLayout/getUserDetails/:caseWorkerId', (req, res) => {
  const caseWorker = req.params.caseWorkerId;
  let returnObj = null;

  pool
    .query(QUERIES.UiLayout.GetUserDetails, caseWorker)
    .then((res) => (returnObj = res.rows))
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

// Endpoint 13
router.get('getUnreadMessageCount', (req, res) => {
  let returnObj = null;

  pool
    .query(QUERIES.UiLayout.GetUnreadMessageCount)
    .then((res) => (returnObj = res.rows))
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

// Endpoint 14
// Case Manager GetTreatmentPlanDetails
router.get('getTreatmentPlanDetails', (req, res) => {
  const params = {
    veteran_id: req.body.veteran_id
  };
  let returnObj = null;

  pool
    .query(QUERIES.TreatmentPlan.GetTreatmentPlanDetails, params)
    .then((res) => (returnObj = res.rows))
    .catch((err) => console.error('Error executing query', err.stack));

  res.json(returnObj);
});

// Endpoint 15


//VeteranTreatmentPlan Save details
router.post('/updateTreatmentPlan', (req, res) => {
  // const requestObj = {
  //   veteran_id: req.body.veteran_id,
  //   positives_in_year,
  //   challenges_in_year,
  //   immediate_concerns,
  //   short_term_goals,
  //   physical_health_goals,
  //   mental_health_goals,
  //   career_health_goals,
  //   family_goals,
  //   other_goals,
  //   strengths,
  //   reasons_admired,
  //   talents,
  //   people_important_to_me,
  //   people_seeing_me_as_important,
  //   activities_important_to_me,
  //   places_important_to_me,
  //   people_not_needed,
  //   things_not_needed,
  //   desired_life_changes,
  //   things_not_working,
  //   things_needed_for_community_activity,
  //   things_needed_for_health_and_safety,
  //   support_needed
  // }

  pool
    .query(QUERIES.TreatmentPlan.UpdateTreatmentPlanDetails)
    .then((res) => res.status)
    .catch((err) => console.error('Error executing query', err.stack));

  res.status(200);
});

// Endpoint 16
router.post('/transportationForm/saveTransportationRequest/', (req, res) => {
  const requestObj = [
    req.body.veteran_id,
    req.body.appointmentDate,
    req.body.time,
    req.body.reason,
    req.body.destinationAddress,
    req.body.destinationAddress2,
    req.body.city,
    req.body.selectedState,
    req.body.zipcode,
    req.body.dateRequested
  ];
  console.log('FormData:', req.body);

  pool
    .query(QUERIES.TransportationRequest.SaveTransportationDetails, requestObj)
    .then((resp) => {
      console.log('success on endpoint SaveTransportationDetails');
      res.status(200).json({
        vetID: req.body.veteran_id,
        status: true,
        result: 'Successfully saved transportation request'
      });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ err });
    });
});

// Endpoint 17
router.get('/transportationForm/getTransportationRequests/', (req, res) => {
  pool
    .query(QUERIES.TransportationRequest.GetTransportationRequests)
    .then((resp) => {
      console.log('success on endpoint GetTransportationRequests');
      res.json(resp.rows);
    })
    .catch((err) => {
      console.error('Error exectuting query', err.stack);
      res.status(501).json({ err });
    });
});

// Endpoint 18
router.post('/transportationForm/approveTransportationRequests', (req, res) => {
  const requestObj = [
    req.body.request_id,
    req.body.coordinator,
    req.body.nursing_notified,
    req.body.notified_by,
    req.body.approved_date,
    req.body.date
  ];
  console.log('FormData ', req.body);

  pool
    .query(
      QUERIES.TransportationRequest.ApproveTransportationRequests,
      requestObj
    )
    .then((resp) => {
      console.log('success on endpoint ApproveTransportationDetails');
      res.status(200).json({
        status: true,
        result: 'Successfully approved transportation request'
      });
    })
    .catch((err) => {
      console.error('Error exectuting query', err.stack);
      res.status(501).json({ err });
    });
});

// Endpoint
router.post(
  '/healthTracker/saveHealthTrackerRequest/:veteranId',
  (req, res) => {
    const trackerReq = Object.values(req.body);
    for (let i = 0; i < trackerReq.length; i++) {
      const requestParams = trackerReq[i];
      const requestObj = [
        req.params.veteranId,
        requestParams.trackingSubject,
        requestParams.date,
        requestParams.measurement,
        requestParams.comments
      ];
      if (requestParams.isUpdate) {
        pool
          .query(QUERIES.HealthTracker.updateHealthTrackerRequest, requestObj)
          .then(() => {
            console.log('sucess on endpoint UpdateHealthTracker');
          })
          .catch((err) => console.error('Error executing query', err.stack));
      } else {
        pool
          .query(QUERIES.HealthTracker.saveHealthTrackerRequest, requestObj)
          .then(() => {
            console.log('sucess on endpoint SaveHealthTracker');
          })
          .catch((err) => console.error('Error executing query', err.stack));
      }
    }
    // handling status
    res.status(200).json({
      status: true,
      result: 'Successfully saved Health Tracker request'
    });
  }
);

// Endpoint
router.get('/healthTracker/getHealthTracker/:veteranId', (req, res) => {
  const requestObj = [req.params.veteranId];
  pool
    .query(QUERIES.HealthTracker.getHealthTracker, requestObj)
    .then((resp) => {
      console.log('Sucess on get HealthTracker');
      res.json({ result: resp.rows });
    })
    .catch((err) => console.error('Error executing query', err.stack));
});

// const veteran1 = {
//   first_name: 'John',
//   last_name: 'Smith',
//   email: 'some@example.com',
//   consent_received: true
// }

const getUser = (userId) => users.find((u) => u.id === parseInt(userId));
const getUserIndex = (userId) =>
  users.findIndex((u) => u.id === parseInt(userId));

// Ephemeral in-memory data store
const users = [
  {
    id: 1,
    name: 'Joe'
  },
  {
    id: 2,
    name: 'Jane'
  }
];
let userIdCounter = users.length;

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router);

// Export your express server so you can import it in the lambda function.
module.exports = app;
