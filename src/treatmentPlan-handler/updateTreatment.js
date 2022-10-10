const secrets = require('../secret');
const { Pool } = require('pg');
const { QUERIES } = require('../constants');
const pool = new Pool({
  host: secrets.HOST,
  user: secrets.USER,
  password: secrets.DBENTRY,
  database: secrets.DATABASE,
  port: secrets.PORT
});

const updateTreatment = async (req) => {
  const vet = req.params.veteran_id;
  const treatmentIssues = req.body.treatmentIssues[0];
  let i; let j; let k; let l; let m; let n; let o; let p = 0;
  // physical health
  for (i = 0; i < treatmentIssues.physicalHealth.length; i++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.physicalHealth[i].goalid;
    const goals = treatmentIssues.physicalHealth[i].goals;
    const plans = treatmentIssues.physicalHealth[i].plans;
    const strategies = treatmentIssues.physicalHealth[i].strategies;
    const targetDate = treatmentIssues.physicalHealth[i].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // mental health
  for (j = 0; j < treatmentIssues.mentalHealth.length; j++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.mentalHealth[j].goalid;
    const goals = treatmentIssues.mentalHealth[j].goals;
    const plans = treatmentIssues.mentalHealth[j].plans;
    const strategies = treatmentIssues.mentalHealth[j].strategies;
    const targetDate = treatmentIssues.mentalHealth[j].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Substance Use
  for (k = 0; k < treatmentIssues.substanceUse.length; k++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.substanceUse[k].goalid;
    const goals = treatmentIssues.substanceUse[k].goals;
    const plans = treatmentIssues.substanceUse[k].plans;
    const strategies = treatmentIssues.substanceUse[k].strategies;
    const targetDate = treatmentIssues.substanceUse[k].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Housing
  for (l = 0; l < treatmentIssues.housing.length; l++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.housing[l].goalid;
    const goals = treatmentIssues.housing[l].goals;
    const plans = treatmentIssues.housing[l].plans;
    const strategies = treatmentIssues.housing[l].strategies;
    const targetDate = treatmentIssues.housing[l].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Income/Financial/Legal
  for (m = 0; m < treatmentIssues.incomeLegal.length; m++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.incomeLegal[m].goalid;
    const goals = treatmentIssues.incomeLegal[m].goals;
    const plans = treatmentIssues.incomeLegal[m].plans;
    const strategies = treatmentIssues.incomeLegal[m].strategies;
    const targetDate = treatmentIssues.incomeLegal[m].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Relationships
  for (n = 0; n < treatmentIssues.relationships.length; n++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.relationships[n].goalid;
    const goals = treatmentIssues.relationships[n].goals;
    const plans = treatmentIssues.relationships[n].plans;
    const strategies = treatmentIssues.relationships[n].strategies;
    const targetDate = treatmentIssues.relationships[n].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Education
  for (o = 0; o < treatmentIssues.education.length; o++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.education[o].goalid;
    const goals = treatmentIssues.education[o].goals;
    const plans = treatmentIssues.education[o].plans;
    const strategies = treatmentIssues.education[o].strategies;
    const targetDate = treatmentIssues.education[o].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
  // Benefits/MedicAid/Snap
  for (p = 0; p < treatmentIssues.benefits.length; p++) {
    let treatmentGoalObj; let treatmentPlanObj = null;
    const goalId = treatmentIssues.benefits[p].goalid;
    const goals = treatmentIssues.benefits[p].goals;
    const plans = treatmentIssues.benefits[p].plans;
    const strategies = treatmentIssues.benefits[p].strategies;
    const targetDate = treatmentIssues.benefits[p].targetDate;
    if (goals) {
      treatmentGoalObj = [
        vet,
        goalId,
        goals,
        targetDate
      ];
      treatmentPlanObj = [
        goalId,
        plans,
        strategies
      ];
      await treatmentGoals(treatmentGoalObj);
      await treatmentPlans(treatmentPlanObj);
    }
  }
};

const headers = (initialTreatmentObj) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.TreatmentPlan.UpdateTreatmentPlanDetails, initialTreatmentObj,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

const treatmentGoals = (treatmentGoalObj) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.TreatmentIssues.UpdateTreatmentGoals, treatmentGoalObj,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

const treatmentPlans = (treatmentPlanObj) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.TreatmentIssues.UpdateTreatmentPlans, treatmentPlanObj,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = async function (initialTreatmentObj, req) {
  try {
    await updateTreatment(req);
    await headers(initialTreatmentObj);
    const updateStatement = console.log('Successfully updated TreatmentIssues');
    return updateStatement;
  } catch (error) {
    console.log(error);
  }
};
