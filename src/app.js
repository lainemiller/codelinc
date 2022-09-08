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
const treatmentQueries = require('./treatmentPlan-handler/postTreatment.js');
const secrets = require('./secret');

const { Pool } = require('pg')
const { QUERIES } = require('./constants')
const pool = new Pool({
  host: secrets.HOST,
  user: secrets.USER,
  password: secrets.PASSWORD,
  database: secrets.DATABASE,
  port: secrets.PORT
})


pool.on('error', (err, client) => {
  console.error('unexpected error in postress conection pool', err);
});

app.set('view engine', 'ejs')
app.engine('.ejs', ejs)

router.use(compression())

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


router.get('/', (req, res) => {
  res.json({answer: 'success'});
})

router.get('/users', (req, res) => {
  res.json(users)
})

router.get('/queryString', (req, res) => {
  const query = req.query;
  res.json({
    qs: query,
    congratulate: true
  })
})

router.get('/users/:userId', (req, res) => {
  const user = getUser(req.params.userId)

  if (!user) return res.status(404).json({})

  return res.json(user)
})

router.post('/users', (req, res) => {
  const user = {
    id: ++userIdCounter,
    name: req.body.name
  }
  users.push(user)
  res.status(201).json(user)
})

router.put('/users/:userId', (req, res) => {
  const user = getUser(req.params.userId)

  if (!user) return res.status(404).json({})

  user.name = req.body.name
  res.json(user)
})

router.delete('/users/:userId', (req, res) => {
  const userIndex = getUserIndex(req.params.userId)

  if (userIndex === -1) return res.status(404).json({})

  users.splice(userIndex, 1)
  res.json(users)
})

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
 
  const users = require(QUERIES.myApisJsonUrls.getCalendarEvents)
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});

router.get('/progressNotes', (req, res) => {
 
  const users = require(QUERIES.myApisJsonUrls.getProgressNotes)
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);

})

router.get('/residentSearch/getAll', (req, res) => {
  
  pool
  .query(QUERIES.TreatmentPlan.GetAllDetails)
  .then(resp => {
    console.log('success on endpoint GetAllDetails')
    res.json(resp.rows)
  })
  .catch(err => {
    console.error('Error executing query', err.stack)
    res.status(501).json({err});
  })


})
router.get('/consentData', (req, res) => {
 
  const users = require(QUERIES.myApisJsonUrls.getConsentData)
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

  res.json(users);
});

router.get('/transportationRequestData', (req, res) => {
 
  const users = require(QUERIES.myApisJsonUrls.GetTransportationData)
  // pool
  // .query(QUERIES.UiLayout.GetUserDetailsForVet, [vet])
  // .then(res => console.log(res))
  // .catch(err => console.error('Error executing query', err.stack))

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
router.put('/consentForm/acceptContent/:veteranId', (req, res) => {
  const vet = req.params.veteranId;
  const returnStatus = null

  pool
  .query(QUERIES.ConsentForm.AcceptContent, vet)
  .then(res => returnStatus = res.status)
  .catch(err => console.error('Error executing query', err.stack))

  res.status(200).json({ responseStatus: 'SUCCESS', data: 'Successfully Accepted Consent Form', error: false });
});

// Endpoint 6
router.get('/uiLayout/getUserDetails/:veteranId', (req, res) => {
  const vet = req.params.veteranId;
  const returnObj = null

  pool
  .query(QUERIES.ConsentForm.GetUserDetails, vet)
  .then(res => returnObj = res.rows)
  .catch(err => console.error('Error executing query', err.stack))

  res.json(returnObj);

})

// Endpoint 7
router.get('/getGoals/:veteranId', (req, res) => {
  const vet = req.params.veteranId;
  const returnObj = null

  pool
  .query(QUERIES.ProgressNotes.GetGoals, vet)
  .then(res => returnObj = res.rows)
  .catch(err => console.error('Error executing query', err.stack))

  res.json(returnObj);

})

// Endpoint 8
router.post('/progressNotes/addGoal/', (req, res) => {
  const goalId = null

  const requestObj = {
    status: req.body.status, 
    title: req.body.title, 
    description: req.body.description
  }

  pool
  .query(QUERIES.ProgressNotes.AddGoal, requestObj)
  .then(res => goalId = res.rows[0])
  .catch(err => console.error('Error executing query', err.stack))

  res.json(goalId);

})

// Endpoint 9
router.post('/progressNotes/updateGoalStatus/', (req, res) => {
  const goalId = null

  const requestObj = {
    goalId: req.body.goalId, 
    status: req.body.status
  }

  pool
  .query(QUERIES.ProgressNotes.UpdateGoalStatus, requestObj)
  .then(res => goalId = res.rows[0])
  .catch(err => console.error('Error executing query', err.stack))

  res.json(goalId);

})

// Endpoint 10
router.get('/userProfile/getUserDetails/:veteranID', (req, res) => {

  pool
    .query(QUERIES.UserProfile.GetUserDetails, [req.params.veteranID])
    .then(resp => {
      console.log('success on endpoint 10: ', resp)
      res.json({vetID: req.params.veteranID, result: resp.rows})
    })
    .catch(err => {
      console.error('Error executing query', err.stack)
      res.status(501).json({err});
    })
})

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
  const returnObj = null

  pool
  .query(QUERIES.UiLayout.GetUserDetails, caseWorker)
  .then(res => returnObj = res.rows)
  .catch(err => console.error('Error executing query', err.stack))

  res.json(returnObj);

})

// Endpoint 13
router.get('getUnreadMessageCount', (req, res) => {
  const returnObj = null

  pool
  .query(QUERIES.UiLayout.GetUnreadMessageCount)
  .then(res => returnObj = res.rows)
  .catch(err => console.error('Error executing query', err.stack))

  res.json(returnObj);

})

// Endpoint 14
// VeteranTreatmentPlan Get details & CaseWorkerTreatmentPlan(RS) Get details
router.get('/getTreatmentPlanDetails/:veteran_id', (req, res) => {
  const params =  req.params.veteran_id
  pool
  .query(QUERIES.TreatmentPlan.GetTreatmentPlanDetails,[params])
  .then((resp) => {
    res.status(200).json({ responseStatus: 'SUCCESS',data: resp.rows[0],error:false})
    console.log('success on endpoint GetTreatmentPlanDetails')
  })
  .catch(err => {
    res.status(501).json({ responseStatus: 'FAILURE', data: null, error: err });
    console.error('Error executing query', err.stack)
    
  })
})


//Endpoint 14.5
//VeteranSaveTreatmentPlan Post details
router.post('/postTreatmentPlanDetails/save/:veteran_id', async (req, res) => {
 
  const vet=req.params.veteran_id
  const treatmentIssues = req.body.treatmentIssues[0]  
  const requestObj=[
    vet,
    req.body.veteranDiagnosis,
    req.body.veteranSupports,
    req.body.veteranStrengths,
    req.body.veteranNotes
  ]
  pool
  .query(QUERIES.TreatmentPlan.SaveTreatmentPlanDetails, requestObj)
  .then(resp => {
    res.status(200).json({ responseStatus: 'SUCCESS',data: 'saved Successfully',error:false})
    console.log('Successfully saved Initial TPD')
    })
  .catch(err => {
    console.error('Error executing query', err.stack)
    res.status(501).json({ responseStatus: 'FAILURE', data: 'null', error:err})
  })
  //PhysicalHealth
  for(i=0; i<3; i++){
    let requestObjIssuesPH=null;
    const goals= treatmentIssues.physicalHealth[i].goals
    const plans= treatmentIssues.physicalHealth[i].plans
    const strategies= treatmentIssues.physicalHealth[i].strategies
    const targetDate= treatmentIssues.physicalHealth[i].targetDate
    requestObjIssuesPH=[  
    vet,
    goals,
    req.body.addedDate,
    targetDate,
    plans,
    strategies
  ]
  const returnStatement = await treatmentQueries(requestObjIssuesPH);
  res.status(200).json(returnStatement) 
}
//MentalHealth
  for(i=0; i<3; i++){
    let requestObjIssuesMH=null;
    const goals= treatmentIssues.mentalHealth[i].goals
    const plans= treatmentIssues.mentalHealth[i].plans
    const strategies= treatmentIssues.mentalHealth[i].strategies
    const targetDate= treatmentIssues.mentalHealth[i].targetDate
    requestObjIssuesMH=[  
    vet,
    goals,
    req.body.addedDate,
    targetDate,
    plans,
    strategies
  ]
  const returnStatement = await treatmentQueries(requestObjIssuesMH);
  res.status(200).json(returnStatement) 
  }
  
})

//Endpoint 15
//Case-Worker UpdateTreatmentPlan 
router.put('/updateTreatmentPlanDetails/save/:veteran_id', (req, res) => {
  
  const requestObj=[
    req.params.veteran_id,
    req.body.veteranDiagnosis,
    req.body.veteranSupports,
    req.body.veteranStrengths,
    req.body.veteranNotes
  ]
  pool
  .query(QUERIES.TreatmentPlan.UpdateTreatmentPlanDetails, requestObj)
  .then(resp => {
    res.status(200).json({ responseStatus: 'SUCCESS',data: 'Updated Successfully',error:false})
    console.log('Successfully updated treatmentPlanDetails')
    })
  .catch(err => {
    console.error('Error executing query', err.stack)
    res.status(501).json({ responseStatus: 'FAILURE', data: 'null', error:err})
  })
})


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


const veteran1 = {
  first_name: 'John',
  last_name: 'Smith',
  email: 'some@example.com',
  consent_received: true
}

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

router.post('/api/v1/upload', upload.single("image"), async (req, res) => {

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
const users = [{
  id: 1,
  name: 'Joe'
}, {
  id: 2,
  name: 'Jane'
}]
let userIdCounter = users.length

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router)

// Export your express server so you can import it in the lambda function.
module.exports = app
