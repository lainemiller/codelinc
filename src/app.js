/* eslint-disable no-unused-vars */
// const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
// const { getCurrentInvoke } = require('@vendia/serverless-express')
const ejs = require('ejs').__express;
const app = express();
const router = express.Router();
const multer = require('multer');
const uploadToS3 = require('./imageUploadService/uploadImage.js');

// const constants = require('./constants')
const sequentialQueries = require('./assessment-handler/assessment.js');
const saveTreatmentPlan = require('./treatmentPlan-handler/treatmentIssue.js');
const veteranEventsQueries = require('./veteranEvents-handler/veteranEvent.js');
const iaFormsQueries = require('./initialAssessmentFormsHandler/iaForm.js');
const iaFormsQueriesp2 = require('./initialAssessmentFormsHandler/iaFormP2');
const iaFormP1Post = require('./initialAssessmentFormsHandler/iaFormP1');
const secrets = require('./secret');
const healthTrackerQueries = require('./healthTrackerHandler/healthTracker.js');

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

router.get('/calendarEvents', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getCalendarEvents);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});

router.post('/postCalendarEvents', (req, res) => {
  const requestObj = [

    req.body.case_worker_id,
    req.body.participants,
    req.body.isAppointment,
    req.body.title,
    req.body.description,
    req.body.sTime,
    req.body.enTime
  ];
  pool
    .query(QUERIES.calendarAPis.postEventsForCaseworker, requestObj)
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

router.get('/getCalendarEvents/:caseWorkerId', (req, res) => {
  const caseWorkerId = req.params.caseWorkerId;
  pool
    .query(QUERIES.calendarAPis.getCalendarEventsForCaseworker, [caseWorkerId])
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

router.get('/getCurrentVeteranEvents/:veteranId', async (req, res) => {
  const veteranId = req.params.veteranId;
  const veteranEventDetails = await veteranEventsQueries(veteranId);
  res
    .status(200)
    .json({ responseStatus: 'SUCCESS', data: veteranEventDetails, error: false });
});

router.get('/progressNotes', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getProgressNotes);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});

router.get('/residentSearch/getAll', (req, res) => {
  pool
    .query(QUERIES.TreatmentPlan.GetAllDetails)
    .then(resp => {
      console.log('success on endpoint GetAllDetails');
      res.json(resp.rows);
    })

    .catch(err => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ err });
    });
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

// Assessment Details API
router.get('/assessmentDetails/:veteranID', async (req, res) => {
  const vet = req.params.veteranID;
  const assessmentDetails = await sequentialQueries(vet);
  res.status(200).json(assessmentDetails);
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

// Endpoint 4
router.get('/consentForm/getUserDetails/:loginId', (req, res) => {
  const loginId = req.params.loginId;

  pool
    .query(QUERIES.ConsentForm.GetUserDetails, [loginId])
    .then((resp) => {
      res.status(200).json({ responseStatus: 'SUCCESS', data: resp.rows, error: false });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
    });
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

  res.status(200).json({ responseStatus: 'SUCCESS', data: 'Successfully Accepted Consent Form', error: false });
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
      res.status(200).json(response.rows);
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
router.post('/progressNotes/addGoal/:veteranId', (req, res) => {
  // let goalId = null
  const requestObj = [
    req.params.veteranId,
    req.body.goalTitle,
    req.body.goalType,
    req.body.goalDescription,
    req.body.goalState,
    req.body.addedDate
  ];
  pool
    .query(QUERIES.ProgressNotes.AddGoal, requestObj)
    .then((resp) => {
      console.log('success on endpoint add progress notes');
      res
        .status(200)
        .json({ responseStatus: 'SUCCESS', data: resp.rows, error: false });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res
        .status(500)
        .json({ responseStatus: 'FAILURE', data: null, error: err });
    });
});

// Endpoint 9
router.put('/progressNotes/updateGoalStatus/:veteranId', (req, res) => {
  const requestObj = [req.params.veteranId, req.body.goalId, req.body.goalState];
  pool
    .query(QUERIES.ProgressNotes.UpdateGoalStatus, requestObj)
    .then((resp) => {
      console.log('success on endpoint updating progress notes status');
      res
        .status(200)
        .json({ responseStatus: 'SUCCESS', data: resp.rows[0], error: false });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res
        .status(200)
        .json({ responseStatus: 'FAILURE', data: null, error: err });
    });
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

router.get('/uiLayout/getCaseWorkerDetails/:caseWorkerId', (req, res) => {
  const caseWorker = req.params.caseWorkerId;

  pool
    .query(QUERIES.UiLayout.GetUserDetailsForCaseWorker, [caseWorker])
    .then((resp) => {
      console.log('success on endpoint GetUserDetailsForCaseWorker');
      res.json(resp.rows);
    })
    .catch((err) => {
      console.error('Error exectuting query', err.stack);
      res.status(501).json({ err });
    });
});

// Endpoint 11
router.put('/userProfile/updateUserDetails/:veteranId', (req, res) => {
  const requestObj = [
    req.params.veteranId,
    req.body.firstName,
    req.body.middleName,
    req.body.lastName,
    req.body.nickName,
    req.body.DOB,
    req.body.POB,
    req.body.phoneNumber,
    req.body.cfirstName,
    req.body.hobbies,
    req.body.address1,
    req.body.city,
    req.body.selectedState,
    req.body.selectedRelationship,
    req.body.country,
    req.body.address2,
    req.body.zipCode,
    req.body.selectedGenders,
    req.body.selectedMaritalStatus,
    req.body.SSNNumber,
    req.body.hmisIdNo,
    req.body.race,
    req.body.primaryLanguage,
    req.body.relegion,
    req.body.cHouseNumber,
    req.body.cPhoneNumber
  ];

  pool
    .query(QUERIES.UserProfile.UpdateUserDetails, requestObj)
    .then(() => {
      res.status(200).json({ responseStatus: 'SUCCESS', data: 'Profile Updated Sucessfully', error: false });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
    });
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
// VeteranTreatmentPlan Get details & CaseWorkerTreatmentPlan(RS) Get details
router.get('/getTreatmentPlanDetails/:veteran_id', (req, res) => {
  const params = req.params.veteran_id;
  pool
    .query(QUERIES.TreatmentPlan.GetTreatmentPlanDetails, [params])
    .then((resp) => {
      res.status(200).json({ responseStatus: 'SUCCESS', data: resp.rows[0], error: false });
      console.log('success on endpoint GetTreatmentPlanDetails');
    })
    .catch(err => {
      res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
      console.error('Error executing query', err.stack);
    });
});

// Endpoint 14.5
// VeteranSaveTreatmentPlan Post details
router.post('/postTreatmentPlanDetails/save/:veteran_id', async (req, res) => {
  const vet = req.params.veteran_id;
  // Saving initial TPD
  const requestObj = [
    vet,
    req.body.veteranDiagnosis,
    req.body.veteranSupports,
    req.body.veteranStrengths,
    req.body.veteranNotes
  ];
  pool
    .query(QUERIES.TreatmentPlan.SaveTreatmentPlanDetails, requestObj)
    .then(resp => {
      res.status(200).json({ responseStatus: 'SUCCESS', data: 'saved Successfully', error: false });
      console.log('Successfully saved Initial TPD');
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: 'null', error: err });
    });

  // Saving TreatmentIssues
  const result = saveTreatmentPlan(req);
  console.log(result);
});

// Endpoint 15
// Case-Worker UpdateTreatmentPlan
router.put('/updateTreatmentPlanDetails/save/:veteran_id', (req, res) => {
  const requestObj = [
    req.params.veteran_id,
    req.body.veteranDiagnosis,
    req.body.veteranSupports,
    req.body.veteranStrengths,
    req.body.veteranNotes
  ];
  pool
    .query(QUERIES.TreatmentPlan.UpdateTreatmentPlanDetails, requestObj)
    .then(resp => {
      res.status(200).json({ responseStatus: 'SUCCESS', data: 'Updated Successfully', error: false });
      console.log('Successfully updated treatmentPlanDetails');
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: 'null', error: err });
    });
});

// Endpoint 16
router.post('/transportationForm/saveTransportationRequest/', (req, res) => {
  const requestObj = [
    req.body.veteran_id,
    req.body.contactNumber,
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
        responseStatus: 'SUCCESS',
        vetID: req.body.veteran_id,
        status: true,
        result: 'Successfully saved transportation request'
      });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', error: err });
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
        responseStatus: 'SUCCESS',
        status: true,
        result: 'Successfully approved transportation request'
      });
    })
    .catch((err) => {
      console.error('Error exectuting query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', error: err });
    });
});

// Endpoint
router.get('/healthTracker/getHealthTracker/:veteranId', (req, res) => {
  const requestObj = [req.params.veteranId];
  pool
    .query(QUERIES.HealthTracker.getHealthTracker, requestObj)
    .then((resp) => {
      console.log('Sucess on get HealthTracker');
      res.status(200).json({ responseStatus: 'SUCCESS', data: resp.rows, error: false });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
    });
});

// Endpoint
router.post(
  '/healthTracker/updateHealthTracker/:veteranId',
  async (req, res) => {
    const trackerReq = req.body;
    const healthTrackerResponse = await healthTrackerQueries(trackerReq[0], trackerReq[1], req.params.veteranId)
      .then((response) => {
        res.status(200).json({ responseStatus: 'SUCCESS', data: response, error: false });
      }).catch((err) => {
        console.error('Error executing query', err.stack);
        res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
      });
  }
);

// Endpoint
router.get('/getVeteranId/:userName', (req, res) => {
  const requestObj = [req.params.userName];
  pool
    .query(QUERIES.UiLayout.getVeteranId, requestObj)
    .then((resp) => {
      console.log('Sucess on get Veteran Id');
      res.status(200).json({ responseStatus: 'SUCCESS', data: resp.rows, error: false });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
    });
});

// Endpoint
router.post('/addUser', (req, res) => {
  const requestObject = [
    req.body.userName,
    req.body.userGroup,
    'Lincon#123', // password
    req.body.partyId
  ];
  pool.query(QUERIES.UiLayout.addUser, requestObject)
    .then((resp) => {
      console.log('Sucess on Add User');
      res.status(200).json({ responseStatus: 'SUCCESS', data: 'User Added Successfully', error: false });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
    });
});

// Endpoint add Veteran
router.post('/addVeteran', (req, res) => {
  const requestObject = [
    req.body.veteranId, //
    req.body.firstName,
    req.body.lastName,
    'x', // address_main
    'x', // city
    'x', // state
    1234, // zip_code
    '1777-09-15T07:16:10.261Z', // date_of_birth
    'x', // place_of_birth
    1234, // ssn
    'x', // gender
    'x', // marital_status
    'x', // race
    'x', // primary_language
    'x', // religious_preference
    'x', // contact_person
    'x', // contact_person_relationship
    1234, // contact_person_phone
    false, // consent_status
    req.body.nickName,
    req.body.email
  ];
  pool.query(QUERIES.UiLayout.addVeteran, requestObject)
    .then(() => {
      console.log('Sucess on Add Veteran');
      res.status(200).json({ responseStatus: 'SUCCESS', data: 'Veteran Added Successfully', error: false });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
    });
});

// Endpoint add CaseWorker
router.post('/addCaseWorker', (req, res) => {
  const requestObject = [
    req.body.caseWorkerId,
    req.body.nickName,
    req.body.email
  ];
  pool.query(QUERIES.UiLayout.addCaseWorker, requestObject)
    .then(() => {
      console.log('Sucess on Add CaseWorker');
      res.status(200).json({ responseStatus: 'SUCCESS', data: 'Caseworker Added Successfully', error: false });
    })
    .catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
    });
});

const upload = multer({
  limits: 1024 * 5,
  fileFilter: function (req, file, done) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      done(null, true);
    } else {
      done(new Error('Wrong file type, only upload JPEG and/or PNG !'),
        false);
    }
  }
});

router.post('/api/v2/upload', upload.single('image'), async (req, res) => {
  console.log('file data', req.file);
  if (req.file) {
    uploadToS3(req.file.buffer, req.file.originalname).then((result) => {
      return res.json({
        msg: 'uploaded',
        imageUrl: result.location
      });
    }).catch((err) => {
      console.log(err);
    });
  }
});

// get api for ia page 1
router.get('/initialAssessment/page-1/:veteranId', (req, res) => {
  const vet = req.params.veteranId;
  pool
    .query(QUERIES.InitialAssessment.getPage1, [vet])
    .then((resp) => {
      console.log('success on endpoint get ia page 1');
      res.json(resp.rows);
    })
    .catch((err) => {
      console.error('Error exectuting query', err.stack);
      res.status(501).json({ err });
    });
});
// ia forms api testing page1
router.post('/initialAssessment/page-1', async (req, res) => {
  const personalDetails = [
    req.body.personalDetails.veteranID,
    req.body.personalDetails.firstName,
    req.body.personalDetails.middleInitial,
    req.body.personalDetails.lastName,
    req.body.personalDetails.nickName,
    req.body.personalDetails.addressMain,
    req.body.personalDetails.addressLine2,
    req.body.personalDetails.city,
    req.body.personalDetails.state,
    req.body.personalDetails.country,
    req.body.personalDetails.zipcode,
    req.body.personalDetails.primaryPhone,
    req.body.personalDetails.dob,
    req.body.personalDetails.placeOfBirth,
    req.body.personalDetails.ssn,
    req.body.personalDetails.sex,
    req.body.personalDetails.maritalStatus,
    req.body.personalDetails.race,
    req.body.personalDetails.primaryLanguage,
    req.body.personalDetails.contactPerson,
    req.body.personalDetails.relationship,
    req.body.personalDetails.contactPersonAddress,
    req.body.personalDetails.phone,
    req.body.personalDetails.hobbiesInterests,
    req.body.personalDetails.religiousPreferences,
    req.body.personalDetails.consent
  ];

  const income = [
    req.body.personalDetails.veteranID,
    req.body.incomeAndResources.bankAccount,
    req.body.incomeAndResources.bankName,
    req.body.incomeAndResources.cashBenefits,
    req.body.incomeAndResources.directDeposit,
    req.body.incomeAndResources.income,
    req.body.incomeAndResources.nonCashBenefits,
    req.body.incomeAndResources.otherAssets,
    // req.body.incomeAndResources.otherBenefits,
    req.body.incomeAndResources.type,
    req.body.incomeAndResources.receivingBenefits,
    req.body.incomeAndResources.applyingBenefits
  ];

  const insu = [
    req.body.personalDetails.veteranID,
    req.body.incomeAndResources.medicaid,
    req.body.incomeAndResources.vaCoverage,
    req.body.incomeAndResources.medicareCoverage,
    req.body.incomeAndResources.othMedCoverage
  ];

  const social = [
    req.body.personalDetails.veteranID,
    req.body.socialAndFamilyHistory.childhood,
    // req.body.socialAndFamilyHistory.children,
    req.body.socialAndFamilyHistory.currentMaritalStatus,
    req.body.socialAndFamilyHistory.discipline,
    // req.body.socialAndFamilyHistory.fatherStatus,
    // req.body.socialAndFamilyHistory.fathersFullName,
    req.body.socialAndFamilyHistory.healthProblemsInFamily,
    req.body.socialAndFamilyHistory.hivTestDesired,
    req.body.socialAndFamilyHistory.hivTestResult,
    req.body.socialAndFamilyHistory.hivTestedDate,
    req.body.socialAndFamilyHistory.hivTestedLocation,
    req.body.socialAndFamilyHistory.married,
    // req.body.socialAndFamilyHistory.motherStatus,
    // req.body.socialAndFamilyHistory.mothersFullName,
    req.body.socialAndFamilyHistory.numberOfMarriages,
    req.body.socialAndFamilyHistory.physicalAbuse,
    req.body.socialAndFamilyHistory.relationShipWithParents,
    req.body.socialAndFamilyHistory.relationShipWithSiblings,
    req.body.socialAndFamilyHistory.sexualAbuse,
    req.body.socialAndFamilyHistory.sexualOrientation,
    req.body.socialAndFamilyHistory.sexualProblemsOrConcerns,
    req.body.socialAndFamilyHistory.sexuallyActive,
    // req.body.socialAndFamilyHistory.siblings,
    req.body.socialAndFamilyHistory.specifySexualProblems,
    // req.body.socialAndFamilyHistory.spouseOrSignificantOther,
    req.body.socialAndFamilyHistory.stdTestResult,
    req.body.socialAndFamilyHistory.stdTestedDate,
    req.body.socialAndFamilyHistory.stdTestedLocation,
    req.body.socialAndFamilyHistory.testedForHivOrAids,
    req.body.socialAndFamilyHistory.testedSTDs,
    req.body.socialAndFamilyHistory.substanceAbuse
  ];

  // pool.query(QUERIES.UiLayout.addCaseWorker,requestObject)
  // .then(()=>{
  //   console.log('Sucess on Add CaseWorker');
  //   res.status(200).json({ responseStatus: 'SUCCESS', data:'Caseworker Added Successfully', error: false });
  // })
  // .catch((err)=>{
  //   console.error('Error executing query', err.stack);
  //   res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
  // })

  const result = await iaFormP1Post(personalDetails, income, insu, social)
    .then((response) => {
      res.status(200).json({ responseStatus: 'SUCCESS', data: response, error: false });
    }).catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
    });
  console.log('res', result);
  console.log('Personal Details', personalDetails);
  console.log('Income and Resources', income);
  console.log('Social and Family', social);
});

// get api for ia page 2
router.get('/initialAssessment/page-2/:veteranId', (req, res) => {
  const vet = req.params.veteranId;
  pool
    .query(QUERIES.InitialAssessment.getPage2, [vet])
    .then((resp) => {
      console.log('success on endpoint get ia page 2');
      res.status(200).json(resp.rows);
    })
    .catch((err) => {
      console.error('Error exectuting query', err.stack);
      res.status(501).json({ err });
    });
});

// ia forms api testing page2
router.post('/initialAssessment/page-2', async (req, res) => {
  const edu = [
    req.body.educationAndEmploymentHistory.branch,
    req.body.educationAndEmploymentHistory.currentEmployer,
    req.body.educationAndEmploymentHistory.currentEmployerLocation,
    req.body.educationAndEmploymentHistory.highestGradeCompleted,
    // req.body.educationAndEmploymentHistory.jobDate,
    // req.body.educationAndEmploymentHistory.jobEmployedInLongest,
    req.body.educationAndEmploymentHistory.military,
    req.body.educationAndEmploymentHistory.mostRecentJob,
    req.body.educationAndEmploymentHistory.nameAndLocation,
    req.body.educationAndEmploymentHistory.otherTrainingEducation,
    req.body.educationAndEmploymentHistory.otherTrainingOrSkills,
    // req.body.educationAndEmploymentHistory.reasonForLeaving,
    req.body.educationAndEmploymentHistory.serviceDate,
    req.body.educationAndEmploymentHistory.serviceLocation,
    req.body.educationAndEmploymentHistory.typeOfDischarge,
    req.body.educationAndEmploymentHistory.currentJob,
    req.body.educationAndEmploymentHistory.veteranId
  ];

  const mental = [
    req.body.mentalHealthInformation.currentPsychiatricTreatment,
    req.body.mentalHealthInformation.diagnosis,
    req.body.mentalHealthInformation.needPsychiatricCunsultant,
    req.body.mentalHealthInformation.pastTreatments,
    req.body.mentalHealthInformation.psychEvaluatorAddress,
    req.body.mentalHealthInformation.psychEvaluatorCity,
    req.body.mentalHealthInformation.psychEvaluatorLicense,
    req.body.mentalHealthInformation.psychEvaluatorName,
    req.body.mentalHealthInformation.psychEvaluatorState,
    req.body.mentalHealthInformation.psychEvaluatorZipcode,
    req.body.mentalHealthInformation.psychiatristAddress,
    req.body.mentalHealthInformation.psychiatristName,
    req.body.mentalHealthInformation.veteranId,
    req.body.mentalHealthInformation.psychiatristCityState
  ];

  // pool.query(QUERIES.UiLayout.addCaseWorker,requestObject)
  // .then(()=>{
  //   console.log('Sucess on Add CaseWorker');
  //   res.status(200).json({ responseStatus: 'SUCCESS', data:'Caseworker Added Successfully', error: false });
  // })
  // .catch((err)=>{
  //   console.error('Error executing query', err.stack);
  //   res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
  // })

  const result = await iaFormsQueriesp2(edu, mental)
    .then((response) => {
      res.status(200).json({ responseStatus: 'SUCCESS', data: response, error: false });
    }).catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
    });
  console.log('res', result);
  console.log('Education and Employment History', edu);
  console.log('Mental Health History', mental);
});

// ia forms api testing page3
router.post('/initialAssessment/page-3', (req, res) => {
  const medInfo = [
    req.body.medicalInformation.clinic,
    req.body.medicalInformation.currentMedication,
    req.body.medicalInformation.diagnosisAndCurrentTreatment,
    req.body.medicalInformation.hospital,
    req.body.medicalInformation.phone,
    req.body.medicalInformation.physicianSpecialist,
    req.body.medicalInformation.primaryPhysicianName
  ];

  const menStaAssess = [
    req.body.mentalStatusAssessment.affect,
    req.body.mentalStatusAssessment.generalAppearance,
    req.body.mentalStatusAssessment.ideation.delusional,
    req.body.mentalStatusAssessment.ideation.hallucinations,
    req.body.mentalStatusAssessment.ideation.homicidePlan,
    req.body.mentalStatusAssessment.ideation.paranoid,
    req.body.mentalStatusAssessment.ideation.suicidePlan,
    req.body.mentalStatusAssessment.ideation.thoughtsOfHomicide,
    req.body.mentalStatusAssessment.ideation.thoughtsOfSuicide,
    req.body.mentalStatusAssessment.memory.recentMemory,
    req.body.mentalStatusAssessment.memory.remoteMemory,
    req.body.mentalStatusAssessment.mood.answeredByClient,
    req.body.mentalStatusAssessment.mood.observedByInterviewer,
    req.body.mentalStatusAssessment.orientation.date,
    req.body.mentalStatusAssessment.orientation.person,
    req.body.mentalStatusAssessment.orientation.place,
    req.body.mentalStatusAssessment.orientation.time,
    req.body.mentalStatusAssessment.thoughtForum
  ];
  // pool.query(QUERIES.UiLayout.addCaseWorker,requestObject)
  // .then(()=>{
  //   console.log('Sucess on Add CaseWorker');
  //   res.status(200).json({ responseStatus: 'SUCCESS', data:'Caseworker Added Successfully', error: false });
  // })
  // .catch((err)=>{
  //   console.error('Error executing query', err.stack);
  //   res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
  // })

  console.log('Medical Information', medInfo);
  console.log('Mental Status Assessment', menStaAssess);
});

// get api for ia page 4
router.get('/initialAssessment/page-4/:veteranId', (req, res) => {
  const vet = req.params.veteranId;
  pool
    .query(QUERIES.InitialAssessment.getPage4, [vet])
    .then((resp) => {
      console.log('success on endpoint get ia page 4');
      res.json(resp.rows);
    })
    .catch((err) => {
      console.error('Error exectuting query', err.stack);
      res.status(501).json({ err });
    });
});

// ia forms api testing page4
router.post('/initialAssessment/page-4', async (req, res) => {
  const legal = [
    req.body.legalHistoryOrIssues.arrestedReason,
    req.body.legalHistoryOrIssues.charges,
    req.body.legalHistoryOrIssues.convictedReason,
    req.body.legalHistoryOrIssues.currentPendingCharges,
    req.body.legalHistoryOrIssues.everArrested,
    req.body.legalHistoryOrIssues.everConvicted,
    req.body.legalHistoryOrIssues.officerAddress,
    req.body.legalHistoryOrIssues.officerName,
    req.body.legalHistoryOrIssues.onProbationOrParole,
    req.body.legalHistoryOrIssues.outstandingWarrants,
    req.body.legalHistoryOrIssues.probationOrParoleTerms,
    req.body.legalHistoryOrIssues.veteranId,
    req.body.legalHistoryOrIssues.warrantReason
  ];

  const subAbu = [
    req.body.substanceAbuseHistory.currentAlcoholIntakeFreq,
    req.body.substanceAbuseHistory.currentCaffeineIntakeFreq,
    req.body.substanceAbuseHistory.currentDrugAlcoholTreatment,
    req.body.substanceAbuseHistory.currentDrugIntakeFreq,
    req.body.substanceAbuseHistory.currentTobaccoIntakeFreq,
    req.body.substanceAbuseHistory.currentlyConsumesAlcohol,
    req.body.substanceAbuseHistory.currentlyConsumesCaffeine,
    req.body.substanceAbuseHistory.currentlyConsumesDrugs,
    req.body.substanceAbuseHistory.currentlyConsumesTobacco,
    req.body.substanceAbuseHistory.histOfAlcohol,
    req.body.substanceAbuseHistory.histOfCaffeine,
    req.body.substanceAbuseHistory.histOfDrugs,
    req.body.substanceAbuseHistory.histOfTobacco,
    req.body.substanceAbuseHistory.lastUseOfDrugAlcohol,
    req.body.substanceAbuseHistory.treatmentPrograms,
    req.body.substanceAbuseHistory.veteranId,
    req.body.substanceAbuseHistory.withdrawalHistory
  ];
  // const vet = req.params.veteranID;
  const resultssss = await iaFormsQueries(legal, subAbu)
    .then((response) => {
      res.status(200).json({ responseStatus: 'SUCCESS', data: response, error: false });
    }).catch((err) => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
    });

  console.log('res', resultssss);
  // console.log(legal);
  // console.log(subAbu);
});

// get api for ia page 5
router.get('/initialAssessment/page-5/:veteranId', (req, res) => {
  const vet = req.params.veteranId;
  pool
    .query(QUERIES.InitialAssessment.getPage5, [vet])
    .then((resp) => {
      console.log('success on endpoint get ia page 5');
      res.json(resp.rows);
    })
    .catch((err) => {
      console.error('Error exectuting query', err.stack);
      res.status(501).json({ err });
    });
});

// ia forms api testing page5
router.post('/initialAssessment/page-5', (req, res) => {
  const preliminary = [
    req.body.preliminaryTreatmentGoals.additionalComments,
    req.body.preliminaryTreatmentGoals.hppenedInMyLifeLastYear,
    req.body.preliminaryTreatmentGoals.longTermGoals,
    req.body.preliminaryTreatmentGoals.needs,
    req.body.preliminaryTreatmentGoals.preferences,
    req.body.preliminaryTreatmentGoals.shortTermGoals,
    req.body.preliminaryTreatmentGoals.strengthAndResources,
    req.body.preliminaryTreatmentGoals.supports
  ];
  // pool.query(QUERIES.UiLayout.addCaseWorker,requestObject)
  // .then(()=>{
  //   console.log('Sucess on Add CaseWorker');
  //   res.status(200).json({ responseStatus: 'SUCCESS', data:'Caseworker Added Successfully', error: false });
  // })
  // .catch((err)=>{
  //   console.error('Error executing query', err.stack);
  //   res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
  // })

  console.log('Preliminary Treatment Goals', preliminary);
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
