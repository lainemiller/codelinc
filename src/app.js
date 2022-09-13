// const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
// const { getCurrentInvoke } = require('@vendia/serverless-express')
const ejs = require('ejs').__express;
const app = express();
const router = express.Router();
const upload = require('./imageUploadService/uploadImage.js');

// const constants = require('./constants')
const sequentialQueries = require('./assessment-handler/assessment.js');
const veteranEventsQueries = require('./veteranEvents-handler/veteranEvent.js');
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

router.get('/calendarEvents', (req, res) => {
  const users = require(QUERIES.myApisJsonUrls.getCalendarEvents);
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});

router.post('/postCalendarEvents',(req,res)=>{
  const requestObj =[

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
        .status(200)
        .json({ responseStatus: 'FAILURE', data: null, error: err });
    });
});

// Endpoint 9
router.put('/progressNotes/updateGoalStatus/:veteranId', (req, res) => {
  const requestObj = [req.params.veteranId, req.body.goalTitle, req.body.goalState];
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
  console.log('incoming req: ', req.body.DOB);
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
      console.log('success on endpoint GetTreatmentPlanDetails');
      res.json(resp.rows[0]);
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ err });
    });
});

// Endpoint 14.5
// VeteranTreatmentPlan Save details
router.post('/postTreatmentPlanDetails/save', (req, res) => {
  const requestObj = [
    4,
    req.body.intakeDOB,
    req.body.veteranDiagnosis,
    req.body.veteranSupports
  ];
  pool
    .query(QUERIES.TreatmentPlan.SaveTreatmentPlanDetails, requestObj)
    .then(resp => {
      console.log('Successfully saved treatmentPlanDetails');
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
      res.status(501).json({ err });
    });
});

// Endpoint 15
// Case-Worker UpdateTreatmentPlan
router.put('/updateTreatmentPlanDetails/save/:veteran_id', (req, res) => {
  const requestObj = [
    req.params.veteran_id,
    req.body.veteranDiagnosis,
    req.body.veteranSupports
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
    new Date(), // date_of_birth
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

router.post('/api/v1/upload', upload.single('image'), async (req, res) => {
  /* This will be th 8e response sent from the backend to the frontend */
  // console.log('req is =>',req)
  // console.log('res is =>',res)
  res.send({ image: req.file });
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
