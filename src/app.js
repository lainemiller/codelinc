const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const { getCurrentInvoke } = require('@vendia/serverless-express')
const ejs = require('ejs').__express
const app = express()
const router = express.Router()

var constants = require('./constants');
const sequentialQueries  = require ('../src/AssessmentHandler/assessment.js');
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
  res.cookie('Foo', 'bar')
  res.cookie('Fizz', 'buzz')
  res.json({})
})

// Endpoint 4
router.get('/consentForm/getUserDetails/:veteranId', (req, res) => {
  const vet = req.params.veteranId;
  console.log(vet);
  let returnObj = null

  pool
  .query(QUERIES.ConsentForm.GetUserDetails, [vet])
  .then(res => returnObj = res.rows)
  .catch(err => console.error('Error executing query', err.stack))

  res.json(returnObj);

})


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
router.put('/consentForm/acceptContent/:veteranId', (req, res) => {
  const vet = req.params.veteranId;
  const returnStatus = null

  pool
  .query(QUERIES.ConsentForm.AcceptContent, vet)
  .then(res => returnStatus = res.status)
  .catch(err => console.error('Error executing query', err.stack))

  res.status(returnStatus);

})

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
router.put('/userProfile/updateUserDetails/', (req, res) => {
  let returnStatus = null
  console.log("incoming req: ", req.body)
 let nick_name=req.body.nick_name;
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
  .then(res => {returnStatus = res.status
  console.log(returnStatus);})
  .catch(err => console.error('Error executing query', err.stack))

  res.status(returnStatus);

})

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
// Case Manager GetTreatmentPlanDetails
router.get('getTreatmentPlanDetails', (req, res) => {
  const params = {
    veteran_id: req.body.veteran_id,
  }
  const returnObj = null

    pool
    .query(QUERIES.TreatmentPlan.GetTreatmentPlanDetails, params)
    .then(res => returnObj = res.rows)
    .catch(err => console.error('Error executing query', err.stack))
    
    res.json(returnObj);

})

// Endpoint 15
router.post('/updateTreatmentPlan', (req, res) => {
  
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
    support_needed
  }

  pool
  .query(QUERIES.TreatmentPlan.UpdateTreatmentPlanDetails, vet)
  .then(res => returnStatus = res.status)
  .catch(err => console.error('Error executing query', err.stack))

  res.status(returnStatus);

})

//Endpoint 16
router.post('/transportationForm/saveTransportationRequest/', (req, res) => {

  const requestObj = [
    req.body.veteranId,
    req.body.appointmentDate,
    req.body.appointmentTime,
    req.body.reasonForRequest,
    req.body.pickupAddress,
    req.body.pickupCity,
    req.body.pickupState,
    req.body.pickupZipcode,
    req.body.dateFilled
  ]

  pool
  .query(QUERIES.TransportationRequest.SaveTransportationDetails, requestObj)
  .then(resp => {
    console.log('success on endpoint SaveTransportationDetails')
    res.json({vetID:req.body.veteranId, result: 'Successfully saved transportation request'})
  })
  .catch(err => {
    console.error('Error executing query', err.stack)
    res.status(501).json({err})
  })
})

// Endpoint 17
router.get('/transportationForm/getTransportationRequests/:veteranId', (req, res) => {
  const veteran = req.params.veteranId

  pool
  .query(QUERIES.TransportationRequest.GetTransportationRequests, [veteran])
  .then(resp => {
    console.log('success on endpoint GetTransportationRequests')
    res.json({veteranId: veteran, result: resp.rows})
  })
  .catch(err => {
    console.error('Error exectuting query', err.stack)
    res.status(501).json({err})
  })
})

// Endpoint 18
router.post('/transportationForm/approveTransportationRequests', (req, res) => {

  const requestObj = [
    req.body.requestId,
    req.body.transportCoordinator,
    req.body.nursingNotified,
    req.body.notifiedBy,
    req.body.approvedDate
   //$1,
   //$2,
   //$3,
   //$4,
   //$5
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

const getUser = (userId) => users.find(u => u.id === parseInt(userId))
const getUserIndex = (userId) => users.findIndex(u => u.id === parseInt(userId))

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
